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

      console.log('[EMAIL SEND] Info', mailer.body);
    }

    //Response email
    const client = createClient();
    const settings = await client.getSingle('settings');
    const typeofEnquiry = settings.data.contact_form_enquiries?.find(
      (item) => item.value === formData.get('enquiryType'));

    const templateId = typeofEnquiry?.email_template_id ?? null;

    const userEmail = validatedFields.email?.trim();

    if (!userEmail) {
      console.log('[EMAIL SEND] No user email – skipping response template');
    } else if (templateId) {
      const personalization = [
        {
          email: userEmail,
          data: {
            name: validatedFields.name,
          },
        },
      ];

      console.log('[EMAIL SEND] personalization', personalization);

      const userRecipients: Recipient[] = [new Recipient(userEmail, validatedFields.name)];

      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(userRecipients)
        .setReplyTo(sentFrom)
        .setSubject('Thanks for contacting Foot Factor')
        .setTemplateId(templateId)
        .setPersonalization(personalization);

      const responseEmail = await mailerSend.email.send(emailParams);
      console.log('[EMAIL SEND] TEMPLATE SUCCESS', responseEmail);
    }

    console.log('[EMAIL SEND] SUCCESS')

    return {
      success: true,
      errors: null,
      msg: 'Mail send successfully',
    };
  } catch (error) {


    console.log('[EMAIL SEND] ERROR', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: transformZodErrors(error),
          msg: null,
      };
    }

    return {
      success: false,
      errors: error,
      msg: 'Error occurred, please try again',
    };
  }
}
