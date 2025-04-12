import React from 'react';

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
import { Input } from '@/components/ui/input';
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
import {MakeBookingDocumentData} from '../../../../prismicio-types';
import { Textarea } from '@/components/ui/textarea';


const FormSchema = z.object({
  existingPatient: z.boolean().default(false).optional(),
  referralPatient: z.boolean().default(false).optional(),
  name: z.string().min(1, {
    message: 'Name is required',
  }).optional(),
  surname: z.string().min(1, {
    message: 'Surname is required',
  }).optional(),
  dateOfBirth: z.date({
    required_error: "A date of birth is required.",
  }),
  email: z.string().email({
    message: 'Email is invalid',
  }).optional(),
  appointmentType: z.string().min(1, {
    message: 'Appointment type is required',
  }).optional(),
  telephone: z.string().min(1, {
    message: 'Telephone is required',
  }).optional(),
  referralName: z.string().min(1, {
    message: 'Name is required',
  }).optional(),
  referralSurname: z.string().min(1, {
    message: 'Surname is required',
  }).optional(),
  referralEmail: z.string().email( {
    message: 'Email is invalid',
  }).optional(),
  referralTelephone: z.string().email({
    message: 'Email is invalid',
  }).optional(),
  message: z.string().min(1, {
    message: 'Message is required',
  }).optional(),
})

interface BookingFormProps {
  booking: MakeBookingDocumentData;
}

export const BookingForm = ({booking}: BookingFormProps) => {

  const [isReferralPatient, setIsReferralPatient] = React.useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      existingPatient: false,
      referralPatient: false,
    },
  })

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data);
  }

  const onChangeReferralPatient = (value: boolean) => {
    setIsReferralPatient(value);
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
                        )} />
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
                              <FormMessage />
                          </FormItem>
                      )} />
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
                              <FormMessage />
                          </FormItem>
                      )} />
                  </div>
                <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({field}) => (
                        <FormItem className="flex flex-col w-full">
                          <FormLabel>Date of birth</FormLabel>
                          <Popover>
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
                    name="email"
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
                                    value={appointment.value || ''}
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
                                      {...field}
                                  />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )} />

                <FormField
                    control={form.control}
                    name="telephone"

                    render={({field}) => (
                        <FormItem>
                          <FormLabel>Telephone</FormLabel>
                          <FormControl>
                            <Input
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
                                  onCheckedChange={(checked) => {
                                    field.onChange(checked); // Update the form state
                                    onChangeReferralPatient(checked); // Pass the boolean value
                                  }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Referral patient?
                            </FormLabel>
                          </FormItem>
                      )}/>
                </div>

                {isReferralPatient && (<div>
                    <div className={'grid grid-cols-1 md:grid-cols-2 gap-x-5'}>
                      <FormField
                          control={form.control}
                          name="referralName"
                          render={({field}) => (
                              <FormItem>
                                  <FormLabel>Referrer's Name</FormLabel>
                                  <FormControl>
                                      <Input
                                          {...field}
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )} />
                      <FormField
                          control={form.control}
                          name="referralSurname"
                          render={({field}) => (
                              <FormItem>
                                  <FormLabel>Referrer's Surname</FormLabel>
                                  <FormControl>
                                      <Input
                                          {...field}
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )} />
                    </div>
                      <FormField
                          control={form.control}
                          name="referralEmail"
                          render={({field}) => (
                              <FormItem>
                                  <FormLabel>Referrer's Email</FormLabel>
                                  <FormControl>
                                      <Input
                                          {...field}
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )} />

                      <FormField
                          control={form.control}
                          name="referralTelephone"
                          render={({field}) => (
                              <FormItem>
                                  <FormLabel>Referrer's Telephone</FormLabel>
                                  <FormControl>
                                      <Input
                                          {...field}
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )} />
                    </div> )}

                <FormField
                    control={form.control}
                    name="message"
                    render={({field}) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea
                                placeholder="Message"
                                className="resize-none"
                                {...field}
                            />
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                    )}
                />

                  <Button type="submit">Submit</Button>
              </form>
              </Form>


  )
}

export default BookingForm;
