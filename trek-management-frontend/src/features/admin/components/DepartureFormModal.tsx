import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import adminTrekService from '@/services/adminTrekService';
import type { DepartureResponse, CreateDepartureRequest } from '@/types/trek';
import { useQueryClient } from '@tanstack/react-query';

const departureSchema = z.object({
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  registrationDeadline: z.string().min(1, 'Registration deadline is required'),
  price: z.number().min(0, 'Price must be non-negative'),
  discountPrice: z.number().min(0, 'Discount price must be non-negative').optional().or(z.literal(0)),
  totalSeats: z.number().min(1, 'Total seats must be at least 1'),
  availableSeats: z.number().min(0).optional(),
});

type DepartureFormValues = z.infer<typeof departureSchema>;

interface DepartureFormModalProps {
  trekId: string;
  isOpen: boolean;
  onClose: () => void;
  departure: DepartureResponse | null;
}

export function DepartureFormModal({ trekId, isOpen, onClose, departure }: DepartureFormModalProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!departure;

  const form = useForm<DepartureFormValues>({
    resolver: zodResolver(departureSchema),
    defaultValues: {
      startDate: '',
      endDate: '',
      registrationDeadline: '',
      price: 0,
      totalSeats: 20,
    }
  });

  useEffect(() => {
    if (departure && isOpen) {
      form.reset({
        startDate: departure.startDate,
        endDate: departure.endDate,
        registrationDeadline: departure.registrationDeadline,
        price: departure.price,
        discountPrice: departure.discountPrice || undefined,
        totalSeats: departure.totalSeats,
        availableSeats: departure.availableSeats,
      });
    } else if (isOpen) {
      form.reset({
        startDate: '',
        endDate: '',
        registrationDeadline: '',
        price: 0,
        discountPrice: undefined,
        totalSeats: 20,
        availableSeats: undefined,
      });
    }
  }, [departure, isOpen, form]);

  const onSubmit = async (data: DepartureFormValues) => {
    try {
      const payload: CreateDepartureRequest = {
        ...data,
        discountPrice: data.discountPrice === 0 ? undefined : data.discountPrice,
      };

      if (isEditMode) {
        await adminTrekService.updateDeparture(trekId, departure.id, payload);
        toast.success('Departure updated successfully');
      } else {
        await adminTrekService.createDeparture(trekId, payload);
        toast.success('Departure created successfully');
      }
      
      queryClient.invalidateQueries({ queryKey: ['adminTreks', trekId] });
      queryClient.invalidateQueries({ queryKey: ['adminTreks'] });
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to save departure');
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-[500px] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">{isEditMode ? 'Edit Departure' : 'Add New Departure'}</h2>
        </div>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date <span className="text-red-500">*</span></label>
              <Input type="date" {...form.register('startDate')} />
              {form.formState.errors.startDate && <p className="text-xs text-red-500">{form.formState.errors.startDate.message}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date <span className="text-red-500">*</span></label>
              <Input type="date" {...form.register('endDate')} />
              {form.formState.errors.endDate && <p className="text-xs text-red-500">{form.formState.errors.endDate.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Registration Deadline <span className="text-red-500">*</span></label>
            <Input type="date" {...form.register('registrationDeadline')} />
            {form.formState.errors.registrationDeadline && <p className="text-xs text-red-500">{form.formState.errors.registrationDeadline.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Price (INR) <span className="text-red-500">*</span></label>
              <Input type="number" step="0.01" {...form.register('price', { valueAsNumber: true })} />
              {form.formState.errors.price && <p className="text-xs text-red-500">{form.formState.errors.price.message}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Discount Price (INR)</label>
              <Input type="number" step="0.01" {...form.register('discountPrice', { valueAsNumber: true, setValueAs: (v) => v === '' ? undefined : Number(v) })} />
              {form.formState.errors.discountPrice && <p className="text-xs text-red-500">{form.formState.errors.discountPrice.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Total Seats <span className="text-red-500">*</span></label>
              <Input type="number" {...form.register('totalSeats', { valueAsNumber: true })} />
              {form.formState.errors.totalSeats && <p className="text-xs text-red-500">{form.formState.errors.totalSeats.message}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Available Seats</label>
              <Input type="number" {...form.register('availableSeats', { valueAsNumber: true, setValueAs: (v) => v === '' ? undefined : Number(v) })} />
              <p className="text-xs text-gray-500">Leave empty to use Total Seats</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t mt-6">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Saving...' : 'Save Departure'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
}
