import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Plus, Trash2, UploadCloud, FileText } from 'lucide-react';
import adminTrekService from '@/services/adminTrekService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const trekSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  subtitle: z.string().max(255).optional(),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required").max(255),
  state: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  difficulty: z.enum(['EASY', 'MODERATE', 'DIFFICULT', 'EXTREME']),
  durationDays: z.number().min(1, "Duration must be at least 1 day"),
  distanceKm: z.number().min(0).optional(),
  maxAltitude: z.number().min(0).optional(),
  summitPoint: z.string().max(255).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  pickupPoint: z.string().max(255).optional(),
  dropPoint: z.string().max(255).optional(),
  included: z.string().optional(),
  excluded: z.string().optional(),
  thingsToCarry: z.string().optional(),
  cancellationPolicy: z.string().optional(),
  
  itineraryDays: z.array(z.object({
    id: z.string().optional(), // Existing ID for updates
    dayNumber: z.number().min(1),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    stay: z.string().optional(),
    meals: z.string().optional(),
    distanceKm: z.number().min(0).optional(),
    durationHours: z.number().min(0).optional(),
    altitude: z.number().min(0).optional(),
    displayOrder: z.number().min(0)
  })).optional()
});

type TrekFormValues = z.infer<typeof trekSchema>;

export function AdminTrekFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [itineraryPdfFile, setItineraryPdfFile] = useState<File | null>(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const { data: initialTrek, isLoading: isLoadingTrek } = useQuery({
    queryKey: ['adminTreks', id],
    queryFn: () => adminTrekService.getAdminTrekById(id!),
    enabled: isEditMode,
  });

  const form = useForm<TrekFormValues>({
    resolver: zodResolver(trekSchema),
    defaultValues: {
      difficulty: 'MODERATE',
      durationDays: 1,
      itineraryDays: []
    }
  });

  const { fields: itineraryFields, append: appendItinerary, remove: removeItinerary } = useFieldArray({
    control: form.control,
    name: "itineraryDays"
  });

  useEffect(() => {
    if (initialTrek) {
      form.reset({
        ...initialTrek,
        distanceKm: initialTrek.distanceKm || undefined,
        maxAltitude: initialTrek.maxAltitude || undefined,
        latitude: initialTrek.latitude || undefined,
        longitude: initialTrek.longitude || undefined,
        itineraryDays: initialTrek.itineraryDays?.map(day => ({
          ...day,
          distanceKm: day.distanceKm || undefined,
          durationHours: day.durationHours || undefined,
          altitude: day.altitude || undefined,
        })) || []
      });
    }
  }, [initialTrek, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast.error('Must be an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      setCoverImageFile(file);
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        toast.error('Must be a PDF file');
        return;
      }
      setItineraryPdfFile(file);
    }
  };

  const onSubmit = async (data: TrekFormValues) => {
    try {
      setIsSubmittingForm(true);
      let trekId = id;

      // 1. Create or Update Trek
      const trekPayload = {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        location: data.location,
        state: data.state,
        country: data.country,
        difficulty: data.difficulty as any,
        durationDays: data.durationDays,
        distanceKm: data.distanceKm,
        maxAltitude: data.maxAltitude,
        summitPoint: data.summitPoint,
        latitude: data.latitude,
        longitude: data.longitude,
        pickupPoint: data.pickupPoint,
        dropPoint: data.dropPoint,
        included: data.included,
        excluded: data.excluded,
        thingsToCarry: data.thingsToCarry,
        cancellationPolicy: data.cancellationPolicy
      };

      if (!isEditMode) {
        const createdTrek = await adminTrekService.createTrek(trekPayload as any);
        trekId = createdTrek.id;
      } else {
        await adminTrekService.updateTrek(trekId!, trekPayload as any);
      }

      // 2. Upload Files if provided
      let shouldUpdateUrls = false;
      let coverUrl = undefined;
      let pdfUrl = undefined;

      if (coverImageFile) {
        const res = await adminTrekService.uploadTrekCover(trekId!, coverImageFile);
        coverUrl = res.publicUrl;
        shouldUpdateUrls = true;
      }
      if (itineraryPdfFile) {
        const res = await adminTrekService.uploadTrekItineraryPdf(trekId!, itineraryPdfFile);
        pdfUrl = res.publicUrl;
        shouldUpdateUrls = true;
      }

      // Update trek with new URLs
      if (shouldUpdateUrls) {
        await adminTrekService.updateTrek(trekId!, {
          coverImageUrl: coverUrl,
          itineraryPdfUrl: pdfUrl
        });
      }

      // 3. Process Itinerary Days
      // For edit mode, we delete all existing days not in the new list, update existing, create new.
      // Easiest is to compare with initialTrek
      const currentDays = data.itineraryDays || [];
      const previousDays = initialTrek?.itineraryDays || [];

      // Delete removed days
      for (const prev of previousDays) {
        if (!currentDays.find(d => d.id === prev.id)) {
          await adminTrekService.deleteItineraryDay(prev.id);
        }
      }

      // Create or Update
      for (let i = 0; i < currentDays.length; i++) {
        const day = currentDays[i];
        const payload = {
          dayNumber: day.dayNumber,
          title: day.title,
          description: day.description,
          stay: day.stay,
          meals: day.meals,
          distanceKm: day.distanceKm,
          durationHours: day.durationHours,
          altitude: day.altitude,
          displayOrder: i // Ensure order matches UI
        };

        if (day.id) {
          await adminTrekService.updateItineraryDay(day.id, payload);
        } else {
          await adminTrekService.createItineraryDay(trekId!, payload);
        }
      }

      toast.success(isEditMode ? 'Trek updated successfully' : 'Trek created successfully');
      queryClient.invalidateQueries({ queryKey: ['adminTreks'] });
      queryClient.invalidateQueries({ queryKey: ['treks'] });
      navigate('/admin/treks');

    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || 'Failed to save trek');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  if (isEditMode && isLoadingTrek) {
    return <div className="p-8 text-center">Loading trek details...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Edit Trek' : 'Add New Trek'}
          </h1>
          <p className="text-gray-500 mt-1">
            {isEditMode ? 'Update the details for this trek' : 'Fill in the details to create a new trek'}
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* A. BASIC INFORMATION */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title <span className="text-red-500">*</span></label>
              <Input {...form.register('title')} placeholder="e.g. Everest Base Camp" />
              {form.formState.errors.title && <p className="text-xs text-red-500">{form.formState.errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subtitle</label>
              <Input {...form.register('subtitle')} placeholder="A challenging high altitude trek" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Description <span className="text-red-500">*</span></label>
              <Textarea {...form.register('description')} rows={4} placeholder="Full description of the trek..." />
              {form.formState.errors.description && <p className="text-xs text-red-500">{form.formState.errors.description.message}</p>}
            </div>
          </div>
        </div>

        {/* B. LOCATION */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Location <span className="text-red-500">*</span></label>
              <Input {...form.register('location')} placeholder="e.g. Khumbu Region" />
              {form.formState.errors.location && <p className="text-xs text-red-500">{form.formState.errors.location.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">State</label>
              <Input {...form.register('state')} placeholder="e.g. Uttarakhand" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Country</label>
              <Input {...form.register('country')} placeholder="e.g. India" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Summit Point</label>
              <Input {...form.register('summitPoint')} placeholder="e.g. Kala Patthar" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Latitude</label>
              <Input type="number" step="0.000001" {...form.register('latitude', { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Longitude</label>
              <Input type="number" step="0.000001" {...form.register('longitude', { valueAsNumber: true })} />
            </div>
          </div>
        </div>

        {/* C. TREK DETAILS */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Trek Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulty <span className="text-red-500">*</span></label>
              <select 
                {...form.register('difficulty')} 
                className="w-full h-14 rounded-xl border border-border px-5 bg-input text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="EASY">Easy</option>
                <option value="MODERATE">Moderate</option>
                <option value="DIFFICULT">Difficult</option>
                <option value="EXTREME">Extreme</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration (Days) <span className="text-red-500">*</span></label>
              <Input type="number" {...form.register('durationDays', { valueAsNumber: true })} />
              {form.formState.errors.durationDays && <p className="text-xs text-red-500">{form.formState.errors.durationDays.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Distance (km)</label>
              <Input type="number" step="0.1" {...form.register('distanceKm', { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Altitude (m)</label>
              <Input type="number" {...form.register('maxAltitude', { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Pickup Point</label>
              <Input {...form.register('pickupPoint')} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Drop Point</label>
              <Input {...form.register('dropPoint')} />
            </div>
          </div>
        </div>

        {/* F. MEDIA */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Media & Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium block">Cover Image</label>
              <div className="flex items-center gap-4">
                <Button type="button" variant="outline" className="relative overflow-hidden">
                  <UploadCloud className="w-4 h-4 mr-2" />
                  Select Image
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </Button>
                {coverImageFile && <span className="text-sm text-gray-500 truncate">{coverImageFile.name}</span>}
                {!coverImageFile && initialTrek?.coverImageUrl && (
                  <a href={initialTrek.coverImageUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                    View Current Image
                  </a>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium block">Itinerary PDF</label>
              <div className="flex items-center gap-4">
                <Button type="button" variant="outline" className="relative overflow-hidden">
                  <FileText className="w-4 h-4 mr-2" />
                  Select PDF
                  <input 
                    type="file" 
                    accept="application/pdf" 
                    onChange={handlePdfChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </Button>
                {itineraryPdfFile && <span className="text-sm text-gray-500 truncate">{itineraryPdfFile.name}</span>}
                {!itineraryPdfFile && initialTrek?.itineraryPdfUrl && (
                  <a href={initialTrek.itineraryPdfUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                    View Current PDF
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* D. TREK CONTENT */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Policies & Content</h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Included</label>
              <Textarea {...form.register('included')} rows={3} placeholder="What's included in the price..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Excluded</label>
              <Textarea {...form.register('excluded')} rows={3} placeholder="What's excluded..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Things to Carry</label>
              <Textarea {...form.register('thingsToCarry')} rows={3} placeholder="Required packing items..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Cancellation Policy</label>
              <Textarea {...form.register('cancellationPolicy')} rows={3} placeholder="Rules for cancellation..." />
            </div>
          </div>
        </div>

        {/* E. ITINERARY DAYS */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-xl font-semibold text-gray-900">Itinerary Days</h2>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => appendItinerary({
                dayNumber: itineraryFields.length + 1,
                title: '',
                description: '',
                displayOrder: itineraryFields.length
              })}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Day
            </Button>
          </div>

          <div className="space-y-6 mt-4">
            {itineraryFields.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">No itinerary days added yet.</p>
            )}
            
            {itineraryFields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-lg bg-gray-50 relative">
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeItinerary(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-medium">Day #</label>
                    <Input type="number" {...form.register(`itineraryDays.${index}.dayNumber`, { valueAsNumber: true })} />
                  </div>
                  <div className="md:col-span-10 space-y-2">
                    <label className="text-xs font-medium">Day Title</label>
                    <Input {...form.register(`itineraryDays.${index}.title`)} placeholder="e.g. Arrival in Kathmandu" />
                  </div>
                  <div className="md:col-span-12 space-y-2">
                    <label className="text-xs font-medium">Description</label>
                    <Textarea {...form.register(`itineraryDays.${index}.description`)} rows={2} />
                  </div>
                  <div className="md:col-span-3 space-y-2">
                    <label className="text-xs font-medium">Stay</label>
                    <Input {...form.register(`itineraryDays.${index}.stay`)} placeholder="e.g. Hotel" />
                  </div>
                  <div className="md:col-span-3 space-y-2">
                    <label className="text-xs font-medium">Meals</label>
                    <Input {...form.register(`itineraryDays.${index}.meals`)} placeholder="e.g. B, L, D" />
                  </div>
                  <div className="md:col-span-3 space-y-2">
                    <label className="text-xs font-medium">Distance (km)</label>
                    <Input type="number" step="0.1" {...form.register(`itineraryDays.${index}.distanceKm`, { valueAsNumber: true })} />
                  </div>
                  <div className="md:col-span-3 space-y-2">
                    <label className="text-xs font-medium">Duration (hrs)</label>
                    <Input type="number" step="0.1" {...form.register(`itineraryDays.${index}.durationHours`, { valueAsNumber: true })} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t pt-6">
          <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isSubmittingForm}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmittingForm} className="min-w-[120px]">
            {isSubmittingForm ? 'Saving...' : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEditMode ? 'Save Changes' : 'Create Trek'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
