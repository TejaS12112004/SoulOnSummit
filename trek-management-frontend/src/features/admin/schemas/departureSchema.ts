import { z } from 'zod'

export const createDepartureSchema = z.object({
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  registrationDeadline: z.string().min(1, 'Registration deadline is required'),
  price: z.number().min(0, 'Price cannot be negative'),
  discountPrice: z.number().nullable().optional(),
  totalSeats: z.number().min(1, 'Total seats must be at least 1'),
  status: z.enum(['OPEN', 'CANCELLED', 'COMPLETED']),
}).refine(data => new Date(data.startDate) <= new Date(data.endDate), {
  message: "End date cannot be before start date",
  path: ["endDate"]
}).refine(data => new Date(data.registrationDeadline) <= new Date(data.startDate), {
  message: "Registration deadline cannot be after start date",
  path: ["registrationDeadline"]
})

export type CreateDepartureFormValues = z.infer<typeof createDepartureSchema>
