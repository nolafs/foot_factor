'use server';

import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend';
import { z } from 'zod';
import {createClient} from "@/prismicio";

export const transformZodErrors = async (error: z.ZodError) => {
  return error.issues.map(issue => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));
};

const emailSchema = z.object({
  name: z.string().min(1, 'Please enter your name'),
  email: z.string().email('Please enter a valid email address'),
  enquiryType: z.string().min(1, 'Please select the nature of your enquiry'),
  message: z.string().min(1, 'Please enter your message'),
  agreeToTerms: z.boolean().refine(val => val, 'You must agree to the Terms & Conditions'),
});
export async function sendMail(formData: FormData) {
  const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY ?? '',
  });

  try {
    const validatedFields = emailSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      enquiryType: formData.get('enquiryType'),
      message: formData.get('message'),
      agreeToTerms: formData.get('agreeToTerms') === 'true',
    });

    const sentFrom = new Sender(`webmaster@${process.env.MAILERSEND_DOMAIN}`, 'Foot Factor');
    const recipients: Recipient[] = [new Recipient(`info@${process.env.MAILERSEND_DOMAIN}`, 'Contact Form Website')];

    if (validatedFields) {
      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setReplyTo(sentFrom)
        .setSubject(`Contact submission: ${formData.get('enquiryType') as string}`)
        .setText(`Name: ${formData.get('name') as string}`)
        .setText(`Email: ${formData.get('email') as string}`)
        .setText(`Enquiry Type: ${formData.get('enquiryType') as string}`)
        .setText('Message:')
        .setHtml(`${(formData.get('message') as string) ?? ''}`);

      const mailer = await mailerSend.email.send(emailParams);

      console.log('email sent', mailer);
    }

    //Response email
    const client = createClient();
    const settings = await client.getSingle('settings');
    const typeofEnquiry = settings.data.contact_form_enquiries?.find(
      (item) => item.value === formData.get('enquiryType'));

    console.log('enquiryType', typeofEnquiry);

    const templateId = typeofEnquiry?.email_template_id ?? null;

    const personalization = [
      {
        email: validatedFields.email,
        data: {
          name: validatedFields.name
        },
      }
    ];

    if (templateId) {
      const emailParams = new EmailParams()
          .setFrom(sentFrom)
          .setTo(recipients)
          .setReplyTo(sentFrom)
          .setSubject("Thanks for contacting Foot Factor")
          .setTemplateId(templateId)
          .setPersonalization(personalization);

      await mailerSend.email.send(emailParams);
    }

    return {
      success: true,
      errors: null,
      data: 'data received and mutated',
    };
  } catch (error) {

    console.error('Error sending email:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: transformZodErrors(error),
        data: null,
      };
    }

    return {
      success: false,
      errors: error,
      data: 'data received and mutated',
    };
  }
}
