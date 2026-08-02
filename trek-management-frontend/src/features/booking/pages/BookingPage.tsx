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
  age: 20, // default valid age
  gender: 'MALE', // default valid gender
  phone: '',
  email: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
});

export function BookingPage() {
  const { trekId } = useParams<{ trekId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Fetch real trek data
  const { data: trek, isLoading, isError } = useTrekDetail(trekId ?? '');
  
  // Create booking mutation
  const createBooking = useCreateBooking();

  // Step state
  const [currentStep, setCurrentStep] = useState(1);
  
  // Booking Data State
  const initialBatchId = searchParams.get('batch');
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(initialBatchId);
  const [travellers, setTravellers] = useState(1);
  
  // Store an array of participants based on travellers count
  const [participants, setParticipants] = useState<ParticipantResponseDto[]>([defaultParticipant()]);

  // Keep array length in sync with travellers count
  const handleSetTravellers = (count: number) => {
    setTravellers(count);
    setParticipants(prev => {
      const newArr = [...prev];
      if (count > prev.length) {
        // Add new empty participants
        for (let i = prev.length; i < count; i++) {
          newArr.push(defaultParticipant());
        }
      } else if (count < prev.length) {
        // Remove trailing participants
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

  // State to hold final successful booking ID
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading trek details...</div>;
  }

  if (isError || !trek) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Error loading trek details.</div>;
  }

  // Find the selected departure to determine real pricing
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
      // Razorpay flow will be initiated from Step 4 using res.razorpayOrderId
      // For now, on successful backend creation, we transition to step 5.
      setConfirmedBookingId(res.bookingId);
      return res; // return to step 4 so it can handle razorpay
    } catch (e) {
      console.error("Booking failed", e);
      throw e;
    }
  };

  // Create mock order summary format for OrderSummary component backward compatibility
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
      <div style={{
        paddingTop: '48px',
        paddingBottom: '80px',
        flex: 1,
      }}>
        <div style={{
          maxWidth: '1020px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          flexDirection: 'row',
          gap: '28px',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}>
          {/* Left – Booking Step */}
          <div style={{ flex: '1 1 0', minWidth: 0, maxWidth: '620px' }}>
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
          <div style={{ width: '340px', flexShrink: 0 }}>
            <OrderSummary trek={orderSummaryTrek} travellers={travellers} selectedBatchId={selectedBatchId} />
          </div>
        </div>
      </div>
    </div>
  );
}
