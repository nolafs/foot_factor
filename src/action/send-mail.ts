'use server';

import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend';
import { SendSmtpEmail, TransactionalEmailsApi } from '@getbrevo/brevo';
import { z } from 'zod';
import { createClient } from '@/prismicio';

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY ?? '';

const MAILER: string = process.env.MAILER ?? 'MAILERSEND';

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

  turnstileToken: z.string().optional(),

  // Honeypot
  contact_time: z.string().optional(),
});
export async function sendMail(formData: FormData) {
  // Initialize email API based on MAILER constant
  let emailAPI: MailerSend | TransactionalEmailsApi;

  if (MAILER === 'BREVO') {
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
      console.error('[BREVO] Missing BREVO_API_KEY environment variable');
      return {
        success: false,
        errors: null,
        msg: 'Email service configuration error. Please contact support.',
      };
    }

    emailAPI = new TransactionalEmailsApi();
    emailAPI.setApiKey(0, apiKey);
  } else {
    emailAPI = new MailerSend({
      apiKey: process.env.MAILERSEND_API_KEY ?? '',
    });
  }

  try {
    // 1) HONEYPOT CHECK – if filled, silently treat as success and bail
    const honey = formData.get('contact_time');
    if (honey && String(honey).trim() !== '') {
      console.log('[SPAM] Honeypot filled — bot blocked.');
      return {
        success: true,
        errors: null,
        msg: 'Mail sent successfully',
      };
    }

    const validatedFields = emailSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      enquiryType: formData.get('enquiryType'),
      message: formData.get('message'),
      agreeToTerms: formData.get('agreeToTerms') === 'true',

      turnstileToken: formData.get('cf-turnstile-response') ?? undefined,
      contact_time: (formData.get('contact_time') as string | null) ?? '',
    });

    const token = validatedFields.turnstileToken;

    // 3) TURNSTILE VERIFICATION (server side)
    if (!TURNSTILE_SECRET) {
      console.error('[TURNSTILE] Missing TURNSTILE_SECRET_KEY env var');
      return {
        success: false,
        errors: null,
        msg: 'Verification error. Please try again later.',
      };
    }

    if (!token) {
      console.log('[TURNSTILE] No token received from formData');
      return {
        success: false,
        errors: null,
        msg: 'Verification failed. Please try again.',
      };
    }

    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({
        secret: TURNSTILE_SECRET,
        response: token,
        // optional: remoteip: ip
      }),
    });

    const verifyData = (await verifyRes.json()) as { success: boolean; 'error-codes'?: string[] };

    if (!verifyData.success) {
      console.log('[TURNSTILE] Verification failed', verifyData);
      return {
        success: false,
        errors: null,
        msg: 'Verification failed. Please try again.',
      };
    }

    // Determine domain based on mailer
    const domain = process.env.MAILERSEND_DOMAIN;
    const infoEmail = `info@${domain}`;

    const textContent = `
BOOKING REQUEST DETAILS
=======================

CONTACT INFORMATION:
--------------------
Name: ${validatedFields.name}
Email: ${validatedFields.email}
Enquiry: ${validatedFields.enquiryType}


${
  validatedFields.message
    ? `
MESSAGE:
------------------
${validatedFields.message}
`
    : ''
}

CONSENT:
--------
Terms & Conditions: Accepted
Privacy Policy: Accepted

=======================
Sent from Foot Factor Website
    `.trim();

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: #f4f4f4; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .section { margin-bottom: 20px; }
          .section h3 { color: #2c5aa0; border-bottom: 2px solid #2c5aa0; padding-bottom: 5px; }
          .field { margin: 8px 0; }
          .field strong { display: inline-block; width: 150px; }
          .footer { background: #f4f4f4; padding: 15px; border-radius: 5px; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>Contact Website</h2>
        </div>

        <div class="section">
          <h3>Contact Information</h3>
          <div class="field"><strong>Name:</strong> ${validatedFields.name} </div>
          <div class="field"><strong>Email:</strong> ${validatedFields.email}</div>
          <div class="field"><strong>Enquiry:</strong> ${validatedFields.enquiryType}</div>
        </div>

   
        ${
          validatedFields.message
            ? `
        <div class="section">
          <h3>Message</h3>
          <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #2c5aa0;">
            ${validatedFields.message.replace(/\n/g, '<br>')}
          </div>
        </div>
        `
            : ''
        }

        <div class="section">
          <h3>Consent</h3>
          <div class="field"><strong>Terms & Conditions:</strong> Accepted</div>
          <div class="field"><strong>Privacy Policy:</strong> Accepted</div>
        </div>

        <div class="footer">
          Sent from Foot Factor Website<br>
          Received on: ${new Date().toLocaleString('en-GB')}
        </div>
      </body>
      </html>
    `;

    // Send main contact form email to info address
    if (validatedFields) {
      if (MAILER === 'BREVO') {
        const message: SendSmtpEmail = {
          sender: { email: `webmaster@${domain}`, name: 'Foot Factor' },
          to: [{ email: infoEmail, name: 'Contact Form Website' }],
          replyTo: { email: validatedFields.email, name: validatedFields.name },
          subject: `Contact submission: ${validatedFields.enquiryType}`,
          textContent: textContent,
          htmlContent: htmlContent,
        };

        await (emailAPI as TransactionalEmailsApi).sendTransacEmail(message);
      } else {
        const sentFrom = new Sender(`webmaster@${domain}`, 'Foot Factor');
        const recipients: Recipient[] = [new Recipient(infoEmail, 'Contact Form Website')];

        const emailParams = new EmailParams()
          .setFrom(sentFrom)
          .setTo(recipients)
          .setReplyTo(new Sender(validatedFields.email, validatedFields.name))
          .setSubject(`Contact submission: ${validatedFields.enquiryType}`)
          .setText(textContent)
          .setHtml(htmlContent);

        await (emailAPI as MailerSend).email.send(emailParams);
      }
    }

    //Response email
    const client = createClient();
    const settings = await client.getSingle('settings');
    const typeofEnquiry = settings.data.contact_form_enquiries?.find(
      item => item.value === formData.get('enquiryType'),
    );

    const templateId = typeofEnquiry?.email_template_id ?? null;

    const userEmail = validatedFields.email?.trim();

    if (!userEmail) {
      console.log('[EMAIL SEND] No user email – skipping response template');
    } else if (templateId) {
      if (MAILER === 'BREVO') {
        const responseMessage = new SendSmtpEmail();
        responseMessage.sender = { email: `webmaster@${domain}`, name: 'Foot Factor' };
        responseMessage.to = [{ email: userEmail, name: validatedFields.name }];
        responseMessage.subject = 'Thanks for contacting Foot Factor';
        responseMessage.templateId = parseInt(templateId);
        responseMessage.params = {
          name: validatedFields.name,
        };

        const responseEmail = await (emailAPI as TransactionalEmailsApi).sendTransacEmail(responseMessage);
        console.log('[EMAIL SEND] TEMPLATE SUCCESS', responseEmail);
      } else {
        const personalization = [
          {
            email: userEmail,
            data: {
              name: validatedFields.name,
            },
          },
        ];

        console.log('[EMAIL SEND] personalization', personalization);

        const sentFrom = new Sender(`webmaster@${domain}`, 'Foot Factor');
        const userRecipients: Recipient[] = [new Recipient(userEmail, validatedFields.name)];

        const emailParams = new EmailParams()
          .setFrom(sentFrom)
          .setTo(userRecipients)
          .setReplyTo(sentFrom)
          .setSubject('Thanks for contacting Foot Factor')
          .setTemplateId(templateId)
          .setPersonalization(personalization);

        const responseEmail = await (emailAPI as MailerSend).email.send(emailParams);
        console.log('[EMAIL SEND] TEMPLATE SUCCESS', responseEmail);
      }
    }

    console.log('[EMAIL SEND] SUCCESS');

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
