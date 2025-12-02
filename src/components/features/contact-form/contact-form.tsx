'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { type ContactFormInput } from '@/types';
import React, { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import cn from 'clsx';
import { sendMail } from '@/action';

import { type ContactFormSectionSliceDefaultPrimaryItemsItem } from '@/prismic-types';
import { createClient } from '@/prismicio';

const emailSchema = z.object({
  name: z.string().min(1, 'Please enter your name'),
  email: z.string().email('Please enter a valid email address'),
  enquiryType: z.string().min(1, 'Please select the nature of your enquiry'),
  message: z.string().min(1, 'Please enter your message'),
  agreeToTerms: z.boolean().refine(val => val, 'You must agree to the Terms & Conditions'),
  turnstileToken: z.string().optional(),
  contact_time: z.string().optional(),
});

export type EmailSchema = z.infer<typeof emailSchema>;

const getEnquireTypeOptions = async () => {
  const client = createClient();
  const settings = await client.getSingle('settings');

  return settings.data.contact_form_enquiries ?? [];
};

interface ContactFormInputProps {
  items: ContactFormSectionSliceDefaultPrimaryItemsItem[];
}

export function ContactForm({ items }: ContactFormInputProps) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [enquiryTypeOptions, setEnquiryTypeOptions] = useState<ContactFormSectionSliceDefaultPrimaryItemsItem[]>(
    items ?? [],
  );

  useEffect(() => {
    console.log('[Turnstile] Setting up callbacks and initialization');

    // Manually render Turnstile widget to avoid auto-render issues
    console.log('[Turnstile] Checking if Turnstile script is loaded...');
    console.log('[Turnstile] Site key:', process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

    let widgetId: string | null = null;
    let cleanupAttempted = false;

    const initTurnstile = () => {
      if (cleanupAttempted) return;

      const widget = document.getElementById('turnstile-widget');
      console.log('[Turnstile] Widget element found:', !!widget);
      console.log('[Turnstile] Turnstile API available:', !!(window as any).turnstile);

      if (widget && (window as any).turnstile && !widgetId) {
        try {
          console.log('[Turnstile] Manually rendering widget...');
          widgetId = (window as any).turnstile.render('#turnstile-widget', {
            sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
            callback: (token: string) => {
              console.log(
                '[Turnstile] ✅ Callback: Verification successful, token received:',
                token?.substring(0, 20) + '...',
              );
              const input = document.getElementById('turnstileToken') as HTMLInputElement | null;
              if (input) {
                input.value = token;
                console.log('[Turnstile] Token set in hidden input');
              }
              setIsVerified(true);
              console.log('[Turnstile] Submit button should now be enabled');
            },
            'error-callback': (errorCode: string) => {
              console.error('[Turnstile] ❌ Error callback:', errorCode);
              setIsVerified(false);
              toast.error('Verification failed. Please refresh the page and try again.');
            },
            'expired-callback': () => {
              console.warn('[Turnstile] ⚠️ Expired callback: Token expired');
              setIsVerified(false);
            },
            theme: 'light',
            size: 'invisible',
          });
          console.log('[Turnstile] ✅ Widget rendered with ID:', widgetId);
        } catch (error) {
          console.error('[Turnstile] ❌ Error rendering widget:', error);
        }
      }
    };

    const waitForTurnstile = () => {
      if ((window as any).turnstile) {
        console.log('[Turnstile] Script already loaded, initializing immediately');
        initTurnstile();
      } else {
        console.log('[Turnstile] Waiting for script to load...');
        const interval = setInterval(() => {
          if ((window as any).turnstile) {
            console.log('[Turnstile] Script loaded, initializing now');
            initTurnstile();
            clearInterval(interval);
          }
        }, 100);

        // Timeout after 10 seconds
        setTimeout(() => {
          if (!(window as any).turnstile) {
            console.error('[Turnstile] ❌ Script failed to load after 10 seconds');
            clearInterval(interval);
            toast.error('Security verification failed to load. Please refresh the page.');
          }
        }, 10000);

        return () => {
          clearInterval(interval);
          cleanupAttempted = true;
          if (widgetId && (window as any).turnstile?.remove) {
            try {
              (window as any).turnstile.remove(widgetId);
            } catch (e) {
              console.log('[Turnstile] Widget already removed or does not exist');
            }
          }
        };
      }
    };

    return waitForTurnstile();
  }, []);

  useEffect(() => {
    const fetchEnquiryTypes = async () => {
      const options = await getEnquireTypeOptions();
      setEnquiryTypeOptions(options);
    };

    void fetchEnquiryTypes();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormInput>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit: SubmitHandler<EmailSchema> = async data => {
    console.log('[Form] Submit initiated');
    console.log('[Form] isVerified state:', isVerified);
    setIsSubmitting(true);

    const tokenInput = document.getElementById('turnstileToken') as HTMLInputElement | null;
    let token = tokenInput?.value || '';
    console.log('[Form] Token from input:', token ? token.substring(0, 20) + '...' : 'EMPTY');

    // If token is not present, the invisible widget should have already run
    // We'll give it a moment and check again
    if (!token) {
      console.log('[Form] No token found, waiting for Turnstile to complete...');

      // Wait a bit longer for the invisible widget to complete
      await new Promise(resolve => setTimeout(resolve, 2000));
      token = tokenInput?.value || '';
      console.log('[Form] Token after waiting:', token ? token.substring(0, 20) + '...' : 'STILL EMPTY');

      // If still no token, try to reset and re-verify
      if (!token) {
        console.log('[Form] Attempting to reset Turnstile widget...');
        const widget = document.getElementById('turnstile-widget');

        if (widget && (window as any).turnstile?.reset) {
          try {
            console.log('[Form] Resetting Turnstile...');
            (window as any).turnstile.reset(widget);
            // Wait for verification after reset
            await new Promise(resolve => setTimeout(resolve, 2000));
            token = tokenInput?.value || '';
            console.log('[Form] Token after reset:', token ? token.substring(0, 20) + '...' : 'STILL EMPTY');
          } catch (error) {
            console.error('[Form] ❌ Error resetting Turnstile:', error);
          }
        } else {
          console.error('[Form] ❌ Cannot reset Turnstile - widget or API not available');
        }
      }
    }

    if (!token) {
      console.error('[Form] ❌ No token available, aborting submission');
      toast.error('Verification failed. Please try again.');
      setIsSubmitting(false);
      setIsVerified(false);
      return;
    }

    console.log('[Form] ✅ Token validated, proceeding with submission');

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email || '');
      formData.append('message', data.message || '');
      formData.append('enquiryType', data.enquiryType || '');
      formData.append('agreeToTerms', data.agreeToTerms ? 'true' : 'false');

      // Turnstile token – this is what the server will verify
      formData.append('cf-turnstile-response', token);

      // Honeypot
      const honeypotInput = document.querySelector('input[name="contact_time"]') as HTMLInputElement | null;
      const honeypotValue = honeypotInput?.value ?? '';
      formData.append('contact_time', honeypotValue);

      const { success, errors, msg } = await sendMail(formData);

      if (success) {
        setIsSubmitting(false);
        setSubmissionSuccess(true);
        toast.success(msg);
        reset();
        setIsVerified(false);
        // Clear the token so it needs to be re-verified
        if (tokenInput) tokenInput.value = '';
        return;
      }

      if (errors) {
        console.error('[ContactForm]', errors);
        toast.error('There was an error sending your message. Please try again later.');
      }

      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      console.error('[ContactForm]', error);
      toast.error('There was an error sending your message. Please try again later.');
    }
  };

  const handleContinue = () => {
    setSubmissionSuccess(false);
    setIsSubmitting(false);
    setIsVerified(false);

    // Reset Turnstile widget to get a new token
    setTimeout(() => {
      const widget = document.getElementById('turnstile-widget');
      if (widget && (window as any).turnstile?.reset) {
        console.log('[Turnstile] Resetting widget for new submission');
        (window as any).turnstile.reset(widget);
      }
    }, 100);
  };

  if (submissionSuccess) {
    return (
      <div className={'container mx-auto flex flex-col'}>
        <div className="mb-10 font-bold">Your message has been sent successfully! We will get back to you soon.</div>
        <div className="flex w-full justify-end">
          <Button variant={'default'} size={'lg'} onClick={handleContinue}>
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-control w-full text-primary">
      <form onSubmit={handleSubmit(onSubmit)} noValidate method="post" className="space-y-4">
        {/* Honeypot – hidden field for bots */}
        <input type="text" name="contact_time" autoComplete="off" tabIndex={-1} style={{ display: 'none' }} />
        <input
          type="text"
          placeholder="Name"
          className={cn(
            `input input-bordered w-full ${errors.name ? 'input-error' : ''}`,
            'rounded-md border-gray-200',
          )}
          {...register('name')}
          disabled={isSubmitting}
        />
        {errors.name && <p className="text-sm font-medium text-destructive">{errors.name.message}</p>}

        <input
          type="email"
          placeholder="Email"
          className={cn(
            `input input-bordered w-full ${errors.email ? 'input-error' : ''}`,
            'rounded-md border-gray-200',
          )}
          {...register('email')}
          disabled={isSubmitting}
        />
        {errors.email && <p className="text-sm font-medium text-destructive">{errors.email.message}</p>}

        <select
          aria-label={'Nature of Enquiry'}
          className={cn(
            `select select-bordered w-full ${errors.enquiryType ? 'select-error' : ''}`,
            'rounded-md border-gray-200',
          )}
          {...register('enquiryType')}
          disabled={isSubmitting}
          defaultValue="">
          <option value="" disabled>
            Nature of Enquiry
          </option>
          {enquiryTypeOptions.length ? (
            enquiryTypeOptions.map((item, index) => {
              if (item.value == null) return null; // skip items with undefined or null value

              return (
                <option key={`${item.value}-${index}`} value={item.value}>
                  {item.label}
                </option>
              );
            })
          ) : (
            <>
              <option value="general">General Inquiry</option>
              <option value="billing">Can we chat!</option>
              <option value="support">Pricing and Quoting</option>
              <option value="feedback">Collaboration</option>
              <option value="other">Other</option>
            </>
          )}
        </select>
        {errors.enquiryType && <p className="text-sm font-medium text-destructive">{errors.enquiryType.message}</p>}

        <textarea
          placeholder="Message"
          className={cn(
            `textarea textarea-bordered w-full ${errors.message ? 'textarea-error' : ''}`,
            'rounded-md border-gray-200',
          )}
          {...register('message')}
          rows={4}
          disabled={isSubmitting}
        />
        {errors.message && <p className="text-sm font-medium text-destructive">{errors.message.message}</p>}

        <div className="flex flex-col items-center">
          <div className="w-full">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className={cn(`checkbox ${errors.agreeToTerms ? 'checkbox-error' : ''}`, 'rounded-md')}
                {...register('agreeToTerms')}
                id="agreeToTerms"
              />
              <label htmlFor="agreeToTerms" className="text-base">
                I agree to the Terms & Conditions
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-sm font-medium text-destructive">{errors.agreeToTerms.message}</p>
            )}
          </div>

          <div className="flex w-full justify-end pt-6">
            {/* Submit Button */}

            {/* Turnstile widget – manually rendered in useEffect to avoid auto-render issues */}
            <input type="hidden" name="cf-turnstile-response" id="turnstileToken" />
            <div id="turnstile-widget" className="cf-turnstile" />

            <Button
              type="submit"
              variant="default"
              size="lg"
              className={cn(`${isSubmitting ? 'loading' : ''}`, 'bg-accent')}
              disabled={!isVerified || isSubmitting}>
              {isSubmitting ? 'Submitting...' : isVerified ? 'Submit' : 'Verifying security...'}
            </Button>
            {!isVerified && !isSubmitting && (
              <p className="mt-2 text-xs text-muted-foreground">Checking security verification...</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default ContactForm;
