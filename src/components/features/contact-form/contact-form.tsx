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
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(true);
  const [enquiryTypeOptions, setEnquiryTypeOptions] = useState<ContactFormSectionSliceDefaultPrimaryItemsItem[]>(
    items ?? [],
  );

  useEffect(() => {
    (window as any).onTurnstileSuccess = (token: string) => {
      const input = document.getElementById('turnstileToken') as HTMLInputElement;
      input.value = token;
      setTurnstileToken(token);
      setIsVerified(true);
    };
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

  const onSubmit: SubmitHandler<ContactFormInput> = async data => {
    setIsSubmitting(true);

    try {
      // Extra guard: make sure Turnstile ran
      if (!turnstileToken) {
        toast.error("Please confirm you're not a robot.");
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email || '');
      formData.append('message', data.message || '');
      formData.append('enquiryType', data.enquiryType || '');
      formData.append('agreeToTerms', data.agreeToTerms ? 'true' : 'false');

      // Turnstile token – this is what the server will verify
      formData.append('cf-turnstile-response', turnstileToken);

      // Honeypot: read the hidden field value (bots may fill this)
      const honeypotInput = document.querySelector('input[name="contact_time"]') as HTMLInputElement | null;
      const honeypotValue = honeypotInput?.value ?? '';
      formData.append('contact_time', honeypotValue);

      const { success, errors, msg } = await sendMail(formData);

      if (success) {
        setIsSubmitting(false);
        setSubmissionSuccess(true);
        toast.success(msg);
        reset();
        setTurnstileToken(null);
        setIsVerified(false);
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

            {/* Turnstile widget – uses global callback we defined in useEffect */}
            <input type="hidden" name="cf-turnstile-response" id="turnstileToken" />
            <div
              id="turnstile-widget"
              className="cf-turnstile"
              data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              data-callback="onTurnstileSuccess"
              data-size="invisible"
            />

            <Button
              type="submit"
              variant={'default'}
              size={'lg'}
              className={cn(`${isSubmitting ? 'loading' : ''}`, 'bg-accent')}
              disabled={!isVerified || isSubmitting}>
              {isSubmitting ? 'Submitting' : 'Submit'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ContactForm;
