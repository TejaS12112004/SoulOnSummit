import { useFormContext, useFieldArray } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { AdminTrekDetail } from '../../types'

interface HighlightsSectionProps {
  mode: 'view' | 'edit'
  data?: AdminTrekDetail
}

export function HighlightsSection({ mode, data }: HighlightsSectionProps) {
  const { register, control, formState: { errors } } = useFormContext<AdminTrekDetail>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'highlights'
  })

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Highlights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {mode === 'view' ? (
          <div className="space-y-2">
            {data?.highlights && data.highlights.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {data.highlights.map((h: any, i: number) => (
                  <li key={h.id || i} className="text-foreground">{h.title}</li>
                ))}
              </ul>
            ) : (
              <p className="text-foreground">No highlights specified.</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => append({ id: '', title: '', description: '' })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Highlight
              </Button>
            </div>
            
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start bg-muted/30 p-3 rounded-md border border-border/50">
                  <div className="flex-1">
                    <Input 
                      {...register(`highlights.${index}.title` as const)} 
                      placeholder="Highlight text (e.g. Stunning views of Mt. Everest)" 
                    />
                    {errors.highlights?.[index]?.title && (
                      <p className="text-xs text-destructive mt-1">{errors.highlights[index]?.title?.message}</p>
                    )}
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              
              {fields.length === 0 && (
                <p className="text-sm text-muted-foreground italic text-center py-4 bg-muted/20 rounded-md border border-dashed border-border/50">
                  No highlights added.
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
