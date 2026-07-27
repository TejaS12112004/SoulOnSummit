/**
 * TravellerCard — form card for a single traveller.
 *
 * Uses useFormContext() to read/write into the parent FormProvider.
 * Field names follow the schema: travellers.{index}.*
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFormContext } from 'react-hook-form'
import { ChevronDown, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EmergencyContactSection } from './EmergencyContactSection'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import type { BookingFormValues } from '../schemas/bookingSchema'

interface TravellerCardProps {
  index: number
  /** Allow removal only when more than 1 traveller */
  canRemove: boolean
  onRemove: () => void
}

const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
  { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' },
] as const

const NATIVE_SELECT_CLASSES =
  "w-full bg-input border border-border rounded-xl px-4 h-12 text-foreground text-sm shadow-xs transition-[color,box-shadow] duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 aria-invalid:border-destructive"

function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} role="alert" className="text-destructive text-xs mt-1">
      {message}
    </p>
  )
}

export function TravellerCard({ index, canRemove, onRemove }: TravellerCardProps) {
  const [isOpen, setIsOpen] = useState(true)

  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<BookingFormValues>()

  const fullName = watch(`travellers.${index}.fullName`)
  const namePreview = fullName?.trim() || `Traveller ${index + 1}`

  const travellerErrors = errors.travellers?.[index]

  return (
    <Card className="overflow-hidden">
      {/* Card Header */}
      <div className="flex items-center justify-between px-6 py-5">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-4 flex-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg p-1 -m-1"
          aria-expanded={isOpen}
          aria-controls={`traveller-card-${index}`}
        >
          <div className="w-11 h-11 rounded-full bg-accent/5 border border-border/80 flex items-center justify-center shrink-0 shadow-sm">
            <User className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="font-semibold text-base text-foreground leading-tight">{namePreview}</p>
            <p className="text-muted-foreground text-sm mt-1">Traveller {index + 1}</p>
          </div>
        </button>

        <div className="flex items-center gap-2">
          {canRemove && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemove}
              aria-label={`Remove traveller ${index + 1}`}
              className="text-muted-foreground hover:text-destructive"
            >
              Remove
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="text-muted-foreground shrink-0"
            aria-label={isOpen ? 'Collapse' : 'Expand'}
          >
            <ChevronDown className={cn("w-5 h-5 transition-transform duration-[280ms] ease-out", isOpen ? "rotate-180" : "")} />
          </Button>
        </div>
      </div>

      {/* Card Body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`traveller-card-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-8 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-7 gap-x-6">
            {/* Full Name */}
            <div className="sm:col-span-2 space-y-2">
              <label
                htmlFor={`travellers.${index}.fullName`}
                className="block text-sm font-medium mb-1"
              >
                Full Name <span className="text-destructive">*</span>
              </label>
              <Input
                id={`travellers.${index}.fullName`}
                {...register(`travellers.${index}.fullName`)}
                type="text"
                autoComplete="name"
                aria-required="true"
                aria-invalid={!!travellerErrors?.fullName}
                aria-describedby={`err-name-${index}`}
                placeholder="As per government ID"
              />
              <FieldError id={`err-name-${index}`} message={travellerErrors?.fullName?.message} />
            </div>

            {/* Age */}
            <div>
              <label
                htmlFor={`travellers.${index}.age`}
                className="block text-sm font-medium mb-1"
              >
                Age <span className="text-destructive">*</span>
              </label>
              <Input
                id={`travellers.${index}.age`}
                {...register(`travellers.${index}.age`)}
                type="number"
                inputMode="numeric"
                min={5}
                max={85}
                aria-required="true"
                aria-invalid={!!travellerErrors?.age}
                aria-describedby={`err-age-${index}`}
                placeholder="e.g. 28"
              />
              <FieldError id={`err-age-${index}`} message={travellerErrors?.age?.message} />
            </div>

            {/* Gender */}
            <div>
              <label
                htmlFor={`travellers.${index}.gender`}
                className="block text-sm font-medium mb-1"
              >
                Gender <span className="text-destructive">*</span>
              </label>
              <select
                id={`travellers.${index}.gender`}
                {...register(`travellers.${index}.gender`)}
                aria-required="true"
                aria-invalid={!!travellerErrors?.gender}
                aria-describedby={`err-gender-${index}`}
                className={NATIVE_SELECT_CLASSES}
              >
                <option value="">Select gender</option>
                {GENDER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <FieldError id={`err-gender-${index}`} message={travellerErrors?.gender?.message} />
            </div>

            {/* Phone (optional) */}
            <div>
              <label
                htmlFor={`travellers.${index}.phone`}
                className="block text-sm font-medium mb-1"
              >
                Mobile Number <span className="text-muted-foreground text-xs">(optional)</span>
              </label>
              <Input
                id={`travellers.${index}.phone`}
                {...register(`travellers.${index}.phone`)}
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                aria-invalid={!!travellerErrors?.phone}
                aria-describedby={`err-phone-${index}`}
                placeholder="10-digit mobile"
              />
              <FieldError id={`err-phone-${index}`} message={travellerErrors?.phone?.message} />
            </div>

            {/* Email (optional) */}
            <div>
              <label
                htmlFor={`travellers.${index}.email`}
                className="block text-sm font-medium mb-1"
              >
                Email <span className="text-muted-foreground text-xs">(optional)</span>
              </label>
              <Input
                id={`travellers.${index}.email`}
                {...register(`travellers.${index}.email`)}
                type="email"
                autoComplete="email"
                aria-invalid={!!travellerErrors?.email}
                aria-describedby={`err-email-${index}`}
                placeholder="traveller@email.com"
              />
              <FieldError id={`err-email-${index}`} message={travellerErrors?.email?.message} />
            </div>

            {/* Medical Conditions (optional) */}
            <div className="sm:col-span-2">
              <label
                htmlFor={`travellers.${index}.medicalConditions`}
                className="block text-sm font-medium mb-1"
              >
                Medical Conditions{' '}
                <span className="text-muted-foreground text-xs">(optional)</span>
              </label>
              <Textarea
                id={`travellers.${index}.medicalConditions`}
                {...register(`travellers.${index}.medicalConditions`)}
                rows={3}
                className="resize-none"
                aria-invalid={!!travellerErrors?.medicalConditions}
                placeholder="Any allergies, conditions or medications we should know about"
              />
            </div>

            {/* Trek Experience (optional) */}
            <div className="sm:col-span-2">
              <label
                htmlFor={`travellers.${index}.previousTrekExperience`}
                className="block text-sm font-medium mb-1"
              >
                Trek Experience{' '}
                <span className="text-muted-foreground text-xs">(optional)</span>
              </label>
              <Textarea
                id={`travellers.${index}.previousTrekExperience`}
                {...register(`travellers.${index}.previousTrekExperience`)}
                rows={3}
                className="resize-none"
                aria-invalid={!!travellerErrors?.previousTrekExperience}
                placeholder="e.g. Completed Kedarkantha Trek in 2023, beginner to high altitude"
              />
            </div>
          </div>

              {/* Emergency Contact Section */}
              <EmergencyContactSection index={index} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
