import { Edit2, User } from 'lucide-react'
import type { BookingDetailViewModel } from '../types/booking'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'

interface BookingTravellerListProps {
  booking: BookingDetailViewModel
}

export function BookingTravellerList({ booking }: BookingTravellerListProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleEdit = () => {
    // Preserve traveller data by setting it in React Query cache for the booking form to pick up
    // Optional fallback: we also pass it in state just in case, or just rely on the existing booking
    queryClient.setQueryData(['bookingFormDraft', booking.departureId], booking.participants)
    
    // Navigate back to the booking creation form
    navigate(ROUTES.BOOKING_NEW, { 
      state: { 
        departureId: booking.departureId,
        bookingId: booking.id 
      }
    })
  }

  return (
    <div className="bg-card shadow-card rounded-card border border-border p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-display font-bold text-card-foreground mb-1">Traveller Details</h2>
          <p className="text-muted-foreground text-sm">Review the information provided for all travellers</p>
        </div>
        <Button
          variant="outline"
          onClick={handleEdit}
          className="flex items-center gap-2"
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </Button>
      </div>

      <div className="space-y-4">
        {booking.participants.map((p, index) => (
          <div key={p.id} className="p-4 rounded-btn bg-muted/50 border border-border">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-foreground font-medium">
                  {index + 1}. {p.fullName}
                </p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  {p.age} years • {p.gender.replace(/_/g, ' ')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
              {p.email && (
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Email</p>
                  <p className="text-foreground">{p.email}</p>
                </div>
              )}
              {p.phone && (
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Phone</p>
                  <p className="text-foreground">{p.phone}</p>
                </div>
              )}
              
              <div className="sm:col-span-2">
                <p className="text-muted-foreground text-xs mb-1">Emergency Contact</p>
                <p className="text-foreground">
                  {p.emergencyContactName} ({p.emergencyContactPhone})
                </p>
              </div>

              {p.medicalConditions && (
                <div className="sm:col-span-2">
                  <p className="text-muted-foreground text-xs mb-1">Medical Conditions</p>
                  <p className="text-warning bg-warning/15 px-3 py-2 rounded-btn border border-warning/30">
                    {p.medicalConditions}
                  </p>
                </div>
              )}

              {p.previousTrekExperience && (
                <div className="sm:col-span-2">
                  <p className="text-muted-foreground text-xs mb-1">Previous Experience</p>
                  <p className="text-muted-foreground italic">"{p.previousTrekExperience}"</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
