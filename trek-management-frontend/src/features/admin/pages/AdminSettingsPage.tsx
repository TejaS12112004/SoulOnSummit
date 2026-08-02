import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Save,
  Loader2,
  Building2,
  Share2,
  Search as SearchIcon,
  Palette,
  Upload,
  X
} from 'lucide-react';

import adminSettingsService from '@/services/adminSettingsService';
import type { SiteSettingsRequest } from '@/types/api';
import { Button } from '@/components/ui/button';

const urlOptional = z.union([z.string().url('Must be a valid URL'), z.literal('')]).optional();

const settingsSchema = z.object({
  companyName: z.string().min(1, 'Company Name is required'),
  supportEmail: z.string().email('Invalid email address').or(z.literal('')),
  supportPhone: z.string().optional(),
  businessAddress: z.string().optional(),
  instagramUrl: urlOptional,
  facebookUrl: urlOptional,
  youtubeUrl: urlOptional,
  twitterUrl: urlOptional,
  defaultMetaTitle: z.string().max(60, 'Should be under 60 characters for best SEO').optional(),
  defaultMetaDescription: z.string().max(160, 'Should be under 160 characters').optional(),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  const { data: currentSettings, isLoading } = useQuery({
    queryKey: ['adminSettings'],
    queryFn: adminSettingsService.getSettings,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      companyName: '',
      supportEmail: '',
      supportPhone: '',
      businessAddress: '',
      instagramUrl: '',
      facebookUrl: '',
      youtubeUrl: '',
      twitterUrl: '',
      defaultMetaTitle: '',
      defaultMetaDescription: '',
      logoUrl: '',
      faviconUrl: '',
    },
  });

  const logoUrl = watch('logoUrl');
  const faviconUrl = watch('faviconUrl');

  useEffect(() => {
    if (currentSettings) {
      reset({
        companyName: currentSettings.companyName || '',
        supportEmail: currentSettings.supportEmail || '',
        supportPhone: currentSettings.supportPhone || '',
        businessAddress: currentSettings.businessAddress || '',
        instagramUrl: currentSettings.instagramUrl || '',
        facebookUrl: currentSettings.facebookUrl || '',
        youtubeUrl: currentSettings.youtubeUrl || '',
        twitterUrl: currentSettings.twitterUrl || '',
        defaultMetaTitle: currentSettings.defaultMetaTitle || '',
        defaultMetaDescription: currentSettings.defaultMetaDescription || '',
        logoUrl: currentSettings.logoUrl || '',
        faviconUrl: currentSettings.faviconUrl || '',
      });
    }
  }, [currentSettings, reset]);

  const updateMutation = useMutation({
    mutationFn: adminSettingsService.updateSettings,
    onSuccess: () => {
      toast.success('Settings updated successfully');
      queryClient.invalidateQueries({ queryKey: ['adminSettings'] });
      queryClient.invalidateQueries({ queryKey: ['publicSettings'] });
    },
    onError: () => {
      toast.error('Failed to update settings');
    }
  });

  const onSubmit = (data: SettingsFormValues) => {
    updateMutation.mutate(data as SiteSettingsRequest);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }

    const setUploading = type === 'logo' ? setUploadingLogo : setUploadingFavicon;
    const uploadFn = type === 'logo' ? adminSettingsService.uploadLogo : adminSettingsService.uploadFavicon;
    const formField = type === 'logo' ? 'logoUrl' : 'faviconUrl';

    try {
      setUploading(true);
      const res = await uploadFn(file);
      setValue(formField, res.publicUrl, { shouldDirty: true });
      toast.success(`${type === 'logo' ? 'Logo' : 'Favicon'} uploaded successfully`);
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-heading font-bold text-gray-900">Site Settings</h1>
        <p className="text-gray-500 mt-1">Manage global configuration for your public-facing website.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* General Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4 flex items-center gap-2 bg-gray-50/50">
                <Building2 className="w-5 h-5 text-primary-600" />
                <h2 className="font-semibold text-gray-900">General Information</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                    <input
                      {...register('companyName')}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                    {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Support Phone</label>
                    <input
                      {...register('supportPhone')}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                  <input
                    {...register('supportEmail')}
                    type="email"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                  {errors.supportEmail && <p className="text-red-500 text-sm mt-1">{errors.supportEmail.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
                  <textarea
                    {...register('businessAddress')}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none min-h-[80px]"
                  />
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4 flex items-center gap-2 bg-gray-50/50">
                <SearchIcon className="w-5 h-5 text-primary-600" />
                <h2 className="font-semibold text-gray-900">Default SEO</h2>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-500 pb-2">These are fallback values if a specific page (like a Trek) doesn't have its own meta information.</p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                  <input
                    {...register('defaultMetaTitle')}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="e.g. Your Company - Best Treks"
                  />
                  {errors.defaultMetaTitle && <p className="text-red-500 text-sm mt-1">{errors.defaultMetaTitle.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                  <textarea
                    {...register('defaultMetaDescription')}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none min-h-[80px]"
                    placeholder="Short description of your business..."
                  />
                  {errors.defaultMetaDescription && <p className="text-red-500 text-sm mt-1">{errors.defaultMetaDescription.message}</p>}
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4 flex items-center gap-2 bg-gray-50/50">
                <Share2 className="w-5 h-5 text-primary-600" />
                <h2 className="font-semibold text-gray-900">Social Media Links</h2>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-500 pb-2">Empty links will automatically hide the corresponding icon on the public site.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                    <input
                      {...register('instagramUrl')}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="https://instagram.com/..."
                    />
                    {errors.instagramUrl && <p className="text-red-500 text-sm mt-1">{errors.instagramUrl.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                    <input
                      {...register('facebookUrl')}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="https://facebook.com/..."
                    />
                    {errors.facebookUrl && <p className="text-red-500 text-sm mt-1">{errors.facebookUrl.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
                    <input
                      {...register('youtubeUrl')}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="https://youtube.com/..."
                    />
                    {errors.youtubeUrl && <p className="text-red-500 text-sm mt-1">{errors.youtubeUrl.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Twitter / X URL</label>
                    <input
                      {...register('twitterUrl')}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="https://twitter.com/..."
                    />
                    {errors.twitterUrl && <p className="text-red-500 text-sm mt-1">{errors.twitterUrl.message}</p>}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Branding */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4 flex items-center gap-2 bg-gray-50/50">
                <Palette className="w-5 h-5 text-primary-600" />
                <h2 className="font-semibold text-gray-900">Branding</h2>
              </div>
              <div className="p-6 space-y-6">
                
                {/* Logo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Logo</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                    {logoUrl ? (
                      <div className="relative inline-block">
                        <img src={logoUrl} alt="Logo" className="max-h-24 max-w-full rounded object-contain" />
                        <button
                          type="button"
                          onClick={() => setValue('logoUrl', '', { shouldDirty: true })}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'logo')}
                            disabled={uploadingLogo}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                          />
                          <Button type="button" variant="outline" size="sm" disabled={uploadingLogo}>
                            {uploadingLogo ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                            Upload Logo
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Favicon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                    {faviconUrl ? (
                      <div className="relative inline-block">
                        <img src={faviconUrl} alt="Favicon" className="w-8 h-8 rounded object-contain" />
                        <button
                          type="button"
                          onClick={() => setValue('faviconUrl', '', { shouldDirty: true })}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'favicon')}
                            disabled={uploadingFavicon}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                          />
                          <Button type="button" variant="outline" size="sm" disabled={uploadingFavicon}>
                            {uploadingFavicon ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                            Upload Favicon
                          </Button>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Square image (PNG, ICO)</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Save Action Sticky Block (Optional on small screens, but good for visibility) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <p className="text-sm text-gray-500 mb-4">
                Changes made here will be reflected globally across the public website immediately.
              </p>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting || !isDirty || updateMutation.isPending}
              >
                {isSubmitting || updateMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Settings
              </Button>
            </div>

          </div>
        </div>

      </form>
    </div>
  );
}
