import { useFormContext, useFieldArray } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { AdminTrekDetail } from '../../types'

interface GallerySectionProps {
  mode: 'view' | 'edit'
  data?: AdminTrekDetail
}

export function GallerySection({ mode, data }: GallerySectionProps) {
  const { register, control, formState: { errors } } = useFormContext<AdminTrekDetail>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'images'
  })

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Media & Gallery</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {mode === 'view' ? (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Cover Image URL</p>
              {data?.coverImageUrl ? (
                <div className="w-full max-w-sm aspect-video rounded-md overflow-hidden bg-muted">
                  <img src={data.coverImageUrl} alt="Cover" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400?text=No+Image' }} />
                </div>
              ) : (
                <p className="text-foreground">None</p>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Gallery Images ({data?.images?.length || 0})</p>
              {data?.images && data.images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {data.images.map((img: any, i: number) => (
                    <div key={img.id || i} className="aspect-square rounded-md overflow-hidden bg-muted">
                      <img src={img.imageUrl} alt={`Gallery ${i}`} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x400?text=No+Image' }} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-foreground">No gallery images</p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label htmlFor="trek-cover-image" className="text-sm font-medium">Cover Image URL *</label>
              <Input id="trek-cover-image" aria-invalid={!!errors.coverImageUrl} aria-describedby={errors.coverImageUrl ? "err-cover" : undefined} {...register('coverImageUrl')} placeholder="https://example.com/image.jpg" />
              {errors.coverImageUrl && <p id="err-cover" className="text-xs text-destructive mt-1">{errors.coverImageUrl.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Gallery Images</label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => append({ id: '', imageUrl: '', isCover: false, displayOrder: fields.length })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Image
                </Button>
              </div>
              
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-start bg-muted/30 p-3 rounded-md border border-border/50">
                    <div className="flex-1 space-y-3">
                      <div>
                        <label htmlFor={`trek-img-${index}`} className="sr-only">Image URL</label>
                        <Input 
                          id={`trek-img-${index}`}
                          aria-invalid={!!errors.images?.[index]?.imageUrl}
                          aria-describedby={errors.images?.[index]?.imageUrl ? `err-img-${index}` : undefined}
                          {...register(`images.${index}.imageUrl` as const)} 
                          placeholder="Image URL" 
                        />
                        {errors.images?.[index]?.imageUrl && (
                          <p id={`err-img-${index}`} className="text-xs text-destructive mt-1">{errors.images[index]?.imageUrl?.message}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor={`trek-img-cover-${index}`} className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                          <input id={`trek-img-cover-${index}`} type="checkbox" {...register(`images.${index}.isCover` as const)} />
                          Is Cover
                        </label>
                      </div>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      aria-label="Remove Image"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {fields.length === 0 && (
                  <p className="text-sm text-muted-foreground italic text-center py-4 bg-muted/20 rounded-md border border-dashed border-border/50">
                    No gallery images added yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
