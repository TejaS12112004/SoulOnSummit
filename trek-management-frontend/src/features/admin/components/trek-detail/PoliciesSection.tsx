import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import type { AdminTrekDetail } from '../../types'

interface PoliciesSectionProps {
  mode: 'view' | 'edit'
  data?: AdminTrekDetail
}

export function PoliciesSection({ mode, data }: PoliciesSectionProps) {
  const { register, formState: { errors } } = useFormContext<AdminTrekDetail>()

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Policies & Requirements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {mode === 'view' ? (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">What's Included</p>
              <p className="text-foreground whitespace-pre-wrap">{data?.included || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">What's Excluded</p>
              <p className="text-foreground whitespace-pre-wrap">{data?.excluded || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Things to Carry</p>
              <p className="text-foreground whitespace-pre-wrap">{data?.thingsToCarry || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cancellation Policy</p>
              <p className="text-foreground whitespace-pre-wrap">{data?.cancellationPolicy || 'Not specified'}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label htmlFor="trek-included" className="text-sm font-medium">What's Included</label>
              <Textarea id="trek-included" aria-invalid={!!errors.included} aria-describedby={errors.included ? "err-included" : undefined} {...register('included')} rows={4} placeholder="List items included in the price" />
              {errors.included && <p id="err-included" className="text-xs text-destructive mt-1">{errors.included.message}</p>}
            </div>
            <div>
              <label htmlFor="trek-excluded" className="text-sm font-medium">What's Excluded</label>
              <Textarea id="trek-excluded" aria-invalid={!!errors.excluded} aria-describedby={errors.excluded ? "err-excluded" : undefined} {...register('excluded')} rows={4} placeholder="List items excluded from the price" />
              {errors.excluded && <p id="err-excluded" className="text-xs text-destructive mt-1">{errors.excluded.message}</p>}
            </div>
            <div>
              <label htmlFor="trek-things-to-carry" className="text-sm font-medium">Things to Carry</label>
              <Textarea id="trek-things-to-carry" aria-invalid={!!errors.thingsToCarry} aria-describedby={errors.thingsToCarry ? "err-things" : undefined} {...register('thingsToCarry')} rows={4} placeholder="List required gear" />
              {errors.thingsToCarry && <p id="err-things" className="text-xs text-destructive mt-1">{errors.thingsToCarry.message}</p>}
            </div>
            <div>
              <label htmlFor="trek-cancellation" className="text-sm font-medium">Cancellation Policy</label>
              <Textarea id="trek-cancellation" aria-invalid={!!errors.cancellationPolicy} aria-describedby={errors.cancellationPolicy ? "err-cancellation" : undefined} {...register('cancellationPolicy')} rows={4} placeholder="Specify cancellation rules" />
              {errors.cancellationPolicy && <p id="err-cancellation" className="text-xs text-destructive mt-1">{errors.cancellationPolicy.message}</p>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
