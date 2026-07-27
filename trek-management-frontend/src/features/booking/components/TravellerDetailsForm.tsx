/**
 * TravellerDetailsForm — owns useFieldArray for dynamic traveller list.
 *
 * Reads/writes into the parent FormProvider context.
 * Renders TravellerCounter + array of TravellerCard components.
 */
import { useFieldArray, useFormContext } from 'react-hook-form'
import { TravellerCounter } from './TravellerCounter'
import { TravellerCard } from './TravellerCard'
import type { BookingFormValues } from '../schemas/bookingSchema'

const EMPTY_TRAVELLER = {
  fullName: '',
  age: '' as unknown as number, // coerced by zod
  gender: '' as 'MALE',
  phone: '',
  email: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  medicalConditions: '',
  previousTrekExperience: '',
}

interface TravellerDetailsFormProps {
  availableSeats: number
}

export function TravellerDetailsForm({ availableSeats }: TravellerDetailsFormProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<BookingFormValues>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'travellers',
  })

  const travellerCountError = errors.travellers?.message

  const handleIncrement = () => {
    if (fields.length < availableSeats) {
      append(EMPTY_TRAVELLER)
    }
  }

  const handleDecrement = () => {
    if (fields.length > 1) {
      remove(fields.length - 1)
    }
  }

  return (
    <div className="space-y-6">
      <TravellerCounter
        count={fields.length}
        max={availableSeats}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        error={travellerCountError}
      />

      <div className="space-y-4">
        {fields.map((field, index) => (
          <TravellerCard
            key={field.id}
            index={index}
            canRemove={fields.length > 1}
            onRemove={() => remove(index)}
          />
        ))}
      </div>
    </div>
  )
}
