/**
 * EmergencyContactSection — sub-section of TravellerCard.
 *
 * Renders emergency contact name and phone fields.
 * Uses useFormContext so it doesn't need props passed down from TravellerCard.
 */
import { useFormContext } from 'react-hook-form'
import type { BookingFormValues } from '../schemas/bookingSchema'
import { Input } from '@/components/ui/input'

interface EmergencyContactSectionProps {
  index: number
}

function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} role="alert" className="text-destructive text-xs mt-1">
      {message}
    </p>
  )
}

export function EmergencyContactSection({ index }: EmergencyContactSectionProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<BookingFormValues>()

  const contactNameError = errors.travellers?.[index]?.emergencyContactName?.message
  const contactPhoneError = errors.travellers?.[index]?.emergencyContactPhone?.message

  return (
    <div className="mt-10 pt-4">
      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6">
        Emergency Contact
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Emergency Contact Name */}
        <div>
          <label
            htmlFor={`travellers.${index}.emergencyContactName`}
            className="block text-[0.85rem] font-semibold mb-2"
          >
            Contact Name <span className="text-destructive">*</span>
          </label>
          <Input
            id={`travellers.${index}.emergencyContactName`}
            {...register(`travellers.${index}.emergencyContactName`)}
            type="text"
            autoComplete="off"
            aria-required="true"
            aria-invalid={!!contactNameError}
            aria-describedby={`err-emg-name-${index}`}
            placeholder="e.g. Priya Sharma"
          />
          <FieldError id={`err-emg-name-${index}`} message={contactNameError} />
        </div>

        {/* Emergency Contact Phone */}
        <div>
          <label
            htmlFor={`travellers.${index}.emergencyContactPhone`}
            className="block text-[0.85rem] font-semibold mb-2"
          >
            Contact Phone <span className="text-destructive">*</span>
          </label>
          <Input
            id={`travellers.${index}.emergencyContactPhone`}
            {...register(`travellers.${index}.emergencyContactPhone`)}
            type="tel"
            autoComplete="off"
            inputMode="numeric"
            aria-required="true"
            aria-invalid={!!contactPhoneError}
            aria-describedby={`err-emg-phone-${index}`}
            placeholder="10-digit mobile number"
          />
          <FieldError id={`err-emg-phone-${index}`} message={contactPhoneError} />
        </div>
      </div>
    </div>
  )
}
