/**
 * Booking form Zod schema — Sprint 5.3.
 *
 * Uses Zod v4 API (installed as zod@4.x).
 *
 * Rules:
 * - `createBookingSchema` is a factory so `availableSeats` is captured
 *   at runtime (server data) — never a static .max().
 * - `superRefine` enforces the seat cap after all individual field
 *   validations pass, so users see field-level errors first.
 * - Phone regex: Indian mobile format (starts 6-9, 10 digits).
 * - All backend field names match BookingParticipantRequest exactly.
 */
import { z } from 'zod'

const PHONE_REGEX = /^[6-9]\d{9}$/

export const TravellerSchema = z.object({
  /** Maps to BookingParticipantRequest.fullName */
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),

  /** Maps to BookingParticipantRequest.age (min 5 per backend constraint) */
  age: z.coerce
    .number({ error: 'Age is required' })
    .int('Age must be a whole number')
    .min(5, 'Age must be at least 5')
    .max(85, 'Age must be 85 or below'),

  /** Maps to BookingParticipantRequest.gender */
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'] as const, {
    error: 'Please select a gender',
  }),

  /** Optional — maps to BookingParticipantRequest.phone */
  phone: z
    .string()
    .refine((v) => v === '' || PHONE_REGEX.test(v), 'Enter a valid 10-digit mobile number')
    .optional(),

  /** Optional — maps to BookingParticipantRequest.email */
  email: z
    .string()
    .refine((v) => v === '' || z.email().safeParse(v).success, 'Enter a valid email address')
    .optional(),

  /** Required — maps to BookingParticipantRequest.emergencyContactName */
  emergencyContactName: z.string().min(2, 'Emergency contact name is required'),

  /** Required — maps to BookingParticipantRequest.emergencyContactPhone */
  emergencyContactPhone: z
    .string()
    .min(1, 'Emergency contact phone is required')
    .regex(PHONE_REGEX, 'Enter a valid 10-digit mobile number'),

  /** Optional — maps to BookingParticipantRequest.medicalConditions */
  medicalConditions: z.string().optional(),

  /** Optional — maps to BookingParticipantRequest.previousTrekExperience */
  previousTrekExperience: z.string().optional(),
})

export type TravellerFormValues = z.infer<typeof TravellerSchema>

/**
 * Creates the full booking form schema with runtime `availableSeats` validation.
 *
 * @param availableSeats - from the server departure response, captured at call time
 */
export function createBookingSchema(availableSeats: number) {
  return z
    .object({
      travellers: z.array(TravellerSchema).min(1, 'At least one traveller is required'),
      specialRequests: z.string().optional(),
      /**
       * Seat acceptance must be the literal value `true`.
       * z.literal(true) is semantically precise: the checkbox either IS accepted or not.
       * Using z.boolean().refine() would allow false through schema.parse(), 
       * whereas z.literal(true) fails at the type level if false is passed.
       */
      termsAccepted: z.literal(true, {
        error: 'You must accept the terms and conditions to continue',
      }),
    })
    .superRefine((val, ctx) => {
      if (val.travellers.length > availableSeats) {
        ctx.addIssue({
          code: 'too_big',
          origin: 'array',
          maximum: availableSeats,
          inclusive: true,
          path: ['travellers'],
          message: `Only ${availableSeats} seat(s) available for this departure`,
        })
      }
    })
}

export type BookingFormValues = z.infer<ReturnType<typeof createBookingSchema>>
