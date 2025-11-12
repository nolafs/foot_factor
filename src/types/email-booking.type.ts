import {z} from 'zod';
import { parse, isValid, differenceInYears, startOfDay } from "date-fns";

const MIN_DOB = new Date("1900-01-01");
const MAX_DOB = startOfDay(new Date());

// UK phone number validation regex
// Matches various UK formats: +44, 0044, 07xxx, 01xxx, 02xxx, 03xxx, etc.
//const ukPhoneRegex = /^(?:(?:\+44|0044)\s?|0)(?:[1-9]\d{8,9}|[1-9]\d{9})$/;

// Alternative more comprehensive UK phone regex
//const ukPhoneRegexDetailed = /^(?:(?:\+44\s?|0044\s?|0)(?:[1-9]\d{8,9}|[1-9]\d{9})|(?:\+44\s?|0044\s?)?(?:7[0-9]{9}|1[0-9]{9}|2[0-9]{9}|3[0-9]{9}|5[0-9]{9}|8[0-9]{9}|9[0-9]{9}))$/;

// Custom UK phone validation function
const validateUKPhone = (phone: string) => {
  // Remove all spaces, hyphens, and brackets for validation
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');

  // Check various UK phone number patterns
  const patterns = [
    /^(\+44|0044|44)?0?[1-9]\d{9}$/, // Standard 11-digit UK numbers
    /^(\+44|0044|44)?0?7[0-9]{9}$/, // Mobile numbers
    /^(\+44|0044|44)?0?[12358][0-9]{9}$/, // Landline numbers
    /^(\+44|0044|44)?0?800[0-9]{6,7}$/, // Freephone
    /^(\+44|0044|44)?0?845[0-9]{7}$/, // Local rate
    /^(\+44|0044|44)?0?870[0-9]{7}$/, // National rate
  ];

  return patterns.some(pattern => pattern.test(cleanPhone));
};

export const emailBookingSchema = z.object({
  // Patient type flags - required booleans
  existingPatient: z.boolean(),
  referralPatient: z.boolean(),

  // Core patient information - required fields
    name: z.string()
      .min(1, 'Name is required')
      .max(100, 'Name must be less than 100 characters')
      .regex(/^[a-zA-Z\s\-']+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),

  surname: z.string()
      .min(1, 'Surname is required')
      .max(100, 'Surname must be less than 100 characters')
      .regex(/^[a-zA-Z\s\-']+$/, 'Surname can only contain letters, spaces, hyphens, and apostrophes'),

    dateOfBirth: z.preprocess((v) => {
            if (v instanceof Date) return v;
            if (typeof v === "string") {
                const d = parse(v.trim(), "dd/MM/yyyy", new Date());
                return isValid(d) ? d : v;
            }
            return v;
        }, z.date({
            required_error: "Date of birth is required",
            invalid_type_error: "Please enter a valid date (dd/mm/yyyy)",
        })
            .refine((d) => d >= MIN_DOB && d <= MAX_DOB, {
                message: "Please enter a valid date of birth",
            })
            .refine((d) => {
                const age = differenceInYears(MAX_DOB, d);
                return age >= 0 && age <= 150;
            }, { message: "Please enter a valid date of birth" })
    ),



    email: z.string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address')
      .max(255, 'Email must be less than 255 characters'),

  telephone: z.string()
      .min(1, 'Telephone number is required')
      .refine(validateUKPhone, {
        message: 'Please enter a valid UK phone number (e.g., 07123456789 or +44 7123 456789)',
      }),

  appointmentType: z.string()
      .min(1, 'Please select an appointment type')
      .max(100, 'Appointment type must be less than 100 characters'),

  // Referral information - conditional/optional fields
  referralName: z.string()
      .max(100, 'Referral name must be less than 100 characters')
      .regex(/^[a-zA-Z\s\-']*$/, 'Referral name can only contain letters, spaces, hyphens, and apostrophes')
      .optional(),

  referralSurname: z.string()
      .max(100, 'Referral surname must be less than 100 characters')
      .regex(/^[a-zA-Z\s\-']*$/, 'Referral surname can only contain letters, spaces, hyphens, and apostrophes')
      .optional(),

  referralEmail: z.string()
      .email('Please enter a valid referral email address')
      .max(255, 'Referral email must be less than 255 characters')
      .optional()
      .or(z.literal('')), // Allow empty string

  referralTelephone: z.string()
      .refine((val) => !val || validateUKPhone(val), {
        message: 'Please enter a valid UK phone number for referral contact',
      })
      .optional(),

  // Optional message field
  message: z.string()
      .max(1000, 'Message must be less than 1000 characters')
      .optional(),

  // Required consent checkboxes
    terms: z.boolean().refine((v) => v, "You must accept the terms"),
    privacy: z.boolean().refine((v) => v, "You must accept the privacy policy"),
}).superRefine((data, ctx) => {
  // Conditional validation: if referralPatient is true, referral fields become required
  if (data.referralPatient) {
    if (!data.referralName || data.referralName.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['referralName'],
        message: 'Referral name is required when booking as a referral patient',
      });
    }

    if (!data.referralSurname || data.referralSurname.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['referralSurname'],
        message: 'Referral surname is required when booking as a referral patient',
      });
    }

    if (!data.referralEmail || data.referralEmail.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['referralEmail'],
        message: 'Referral email is required when booking as a referral patient',
      });
    }

    if (!data.referralTelephone || data.referralTelephone.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['referralTelephone'],
        message: 'Referral telephone is required when booking as a referral patient',
      });
    }
  }

  // Ensure existing and referral patient flags are not both true
  if (data.existingPatient && data.referralPatient) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['referralPatient'],
      message: 'Cannot be both an existing patient and a referral patient',
    });
  }
});

// Type inference for TypeScript
export type EmailBookingFormData = z.infer<typeof emailBookingSchema>;
