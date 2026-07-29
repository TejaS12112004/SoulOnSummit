import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { AdminTrekDetail } from '../../types'

interface BasicInfoSectionProps {
  mode: 'view' | 'edit'
  data?: AdminTrekDetail
}

export function BasicInfoSection({ mode, data }: BasicInfoSectionProps) {
  const { register, formState: { errors } } = useFormContext<AdminTrekDetail>()

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mode === 'view' ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Title</p>
              <p className="text-foreground">{data?.title}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Subtitle</p>
              <p className="text-foreground">{data?.subtitle}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p className="text-foreground whitespace-pre-wrap">{data?.description}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label htmlFor="trek-title" className="text-sm font-medium">Title *</label>
              <Input id="trek-title" aria-invalid={!!errors.title} aria-describedby={errors.title ? "err-title" : undefined} {...register('title')} placeholder="Enter trek title" />
              {errors.title && <p id="err-title" className="text-xs text-destructive mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <label htmlFor="trek-subtitle" className="text-sm font-medium">Subtitle *</label>
              <Input id="trek-subtitle" aria-invalid={!!errors.subtitle} aria-describedby={errors.subtitle ? "err-subtitle" : undefined} {...register('subtitle')} placeholder="Enter subtitle" />
              {errors.subtitle && <p id="err-subtitle" className="text-xs text-destructive mt-1">{errors.subtitle.message}</p>}
            </div>
            <div>
              <label htmlFor="trek-desc" className="text-sm font-medium">Description *</label>
              <Textarea id="trek-desc" aria-invalid={!!errors.description} aria-describedby={errors.description ? "err-desc" : undefined} {...register('description')} rows={5} placeholder="Full description" />
              {errors.description && <p id="err-desc" className="text-xs text-destructive mt-1">{errors.description.message}</p>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
