import { useFormContext, useFieldArray } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { AdminTrekDetail } from '../../types'

interface ItinerarySectionProps {
  mode: 'view' | 'edit'
  data?: AdminTrekDetail
}

export function ItinerarySection({ mode, data }: ItinerarySectionProps) {
  const { register, control, formState: { errors } } = useFormContext<AdminTrekDetail>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'itineraryDays'
  })

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Itinerary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {mode === 'view' ? (
          <div className="space-y-6">
            {data?.itineraryDays && data.itineraryDays.length > 0 ? (
              data.itineraryDays.map((day: any, i: number) => (
                <div key={day.id || i} className="pl-4 border-l-2 border-primary/30 relative">
                  <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5 ring-4 ring-background" />
                  <h4 className="font-medium text-foreground">Day {day.dayNumber}: {day.title}</h4>
                  <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{day.description}</p>
                </div>
              ))
            ) : (
              <p className="text-foreground">No itinerary days defined.</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => append({ id: '', dayNumber: fields.length + 1, title: '', description: '', accommodation: '', meals: '', altitudeInfo: '' })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Day
              </Button>
            </div>
            
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="bg-muted/30 p-4 rounded-md border border-border/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">Day {index + 1}</h4>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      aria-label="Remove Day"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label htmlFor={`trek-itin-title-${index}`} className="text-xs font-medium text-muted-foreground">Title *</label>
                      <Input 
                        id={`trek-itin-title-${index}`}
                        aria-invalid={!!errors.itineraryDays?.[index]?.title}
                        aria-describedby={errors.itineraryDays?.[index]?.title ? `err-itin-title-${index}` : undefined}
                        {...register(`itineraryDays.${index}.title` as const)} 
                        placeholder="E.g. Arrival in Manali" 
                        className="mt-1"
                      />
                      {errors.itineraryDays?.[index]?.title && (
                        <p id={`err-itin-title-${index}`} className="text-xs text-destructive mt-1">{errors.itineraryDays[index]?.title?.message}</p>
                      )}
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor={`trek-itin-desc-${index}`} className="text-xs font-medium text-muted-foreground">Description *</label>
                      <Textarea 
                        id={`trek-itin-desc-${index}`}
                        aria-invalid={!!errors.itineraryDays?.[index]?.description}
                        aria-describedby={errors.itineraryDays?.[index]?.description ? `err-itin-desc-${index}` : undefined}
                        {...register(`itineraryDays.${index}.description` as const)} 
                        placeholder="Detailed plan for the day" 
                        className="mt-1"
                        rows={3}
                      />
                      {errors.itineraryDays?.[index]?.description && (
                        <p id={`err-itin-desc-${index}`} className="text-xs text-destructive mt-1">{errors.itineraryDays[index]?.description?.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor={`trek-itin-acc-${index}`} className="text-xs font-medium text-muted-foreground">Accommodation</label>
                      <Input 
                        id={`trek-itin-acc-${index}`}
                        {...register(`itineraryDays.${index}.accommodation` as const)} 
                        placeholder="E.g. Hotel / Tents" 
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor={`trek-itin-meals-${index}`} className="text-xs font-medium text-muted-foreground">Meals</label>
                      <Input 
                        id={`trek-itin-meals-${index}`}
                        {...register(`itineraryDays.${index}.meals` as const)} 
                        placeholder="E.g. Dinner included" 
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label htmlFor={`trek-itin-alt-${index}`} className="text-xs font-medium text-muted-foreground">Altitude Info</label>
                      <Input 
                        id={`trek-itin-alt-${index}`}
                        {...register(`itineraryDays.${index}.altitudeInfo` as const)} 
                        placeholder="E.g. Max altitude 4000m" 
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <input type="hidden" {...register(`itineraryDays.${index}.dayNumber` as const, { valueAsNumber: true })} value={index + 1} />
                </div>
              ))}
              
              {fields.length === 0 && (
                <p className="text-sm text-muted-foreground italic text-center py-6 bg-muted/20 rounded-md border border-dashed border-border/50">
                  No itinerary days added yet. Click "Add Day" to begin.
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
