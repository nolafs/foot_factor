'use server';

import {EmailParams, MailerSend, Recipient, Sender} from 'mailersend';
import {z} from 'zod';
import {emailBookingSchema} from '@/types/email-booking.type';
import {format} from 'date-fns';

export const transformZodErrors = async (error: z.ZodError) => {
  return error.issues.map(issue => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));
};

export async function sendBookingMail(formData: z.infer<typeof emailBookingSchema>) {

  console.log('Sending booking request email with data:', formData);

  const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY ?? '',
  });



  try {
    // Validate the form data
    const validatedFields = emailBookingSchema.parse(formData);

    const sentFrom = new Sender(`webmaster@${process.env.MAILERSEND_DOMAIN}`, 'Foot Factor');
    const recipients: Recipient[] = [new Recipient('webmaster@footfactor.com', 'Booking Form Website')];

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

${validatedFields.referralPatient ? `
REFERRAL INFORMATION:
--------------------
Referral Patient: Yes
Referrer's Name: ${validatedFields.referralName || 'Not provided'}
Referrer's Surname: ${validatedFields.referralSurname || 'Not provided'}
Referrer's Email: ${validatedFields.referralEmail || 'Not provided'}
Referrer's Telephone: ${validatedFields.referralTelephone || 'Not provided'}
` : 'Referral Patient: No'}

${validatedFields.message ? `
ADDITIONAL MESSAGE:
------------------
${validatedFields.message}
` : ''}

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
      <html>
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

        ${validatedFields.referralPatient ? `
        <div class="section">
          <h3>Referral Information</h3>
          <div class="field"><strong>Referral Patient:</strong> Yes</div>
          <div class="field"><strong>Referrer's Name:</strong> ${validatedFields.referralName || 'Not provided'}</div>
          <div class="field"><strong>Referrer's Surname:</strong> ${validatedFields.referralSurname || 'Not provided'}</div>
          <div class="field"><strong>Referrer's Email:</strong> ${validatedFields.referralEmail || 'Not provided'}</div>
          <div class="field"><strong>Referrer's Telephone:</strong> ${validatedFields.referralTelephone || 'Not provided'}</div>
        </div>
        ` : `
        <div class="section">
          <h3>Referral Information</h3>
          <div class="field"><strong>Referral Patient:</strong> No</div>
        </div>
        `}

        ${validatedFields.message ? `
        <div class="section">
          <h3>Additional Message</h3>
          <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #2c5aa0;">
            ${validatedFields.message.replace(/\n/g, '<br>')}
          </div>
        </div>
        ` : ''}

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

    // Create and send the email
    const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setReplyTo(new Sender(validatedFields.email, `${validatedFields.name} ${validatedFields.surname}`))
        .setSubject(`Booking Request: ${validatedFields.name} ${validatedFields.surname} ${getPatientType()}`)
        .setText(textContent)
        .setHtml(htmlContent);

    // Send the email
    const result = await mailerSend.email.send(emailParams);

    console.log('Email sent successfully:', result);

    return {
      errors: null,
      data: 'Booking request sent successfully',
    };

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
      return {
        errors: [{path: 'email', message: `Email service error: ${error.message}`}],
        data: null,
      };
    }

    // Handle unknown errors
    return {
      errors: [{path: 'general', message: 'An unexpected error occurred while sending the email'}],
      data: null,
    };
  }
}
