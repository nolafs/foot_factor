'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { type ContactFormInput } from '@/types';
import React, {forwardRef, useRef, useState} from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import cn from 'clsx';
import { sendMail, VerifyCaptcha } from '@/action';
import ReCAPTCHA from 'react-google-recaptcha';
import {ContactFormSectionSliceDefaultPrimaryItemsItem} from '@/prismic-types';

const RECAPTCHA_ACTIVE = process.env.NEXT_PUBLIC_RECAPTCHA_ACTIVE === 'true';

const emailSchema = z.object({
  name: z.string().min(1, 'Please enter your name'),
  email: z.string().email('Please enter a valid email address'),
  enquiryType: z.string().min(1, 'Please select the nature of your enquiry'),
  message: z.string().min(1, 'Please enter your message'),
  agreeToTerms: z.boolean().refine(val => val, 'You must agree to the Terms & Conditions'),
});

export type EmailSchema = z.infer<typeof emailSchema>;

interface ContactFormInputProps {
  items: ContactFormSectionSliceDefaultPrimaryItemsItem[];
}

export function ContactForm({ items }: ContactFormInputProps) {
  //const captchaRef: any = useRef(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const [isVerified, setIsVerified] = useState(!RECAPTCHA_ACTIVE);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormInput>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit: SubmitHandler<EmailSchema> = async data => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email || '');
      formData.append('message', data.message || '');
      formData.append('enquiryType', data.enquiryType || '');
      formData.append('agreeToTerms', data.agreeToTerms ? 'true' : 'false');

      const { success, errors } = await sendMail(formData);

      console.log('Form submission result:', success);

      if (success) {
        setIsSubmitting(false);
        setSubmissionSuccess(true);
        toast.success('Your message has been sent!');
        reset(); // Optionally reset form fields
        return;
      }

      if (errors) {
        setIsSubmitting(false);
        toast.error('There was an error sending your message. Please try again later.');
        return;
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error(error);
      toast.error('There was an error sending your message. Please try again later.');
      return;
    }
  };

  const handleContinue = () => {
    setSubmissionSuccess(false);
    setIsSubmitting(false);
    setIsVerified(false);
  };

  async function handleCaptchaSubmission(token: string | null) {
    try {
      if (token) {
        await VerifyCaptcha(token);
        setIsVerified(true);
      }
    } catch (e) {
      setIsVerified(false);
      console.error(e);
    }
  }

  const handleChange = (token: string | null) => {
    if (token) {
      void handleCaptchaSubmission(token);
    }
  };

  function handleExpired() {
    setIsVerified(false);
  }

  if (submissionSuccess) {
    return (
      <div className={'container mx-auto flex flex-col'}>
        <div className="mb-10 font-bold">
          Your message has been sent successfully! We will get back to you soon.
        </div>
        <div className="flex w-full justify-end">
          <Button variant={'default'} size={'lg'} onClick={handleContinue}>
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-control w-full  text-primary">
      <form onSubmit={handleSubmit(onSubmit)} noValidate method="post" className="space-y-4">
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
        {errors.name && <p className="text-error">{errors.name.message}</p>}

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
        {errors.email && <p className="text-error">{errors.email.message}</p>}

        <select
          aria-label={'Nature of Enquiry'}
          className={cn(
            `select select-bordered w-full ${errors.enquiryType ? 'select-error' : ''}`,
            'rounded-md border-gray-200',
          )}
          {...register('enquiryType')}
          disabled={isSubmitting}>
          <option value="" disabled defaultValue="">
            Nature of Enquiry
          </option>
          {items.length ? (
              items.map((item, index) => {
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
        {errors.enquiryType && <p className="text-error">{errors.enquiryType.message}</p>}

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
        {errors.message && <p className="text-error">{errors.message.message}</p>}

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
            {errors.agreeToTerms && <p className="text-error">{errors.agreeToTerms.message}</p>}
          </div>

          {RECAPTCHA_ACTIVE && (
              React.createElement(ReCAPTCHA as any, {
                sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '',
                ref: recaptchaRef,
                onChange: handleChange,
                onExpired: handleExpired,
              })
          )}

          <div className="flex w-full justify-end pt-6">
            {/* Submit Button */}
            {isVerified}
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
      <Toaster />
    </div>
  );
}

export default ContactForm;
