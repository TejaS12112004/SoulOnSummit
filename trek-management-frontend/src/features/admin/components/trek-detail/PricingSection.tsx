import { useFormContext, Controller } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { AdminTrekDetail } from '../../types'

interface PricingSectionProps {
  mode: 'view' | 'edit'
  data?: AdminTrekDetail
}

export function PricingSection({ mode, data }: PricingSectionProps) {
  const { register, control, formState: { errors } } = useFormContext<AdminTrekDetail>()

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Pricing & Difficulty</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mode === 'view' ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Difficulty</p>
              <p className="text-foreground capitalize">{data?.difficulty}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Lowest Price (Base)</p>
              <p className="text-foreground">₹{data?.lowestPrice || 0}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="trek-difficulty" className="text-sm font-medium">Difficulty *</label>
              <Controller
                control={control}
                name="difficulty"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value || 'EASY'}>
                    <SelectTrigger id="trek-difficulty" aria-invalid={!!errors.difficulty} aria-describedby={errors.difficulty ? "err-difficulty" : undefined} className="mt-1">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EASY">Easy</SelectItem>
                      <SelectItem value="MODERATE">Moderate</SelectItem>
                      <SelectItem value="DIFFICULT">Difficult</SelectItem>
                      <SelectItem value="EXTREME">Extreme</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.difficulty && <p id="err-difficulty" className="text-xs text-destructive mt-1">{errors.difficulty.message}</p>}
            </div>
            <div>
              <label htmlFor="trek-lowest-price" className="text-sm font-medium">Lowest Price (Base) *</label>
              <Input id="trek-lowest-price" aria-invalid={!!errors.lowestPrice} aria-describedby={errors.lowestPrice ? "err-lowestPrice" : undefined} type="number" {...register('lowestPrice', { valueAsNumber: true })} />
              {errors.lowestPrice && <p id="err-lowestPrice" className="text-xs text-destructive mt-1">{errors.lowestPrice.message}</p>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
