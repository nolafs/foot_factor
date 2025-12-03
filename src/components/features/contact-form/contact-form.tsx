'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { type ContactFormInput } from '@/types';
import React, { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
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
  const [enquiryTypeOptions, setEnquiryTypeOptions] = useState<ContactFormSectionSliceDefaultPrimaryItemsItem[]>(
    items ?? [],
  );

  useEffect(() => {
    // Set up Turnstile callback to store token when verification completes
    (window as any).onTurnstileSuccess = (token: string) => {
      const input = document.getElementById('turnstileToken') as HTMLInputElement | null;
      if (input) {
        input.value = token;
      }
    };
  }, []);

  useEffect(() => {
    const fetchEnquiryTypes = async () => {
      const options = await getEnquireTypeOptions();
      setEnquiryTypeOptions(options);
    };

    void fetchEnquiryTypes();
  }, []);

  const form = useForm<ContactFormInput>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      name: '',
      email: '',
      enquiryType: '',
      message: '',
      agreeToTerms: false,
    },
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

      // Get Turnstile token if available (will be verified server-side)
      const tokenInput = document.getElementById('turnstileToken') as HTMLInputElement | null;
      const token = tokenInput?.value || '';
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
        form.reset();
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
    <div className="w-full text-primary">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} method="post" className="space-y-6">
          {/* Honeypot – hidden field for bots */}
          <input type="text" name="contact_time" autoComplete="off" tabIndex={-1} style={{ display: 'none' }} />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your@email.com" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="enquiryType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nature of Enquiry</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select enquiry type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {enquiryTypeOptions.length ? (
                      enquiryTypeOptions.map((item, index) => {
                        if (item.value == null) return null;
                        return (
                          <SelectItem key={`${item.value}-${index}`} value={item.value}>
                            {item.label}
                          </SelectItem>
                        );
                      })
                    ) : (
                      <>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="billing">Can we chat!</SelectItem>
                        <SelectItem value="support">Pricing and Quoting</SelectItem>
                        <SelectItem value="feedback">Collaboration</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea placeholder="Your message..." rows={4} {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agreeToTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>I agree to the Terms & Conditions</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <div className="flex w-full justify-end pt-6">
            {/* Turnstile widget - invisible, runs in background */}
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
              variant="default"
              size="lg"
              className={cn(`${isSubmitting ? 'loading' : ''}`, 'bg-accent')}
              disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default ContactForm;
