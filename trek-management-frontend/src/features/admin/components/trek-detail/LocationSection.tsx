import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { AdminTrekDetail } from '../../types'

interface LocationSectionProps {
  mode: 'view' | 'edit'
  data?: AdminTrekDetail
}

export function LocationSection({ mode, data }: LocationSectionProps) {
  const { register, formState: { errors } } = useFormContext<AdminTrekDetail>()

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Location & Logistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mode === 'view' ? (
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-sm text-muted-foreground">Location</p><p>{data?.location}</p></div>
            <div><p className="text-sm text-muted-foreground">State/Region</p><p>{data?.state}</p></div>
            <div><p className="text-sm text-muted-foreground">Country</p><p>{data?.country}</p></div>
            <div><p className="text-sm text-muted-foreground">Pickup Point</p><p>{data?.pickupPoint}</p></div>
            <div><p className="text-sm text-muted-foreground">Drop Point</p><p>{data?.dropPoint}</p></div>
            <div><p className="text-sm text-muted-foreground">Max Altitude (m)</p><p>{data?.maxAltitude}</p></div>
            <div><p className="text-sm text-muted-foreground">Distance (km)</p><p>{data?.distanceKm}</p></div>
            <div><p className="text-sm text-muted-foreground">Duration (Days)</p><p>{data?.durationDays}</p></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="trek-location" className="text-sm font-medium">Location *</label>
              <Input id="trek-location" aria-invalid={!!errors.location} aria-describedby={errors.location ? "err-location" : undefined} {...register('location')} placeholder="E.g. Manali" />
              {errors.location && <p id="err-location" className="text-xs text-destructive mt-1">{errors.location.message}</p>}
            </div>
            <div>
              <label htmlFor="trek-state" className="text-sm font-medium">State *</label>
              <Input id="trek-state" aria-invalid={!!errors.state} aria-describedby={errors.state ? "err-state" : undefined} {...register('state')} placeholder="E.g. Himachal Pradesh" />
              {errors.state && <p id="err-state" className="text-xs text-destructive mt-1">{errors.state.message}</p>}
            </div>
            <div>
              <label htmlFor="trek-country" className="text-sm font-medium">Country *</label>
              <Input id="trek-country" aria-invalid={!!errors.country} aria-describedby={errors.country ? "err-country" : undefined} {...register('country')} placeholder="E.g. India" />
              {errors.country && <p id="err-country" className="text-xs text-destructive mt-1">{errors.country.message}</p>}
            </div>
            <div>
              <label htmlFor="trek-pickup" className="text-sm font-medium">Pickup Point *</label>
              <Input id="trek-pickup" aria-invalid={!!errors.pickupPoint} aria-describedby={errors.pickupPoint ? "err-pickup" : undefined} {...register('pickupPoint')} placeholder="Pickup location" />
              {errors.pickupPoint && <p id="err-pickup" className="text-xs text-destructive mt-1">{errors.pickupPoint.message}</p>}
            </div>
            <div>
              <label htmlFor="trek-drop" className="text-sm font-medium">Drop Point *</label>
              <Input id="trek-drop" aria-invalid={!!errors.dropPoint} aria-describedby={errors.dropPoint ? "err-drop" : undefined} {...register('dropPoint')} placeholder="Drop location" />
              {errors.dropPoint && <p id="err-drop" className="text-xs text-destructive mt-1">{errors.dropPoint.message}</p>}
            </div>
            <div>
              <label htmlFor="trek-altitude" className="text-sm font-medium">Max Altitude (m) *</label>
              <Input id="trek-altitude" aria-invalid={!!errors.maxAltitude} aria-describedby={errors.maxAltitude ? "err-altitude" : undefined} type="number" {...register('maxAltitude', { valueAsNumber: true })} />
              {errors.maxAltitude && <p id="err-altitude" className="text-xs text-destructive mt-1">{errors.maxAltitude.message}</p>}
            </div>
            <div>
              <label htmlFor="trek-distance" className="text-sm font-medium">Distance (km) *</label>
              <Input id="trek-distance" aria-invalid={!!errors.distanceKm} aria-describedby={errors.distanceKm ? "err-distance" : undefined} type="number" {...register('distanceKm', { valueAsNumber: true })} />
              {errors.distanceKm && <p id="err-distance" className="text-xs text-destructive mt-1">{errors.distanceKm.message}</p>}
            </div>
            <div>
              <label htmlFor="trek-duration" className="text-sm font-medium">Duration (Days) *</label>
              <Input id="trek-duration" aria-invalid={!!errors.durationDays} aria-describedby={errors.durationDays ? "err-duration" : undefined} type="number" {...register('durationDays', { valueAsNumber: true })} />
              {errors.durationDays && <p id="err-duration" className="text-xs text-destructive mt-1">{errors.durationDays.message}</p>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
