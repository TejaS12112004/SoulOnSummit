import { useFormContext, useFieldArray } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { AdminTrekDetail } from '../../types'

interface FAQSectionProps {
  mode: 'view' | 'edit'
  data?: AdminTrekDetail
}

export function FAQSection({ mode, data }: FAQSectionProps) {
  const { register, control, formState: { errors } } = useFormContext<AdminTrekDetail>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'faqs'
  })

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {mode === 'view' ? (
          <div className="space-y-6">
            {data?.faqs && data.faqs.length > 0 ? (
              data.faqs.map((faq: any, i: number) => (
                <div key={faq.id || i} className="space-y-1">
                  <h4 className="font-medium text-foreground">Q: {faq.question}</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">A: {faq.answer}</p>
                </div>
              ))
            ) : (
              <p className="text-foreground">No FAQs specified.</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => append({ id: '', question: '', answer: '' })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add FAQ
              </Button>
            </div>
            
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="bg-muted/30 p-4 rounded-md border border-border/50 space-y-3 relative pr-10">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      aria-label="Remove FAQ"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive absolute top-2 right-2 h-8 w-8"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  
                  <div>
                    <label htmlFor={`trek-faq-q-${index}`} className="text-xs font-medium text-muted-foreground">Question *</label>
                    <Input 
                      id={`trek-faq-q-${index}`}
                      aria-invalid={!!errors.faqs?.[index]?.question}
                      aria-describedby={errors.faqs?.[index]?.question ? `err-faq-q-${index}` : undefined}
                      {...register(`faqs.${index}.question` as const)} 
                      placeholder="e.g. Is this trek suitable for beginners?" 
                      className="mt-1"
                    />
                    {errors.faqs?.[index]?.question && (
                      <p id={`err-faq-q-${index}`} className="text-xs text-destructive mt-1">{errors.faqs[index]?.question?.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor={`trek-faq-a-${index}`} className="text-xs font-medium text-muted-foreground">Answer *</label>
                    <Textarea 
                      id={`trek-faq-a-${index}`}
                      aria-invalid={!!errors.faqs?.[index]?.answer}
                      aria-describedby={errors.faqs?.[index]?.answer ? `err-faq-a-${index}` : undefined}
                      {...register(`faqs.${index}.answer` as const)} 
                      placeholder="Answer to the question" 
                      className="mt-1"
                      rows={2}
                    />
                    {errors.faqs?.[index]?.answer && (
                      <p id={`err-faq-a-${index}`} className="text-xs text-destructive mt-1">{errors.faqs[index]?.answer?.message}</p>
                    )}
                  </div>
                </div>
              ))}
              
              {fields.length === 0 && (
                <p className="text-sm text-muted-foreground italic text-center py-4 bg-muted/20 rounded-md border border-dashed border-border/50">
                  No FAQs added.
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
