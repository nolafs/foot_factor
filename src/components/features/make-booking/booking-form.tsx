import React, {useEffect, useRef, useState} from 'react';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel, FormMessage,
} from '@/components/ui/form'
import {format} from "date-fns"
import {Button} from "@/components/ui/button"
import {Switch} from "@/components/ui/switch"
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {Input} from '@/components/ui/input';
import {Calendar} from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {CalendarIcon} from 'lucide-react';
import cn from 'clsx';
import {type MakeBookingDocumentData} from '@/prismic-types';
import {Textarea} from '@/components/ui/textarea';
import {Checkbox} from '@/components/ui/checkbox';
import Link from 'next/link';
import {emailBookingSchema} from '@/types/email-booking.type';
import ReCAPTCHA from 'react-google-recaptcha';
import toast from 'react-hot-toast';
import {sendMail} from '@/action';
import {sendBookingMail} from '@/action/send-booking-request';

const RECAPTCHA_ACTIVE = process.env.NEXT_PUBLIC_RECAPTCHA_ACTIVE === 'true';

interface BookingFormProps {
  booking: MakeBookingDocumentData;
}

export const BookingForm = ({booking}: BookingFormProps) => {

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  //const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const [isVerified, setIsVerified] = useState(true);

  const form = useForm<z.infer<typeof emailBookingSchema>>({
    resolver: zodResolver(emailBookingSchema),
    defaultValues: {
      existingPatient: false,
      referralPatient: false,
      name: '',
      surname: '',
      email: '',
      telephone: '',
      appointmentType: '',
      message: '',
      referralName: '',
      referralSurname: '',
      referralEmail: '',
      referralTelephone: '',
      //terms: false,
      //privacy: false,
    },
  })

  // Watch form values for conditional rendering
  const isReferralPatient = form.watch('referralPatient');

  const onSubmit = async (data: z.infer<typeof emailBookingSchema>) => {
    setIsSubmitting(true);
    try {

      console.log('Form data:', data);

      const {data: success, errors} = await sendBookingMail(data);

      if (success) {
        setIsSubmitting(false);
        setSubmissionSuccess(true);
        toast.success('Your message has been sent!');
        form.reset(); // Optionally reset form fields
      }

      if (errors) {
        console.error('Booking form errors:', errors);
        setIsSubmitting(false);
        toast.error('There was an error sending your message. Please try again later.');
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error(error);
      toast.error('There was an error sending your message. Please try again later.');
      setSubmissionSuccess(false);
    }
  }

  if (submissionSuccess) {
    return (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Booking Request Submitted</h2>
          <p className="text-lg">Thank you for your booking request. We will be in touch shortly.</p>
          <Button
              variant={'default'}
              size={'lg'}
              className={'mt-5 bg-accent'}
              onClick={() => {
                setSubmissionSuccess(false);
                form.reset();
              }}>
            Make another booking </Button>
        </div>
    );
  }


  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-3">
          <div className="flex flex-col space-y-2">
            <FormField
                control={form.control}
                name="existingPatient"
                render={({field}) => (
                    <FormItem className="flex items-center space-x-3">
                      <FormControl>
                        <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Are you an existing patient?
                      </FormLabel>
                    </FormItem>
                )}/>
          </div>
          <div className={'grid grid-cols-1 md:grid-cols-2 gap-x-5'}>
            <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                            {...field}
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                )}/>
            <FormField
                control={form.control}
                name="surname"
                render={({field}) => (
                    <FormItem>
                      <FormLabel>Surname</FormLabel>
                      <FormControl>
                        <Input
                            {...field}
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                )}/>
          </div>
          <FormField
              control={form.control}
              name="dateOfBirth"
              render={({field}) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Date of birth</FormLabel>
                    <Popover modal={true}>
                      <PopoverTrigger asChild className={'w-full'}>
                        <FormControl>
                          <Button
                              variant={"outline"}
                              className={cn(
                                  " pl-3 text-left font-normal w-full rounded-sm",
                                  !field.value && "text-muted-foreground"
                              )}
                          >
                            {field.value ? (
                                format(field.value, "PPP")
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage/>
                  </FormItem>
              )}/>

          <FormField
              control={form.control}
              name="appointmentType"
              render={({field}) => (
                  <FormItem>
                    <FormLabel>Appointment Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type of appointment"/>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {booking.appointment_type.map((appointment, index) => (
                            <SelectItem
                                key={index}
                                value={appointment.value ?? ''}
                                className={'text-sm'}
                            >
                              {appointment.label}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage/>
                  </FormItem>
              )}
          />

          <FormField
              control={form.control}
              name="email"
              render={({field}) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                          type="email"
                          {...field}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
              )}/>

          <FormField
              control={form.control}
              name="telephone"
              render={({field}) => (
                  <FormItem>
                    <FormLabel>Telephone</FormLabel>
                    <FormControl>
                      <Input
                          type="tel"
                          placeholder="07123 456789"
                          {...field}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
              )}/>

          <div className="flex flex-col space-y-2">
            <FormField
                control={form.control}
                name="referralPatient"
                render={({field}) => (
                    <FormItem className="flex items-center space-x-3">
                      <FormControl>
                        <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Referral patient?
                      </FormLabel>
                    </FormItem>
                )}/>
          </div>

          {isReferralPatient && (
              <div className="space-y-3">
                <div className={'grid grid-cols-1 md:grid-cols-2 gap-x-5'}>
                  <FormField
                      control={form.control}
                      name="referralName"
                      render={({field}) => (
                          <FormItem>
                            <FormLabel>Referrer&apos;s Name</FormLabel>
                            <FormControl>
                              <Input
                                  {...field}
                              />
                            </FormControl>
                            <FormMessage/>
                          </FormItem>
                      )}/>
                  <FormField
                      control={form.control}
                      name="referralSurname"
                      render={({field}) => (
                          <FormItem>
                            <FormLabel>Referrer&apos;s Surname</FormLabel>
                            <FormControl>
                              <Input
                                  {...field}
                              />
                            </FormControl>
                            <FormMessage/>
                          </FormItem>
                      )}/>
                </div>
                <FormField
                    control={form.control}
                    name="referralEmail"
                    render={({field}) => (
                        <FormItem>
                          <FormLabel>Referrer&apos;s Email</FormLabel>
                          <FormControl>
                            <Input
                                type="email"
                                {...field}
                            />
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                    )}/>

                <FormField
                    control={form.control}
                    name="referralTelephone"
                    render={({field}) => (
                        <FormItem>
                          <FormLabel>Referrer&apos;s Telephone</FormLabel>
                          <FormControl>
                            <Input
                                type="tel"
                                placeholder="07123 456789"
                                {...field}
                            />
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                    )}/>
              </div>
          )}

          <FormField
              control={form.control}
              name="message"
              render={({field}) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                          placeholder="Tell us about your requirements or any additional information..."
                          className="resize-none"
                          {...field}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
              )}
          />

          <FormField
              control={form.control}
              name="terms"
              render={({field}) => (
                  <FormItem
                      className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Agree to terms and conditions
                      </FormLabel>
                      <FormDescription>
                        Please read our{" "}
                        <Link className={'underline'} href="/legal/terms-and-conditions">terms and
                          conditions</Link> page.
                      </FormDescription>
                    </div>
                  </FormItem>
              )}
          />

          <FormField
              control={form.control}
              name="privacy"
              render={({field}) => (
                  <FormItem
                      className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Agree to our privacy policy
                      </FormLabel>
                      <FormDescription>
                        Please read our {" "}
                        <Link className={'underline'} href="/legal/privacy-policy-for-foot-factor">Privacy
                          Policy</Link> page.
                      </FormDescription>
                    </div>
                  </FormItem>
              )}
          />
          <div className={'flex justify-end mt-8'}>
            <Button
                type="submit"
                variant={'default'}
                size={'lg'}
                className={cn(`${isSubmitting ? 'loading' : ''}`, 'bg-accent')}
                disabled={!isVerified || isSubmitting}>
              {isSubmitting ? 'Submitting' : 'Submit'}
            </Button>
          </div>
        </form>
      </Form>
  )
}

export default BookingForm;
