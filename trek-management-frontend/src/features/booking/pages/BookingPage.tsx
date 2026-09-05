import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useTrekDetail } from '@/hooks/useTrekDetail';
import { useCreateBooking } from '../api/mutations';
import type { ParticipantResponseDto } from '@/types/api';

import { BookingHeader } from '../components/BookingHeader';
import { BookingStep1 } from '../components/BookingStep1';
import { BookingStep2 } from '../components/BookingStep2';
import { BookingStep3 } from '../components/BookingStep3';
import { BookingStep4 } from '../components/BookingStep4';
import { BookingStep5 } from '../components/BookingStep5';
import { OrderSummary } from '../components/OrderSummary';

const defaultParticipant = (): ParticipantResponseDto => ({
  fullName: '',
  age: 20,
  gender: 'MALE',
  phone: '',
  email: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
});

export function BookingPage() {
  const { trekId } = useParams<{ trekId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { data: trek, isLoading, isError } = useTrekDetail(trekId ?? '');
  const createBooking = useCreateBooking();

  const [currentStep, setCurrentStep] = useState(1);
  
  const initialBatchId = searchParams.get('batch');
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(initialBatchId);
  const [travellers, setTravellers] = useState(1);
  
  const [participants, setParticipants] = useState<ParticipantResponseDto[]>([defaultParticipant()]);

  const handleSetTravellers = (count: number) => {
    setTravellers(count);
    setParticipants(prev => {
      const newArr = [...prev];
      if (count > prev.length) {
        for (let i = prev.length; i < count; i++) {
          newArr.push(defaultParticipant());
        }
      } else if (count < prev.length) {
        newArr.splice(count);
      }
      return newArr;
    });
  };

  const handleUpdateParticipant = (index: number, field: string, value: string | number) => {
    setParticipants(prev => {
      const newArr = [...prev];
      newArr[index] = { ...newArr[index], [field]: value };
      return newArr;
    });
  };

  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading trek details...</div>;
  }

  if (isError || !trek) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Error loading trek details.</div>;
  }

  const selectedDeparture = trek.departures?.find(d => d.id === selectedBatchId);
  const basePricePerPerson = selectedDeparture?.price ?? trek.lowestPrice ?? 0;
  const discountPerPerson = selectedDeparture?.discountPrice 
    ? basePricePerPerson - selectedDeparture.discountPrice 
    : 0;
  
  const totalPrice = (basePricePerPerson - discountPerPerson) * travellers;

  const handleContinue = () => {
    if (currentStep < 5) setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
    else navigate(-1);
  };

  const handleCreateBooking = async () => {
    if (!selectedBatchId) return;
    try {
      const res = await createBooking.mutateAsync({
        departureId: selectedBatchId,
        participants: participants,
      });
      setConfirmedBookingId(res.bookingId);
      return res;
    } catch (e) {
      console.error("Booking failed", e);
      throw e;
    }
  };

  const orderSummaryTrek = {
    title: trek.title,
    image: trek.coverImageUrl,
    basePrice: basePricePerPerson,
    discount: discountPerPerson
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Green Hero Section */}
      <BookingHeader currentStep={currentStep} trekTitle={trek.title} />

      {/* Main Content Area */}
      <div className="flex-1 pt-8 pb-16 px-4">
        <div className="max-w-[1020px] mx-auto flex flex-col lg:flex-row gap-6 items-start justify-center">

          {/* Left – Booking Step */}
          <div className="w-full lg:flex-1 lg:min-w-0 lg:max-w-[620px]">
            {currentStep === 1 && (
              <BookingStep1
                departures={trek.departures}
                selectedBatchId={selectedBatchId}
                setSelectedBatchId={setSelectedBatchId}
                travellers={travellers}
                setTravellers={handleSetTravellers}
                onContinue={handleContinue}
                onBack={handleBack}
              />
            )}
            {currentStep === 2 && (
              <BookingStep2 
                participants={participants}
                updateParticipant={handleUpdateParticipant}
                onContinue={handleContinue}
                onBack={handleBack}
              />
            )}
            {currentStep === 3 && (
              <BookingStep3 
                primaryParticipant={participants[0]}
                updatePrimaryParticipant={(field: string, value: string) => handleUpdateParticipant(0, field, value)}
                onContinue={handleContinue}
                onBack={handleBack}
              />
            )}
            {currentStep === 4 && (
              <BookingStep4 
                totalPrice={totalPrice}
                onCreateBooking={handleCreateBooking}
                isPending={createBooking.isPending}
                onSuccess={() => setCurrentStep(5)}
                onBack={handleBack}
              />
            )}
            {currentStep === 5 && (
              <BookingStep5 
                trekTitle={trek.title}
                amountPaid={totalPrice}
                travellers={travellers}
                bookingId={confirmedBookingId ?? ''}
              />
            )}
          </div>

          {/* Right – Order Summary */}
          <div className="w-full lg:w-[320px] lg:shrink-0">
            <OrderSummary trek={orderSummaryTrek} travellers={travellers} selectedBatchId={selectedBatchId} />
          </div>
        </div>
      </div>
    </div>
  );
}
