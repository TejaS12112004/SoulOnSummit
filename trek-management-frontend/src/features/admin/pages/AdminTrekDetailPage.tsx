import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm, FormProvider } from 'react-hook-form'
import { ArrowLeft, Save, Edit2, X, CheckCircle, XCircle, Star, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/constants/routes'
import { 
  useAdminTrek, 
  useCreateTrek, 
  useUpdateTrek,
  usePublishTrek,
  useUnpublishTrek,
  useFeatureTrek,
  useDeleteTrek
} from '../hooks/useAdminTreks'
import type { AdminTrekDetail } from '../types'

// Import Sections
import { BasicInfoSection } from '../components/trek-detail/BasicInfoSection'
import { LocationSection } from '../components/trek-detail/LocationSection'
import { PricingSection } from '../components/trek-detail/PricingSection'
import { GallerySection } from '../components/trek-detail/GallerySection'
import { HighlightsSection } from '../components/trek-detail/HighlightsSection'
import { FAQSection } from '../components/trek-detail/FAQSection'
import { ItinerarySection } from '../components/trek-detail/ItinerarySection'
import { PoliciesSection } from '../components/trek-detail/PoliciesSection'

export default function AdminTrekDetailPage() {
  const { id } = useParams<{ id: string }>()
  const isNew = id === 'new'
  const navigate = useNavigate()

  const [mode, setMode] = useState<'view' | 'edit'>(isNew ? 'edit' : 'view')

  // Fetch data
  const { data: trek, isLoading, isError } = useAdminTrek(isNew ? undefined : id)

  // Mutations
  const createMutation = useCreateTrek()
  const updateMutation = useUpdateTrek()
  const publishMutation = usePublishTrek()
  const unpublishMutation = useUnpublishTrek()
  const featureMutation = useFeatureTrek()
  const deleteMutation = useDeleteTrek()

  // Form Setup
  const methods = useForm<AdminTrekDetail>({
    defaultValues: trek || {
      difficulty: 'EASY',
      images: [],
      itineraryDays: [],
      faqs: [],
      highlights: [],
    },
  })
  
  const { reset, handleSubmit, formState: { isDirty } } = methods

  // Reset form when data loads
  useEffect(() => {
    if (trek && !isNew) {
      reset(trek)
    }
  }, [trek, isNew, reset])

  // Warn on unsaved changes before leaving
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && mode === 'edit') {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty, mode])

  const onSubmit = (data: AdminTrekDetail) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, departures, ...requestData } = data

    if (isNew) {
      createMutation.mutate(requestData, {
        onSuccess: () => {
          navigate(ROUTES.ADMIN_TREKS)
        }
      })
    } else {
      updateMutation.mutate({ id: id!, data: requestData }, {
        onSuccess: () => {
          setMode('view')
        }
      })
    }
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this trek? This action cannot be undone.')) {
      deleteMutation.mutate(id!, {
        onSuccess: () => navigate(ROUTES.ADMIN_TREKS)
      })
    }
  }

  if (isLoading && !isNew) {
    return <div className="max-w-4xl mx-auto p-6 space-y-4"><Skeleton className="h-10 w-48" /><Skeleton className="h-96 w-full" /></div>
  }

  if (isError) {
    return <div className="max-w-4xl mx-auto p-6 text-destructive">Failed to load trek details.</div>
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/50 pb-4 mb-8 pt-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.ADMIN_TREKS)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {isNew ? 'Create New Trek' : trek?.title}
                </h1>
                {!isNew && (
                  <div className="flex gap-2">
                    {trek?.published ? (
                      <Badge className="bg-emerald-100 text-emerald-800">Published</Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                    {trek?.featured && (
                      <Badge className="bg-purple-100 text-purple-800"><Star className="w-3 h-3 mr-1 fill-current"/> Featured</Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!isNew && mode === 'view' && (
              <>
                {trek?.published ? (
                  <Button variant="outline" onClick={() => unpublishMutation.mutate(id!)} disabled={unpublishMutation.isPending}>
                    <XCircle className="w-4 h-4 mr-2 text-orange-500" /> Unpublish
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => publishMutation.mutate(id!)} disabled={publishMutation.isPending}>
                    <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> Publish
                  </Button>
                )}
                
                <Button variant="outline" onClick={() => featureMutation.mutate(id!)} disabled={featureMutation.isPending}>
                  <Star className={`w-4 h-4 mr-2 ${trek?.featured ? 'text-purple-500 fill-purple-500' : ''}`} /> 
                  {trek?.featured ? 'Unfeature' : 'Feature'}
                </Button>

                <Button variant="outline" onClick={() => setMode('edit')}>
                  <Edit2 className="w-4 h-4 mr-2" /> Edit Trek
                </Button>
                
                <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
              </>
            )}

            {mode === 'edit' && (
              <>
                {!isNew && (
                  <Button variant="ghost" onClick={() => { reset(trek); setMode('view') }}>
                    <X className="w-4 h-4 mr-2" /> Cancel
                  </Button>
                )}
                <Button onClick={handleSubmit(onSubmit)} disabled={createMutation.isPending || updateMutation.isPending}>
                  <Save className="w-4 h-4 mr-2" />
                  {isNew ? 'Create Trek' : 'Save Changes'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <BasicInfoSection mode={mode} data={trek} />
          <LocationSection mode={mode} data={trek} />
          <PricingSection mode={mode} data={trek} />
          <GallerySection mode={mode} data={trek} />
          <HighlightsSection mode={mode} data={trek} />
          <ItinerarySection mode={mode} data={trek} />
          <FAQSection mode={mode} data={trek} />
          <PoliciesSection mode={mode} data={trek} />
        </form>
      </FormProvider>

    </div>
  )
}
