'use server';

import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend';
import { TransactionalEmailsApi, SendSmtpEmail, CreateSmtpEmail } from '@getbrevo/brevo';
import { z } from 'zod';
import { emailBookingSchema } from '@/types/email-booking.type';
import { format } from 'date-fns';
import { createClient } from '@/prismicio';
import { APIResponse } from 'mailersend/lib/services/request.service';
import { IncomingMessage } from 'node:http';

export const transformZodErrors = async (error: z.ZodError) => {
  return error.issues.map(issue => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));
};

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY ?? '';

const MAILER: 'MAILERSEND' | 'BREVO' = 'MAILERSEND';

export async function sendBookingMail(formData: z.infer<typeof emailBookingSchema>) {
  console.log('Sending booking request email with data');

  try {
    // 1) HONEYPOT CHECK – if filled, silently treat as success and bail
    const honey = formData.booking_time;
    if (honey && String(honey).trim() !== '') {
      console.log('[SPAM] Honeypot filled — bot blocked.');
      return {
        success: true,
        errors: null,
        msg: 'Mail sent successfully',
      };
    }

    // Validate the form data
    const validatedFields = emailBookingSchema.parse(formData);

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

    // Determine patient type for subject
    const getPatientType = () => {
      if (validatedFields.referralPatient) return '(Referral Patient)';
      if (validatedFields.existingPatient) return '(Existing Patient)';
      return '(New Patient)';
    };

    // Format date properly
    const formattedDate = format(validatedFields.dateOfBirth, 'dd/MM/yyyy');

    // Build the email content
    const textContent = `
BOOKING REQUEST DETAILS
=======================

PATIENT INFORMATION:
--------------------
Name: ${validatedFields.name} ${validatedFields.surname}
Date of Birth: ${formattedDate}
Email: ${validatedFields.email}
Telephone: ${validatedFields.telephone}
Appointment Type: ${validatedFields.appointmentType}
Existing Patient: ${validatedFields.existingPatient ? 'Yes' : 'No'}

${
  validatedFields.referralPatient
    ? `
REFERRAL INFORMATION:
--------------------
Referral Patient: Yes
Referrer's Name: ${validatedFields.referralName ?? 'Not provided'}
Referrer's Surname: ${validatedFields.referralSurname ?? 'Not provided'}
Referrer's Email: ${validatedFields.referralEmail ?? 'Not provided'}
Referrer's Telephone: ${validatedFields.referralTelephone ?? 'Not provided'}
`
    : 'Referral Patient: No'
}

${
  validatedFields.message
    ? `
ADDITIONAL MESSAGE:
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

    // Build HTML content for better formatting
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
          <h2>New Booking Request ${getPatientType()}</h2>
        </div>

        <div class="section">
          <h3>Patient Information</h3>
          <div class="field"><strong>Name:</strong> ${validatedFields.name} ${validatedFields.surname}</div>
          <div class="field"><strong>Date of Birth:</strong> ${formattedDate}</div>
          <div class="field"><strong>Email:</strong> ${validatedFields.email}</div>
          <div class="field"><strong>Telephone:</strong> ${validatedFields.telephone}</div>
          <div class="field"><strong>Appointment Type:</strong> ${validatedFields.appointmentType}</div>
          <div class="field"><strong>Existing Patient:</strong> ${validatedFields.existingPatient ? 'Yes' : 'No'}</div>
        </div>

        ${
          validatedFields.referralPatient
            ? `
        <div class="section">
          <h3>Referral Information</h3>
          <div class="field"><strong>Referral Patient:</strong> Yes</div>
          <div class="field"><strong>Referrer's Name:</strong> ${validatedFields.referralName ?? 'Not provided'}</div>
          <div class="field"><strong>Referrer's Surname:</strong> ${validatedFields.referralSurname ?? 'Not provided'}</div>
          <div class="field"><strong>Referrer's Email:</strong> ${validatedFields.referralEmail ?? 'Not provided'}</div>
          <div class="field"><strong>Referrer's Telephone:</strong> ${validatedFields.referralTelephone ?? 'Not provided'}</div>
        </div>
        `
            : `
        <div class="section">
          <h3>Referral Information</h3>
          <div class="field"><strong>Referral Patient:</strong> No</div>
        </div>
        `
        }

        ${
          validatedFields.message
            ? `
        <div class="section">
          <h3>Additional Message</h3>
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

    //console.log('EMAIL html',htmlContent);
    //console.log('EMAIL text',textContent);

    let emailAPI: MailerSend | TransactionalEmailsApi;
    let result: APIResponse | { response: IncomingMessage; body: CreateSmtpEmail };

    if (MAILER === 'BREVO') {
      emailAPI = new TransactionalEmailsApi();
      (emailAPI as any).authentications.apiKey.apiKey = `xkeysib-${process.env.BREVO_API_KEY ?? ''}`;

      const message: SendSmtpEmail = {
        sender: { email: `webmaster@${process.env.BREVO_DOMAIN}`, name: 'Foot Factor' },
        to: [{ email: `info@${process.env.BREVO_DOMAIN}`, name: 'Booking Form Website' }],
        replyTo: { email: validatedFields.email, name: `${validatedFields.name} ${validatedFields.surname}` },
        subject: `Booking Request: ${validatedFields.name} ${validatedFields.surname} ${getPatientType()}`,
        htmlContent: htmlContent,
        textContent: textContent,
      };

      result = await emailAPI.sendTransacEmail(message);
    } else {
      emailAPI = new MailerSend({
        apiKey: process.env.MAILERSEND_API_KEY ?? '',
      });

      const sentFrom = new Sender(`webmaster@${process.env.MAILERSEND_DOMAIN}`, 'Foot Factor');
      const recipients: Recipient[] = [new Recipient(`info@${process.env.MAILERSEND_DOMAIN}`, 'Booking Form Website')];

      // Create and send the email
      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setReplyTo(new Sender(validatedFields.email, `${validatedFields.name} ${validatedFields.surname}`))
        .setSubject(`Booking Request: ${validatedFields.name} ${validatedFields.surname} ${getPatientType()}`)
        .setText(textContent)
        .setHtml(htmlContent);

      // Send the email
      result = await emailAPI.email.send(emailParams);
    }

    console.log('Email sent successfully');

    if (result) {
      // Send confirmation email to the customer
      const client = createClient();
      const settings = await client.getSingle('settings');
      let templateId: string | null;

      // Determine which template to use
      if (formData.referralPatient) {
        templateId = settings.data.booking_referral_patient ?? null;
      } else if (formData.existingPatient) {
        templateId = settings.data.booking_existing_patient ?? null;
      } else {
        templateId = settings.data.booking_new_patient ?? null;
      }

      // Send confirmation email to customer based on mailer type
      if (templateId) {
        if (MAILER === 'BREVO') {
          const confirmationMessage = new SendSmtpEmail();
          confirmationMessage.sender = { email: `webmaster@${process.env.BREVO_DOMAIN}`, name: 'Foot Factor' };
          confirmationMessage.to = [
            { email: validatedFields.email, name: `${validatedFields.name} ${validatedFields.surname}` },
          ];
          confirmationMessage.subject = 'Booking Request Received';
          confirmationMessage.templateId = parseInt(templateId);
          confirmationMessage.params = {
            name: validatedFields.name,
          };

          await (emailAPI as TransactionalEmailsApi).sendTransacEmail(confirmationMessage);
        } else {
          const recipients = [
            new Recipient(validatedFields.email, `${validatedFields.name} ${validatedFields.surname}`),
          ];
          const personalization = [
            {
              email: validatedFields.email,
              data: {
                name: validatedFields.name,
              },
            },
          ];

          const sentFrom = new Sender(`webmaster@${process.env.MAILERSEND_DOMAIN}`, 'Foot Factor');
          const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setReplyTo(sentFrom)
            .setSubject('Booking Request Received')
            .setTemplateId(templateId)
            .setPersonalization(personalization);

          await (emailAPI as MailerSend).email.send(emailParams);
        }
      }

      // Send referral professional notification if applicable
      if (formData.referralPatient && validatedFields.referralEmail) {
        const referralTemplateId = settings.data.booking_referral_professional ?? null;

        if (referralTemplateId) {
          if (MAILER === 'BREVO') {
            const referralMessage = new SendSmtpEmail();
            referralMessage.sender = { email: `webmaster@${process.env.BREVO_DOMAIN}`, name: 'Foot Factor' };
            referralMessage.to = [
              {
                email: validatedFields.referralEmail,
                name: `${validatedFields.referralName ?? ''} ${validatedFields.referralSurname ?? ''}`.trim(),
              },
            ];
            referralMessage.subject = 'Referral Request Received';
            referralMessage.templateId = parseInt(referralTemplateId);
            referralMessage.params = {
              name: validatedFields.referralName ?? 'Professional',
              patient_name: `${validatedFields.name} ${validatedFields.surname}`,
            };

            await (emailAPI as TransactionalEmailsApi).sendTransacEmail(referralMessage);
          } else {
            const referralRecipients = [
              new Recipient(
                validatedFields.referralEmail,
                `${validatedFields.referralName ?? ''} ${validatedFields.referralSurname ?? ''}`.trim(),
              ),
            ];
            const referralPersonalization = [
              {
                email: validatedFields.referralEmail,
                data: {
                  name: validatedFields.referralName ?? 'Professional',
                  patient_name: `${validatedFields.name} ${validatedFields.surname}`,
                },
              },
            ];

            const sentFrom = new Sender(`webmaster@${process.env.MAILERSEND_DOMAIN}`, 'Foot Factor');
            const emailParams = new EmailParams()
              .setFrom(sentFrom)
              .setTo(referralRecipients)
              .setReplyTo(sentFrom)
              .setSubject('Referral Request Received')
              .setTemplateId(referralTemplateId)
              .setPersonalization(referralPersonalization);

            await (emailAPI as MailerSend).email.send(emailParams);
          }
        }
      }

      return {
        errors: null,
        data: 'Booking request sent successfully',
      };
    } else {
      return {
        errors: [{ path: 'email', message: 'Failed to send booking request email' }],
        data: null,
      };
    }
  } catch (error) {
    console.error('Error in sendBookingMail:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return {
        errors: await transformZodErrors(error),
        data: null,
      };
    }

    // Handle MailerSend API errors
    if (error && typeof error === 'object' && 'message' in error) {
      const message = typeof error.message === 'string' ? error.message : 'Unknown error';
      return {
        errors: [{ path: 'email', message: `Email service error: ${message}` }],
        data: null,
      };
    }

    // Handle unknown errors
    return {
      errors: [{ path: 'general', message: 'An unexpected error occurred while sending the email' }],
      data: null,
    };
  }
}
