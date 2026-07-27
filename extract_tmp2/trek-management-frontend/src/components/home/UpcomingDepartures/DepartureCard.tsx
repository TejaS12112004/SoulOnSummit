import { Link, useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDifficultyColor } from '@/utils/difficulty';
import { formatCurrency } from '@/utils/formatters/currency';
import { cn } from '@/utils/cn';
import { toTrekDetail } from '@/constants/routes';
import type { HomeUpcomingDepartureViewModel } from '@/types/home';

interface DepartureCardProps {
  departure: HomeUpcomingDepartureViewModel;
}

const LOW_SEAT_THRESHOLD = 5;

export function DepartureCard({ departure }: DepartureCardProps) {
  const navigate = useNavigate();
  const isLowSeats = departure.availableSeats <= LOW_SEAT_THRESHOLD;

  const handleCardClick = () => {
    navigate(toTrekDetail(departure.trekId));
  };

  return (
    <div
      onClick={handleCardClick}
      className="group flex items-center justify-between flex-wrap gap-4 bg-white/5 border border-white/10 rounded-2xl px-7 py-5 transition-all duration-200 ease-out hover:bg-white/[0.09] hover:-translate-y-1 hover:shadow-hover cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`${departure.trekTitle} departing ${departure.departureDate}`}
    >
      {/* Trek name + date */}
      <div className="flex-[2] min-w-[180px]">
        <div className="font-bold text-white text-base group-hover:text-accent transition-colors">
          {departure.trekTitle}
        </div>
        <div className="flex items-center gap-1.5 text-white/50 text-[0.82rem] mt-1">
          <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
          {departure.departureDate}
        </div>
      </div>

      {/* Difficulty badge */}
      <div className="flex-1 min-w-[100px]">
        <span className={cn("px-2.5 py-1 rounded text-xs font-semibold", getDifficultyColor(departure.difficulty))}>
          {departure.difficulty}
        </span>
      </div>

      {/* Seats left */}
      <div className="flex-1 min-w-[100px]">
        <div className="text-[0.8rem] text-white/45">Seats Left</div>
        <div className={cn("font-bold text-base", isLowSeats ? "text-red-300" : "text-green-300")}>
          {departure.availableSeats} seats
        </div>
      </div>

      {/* Price */}
      <div className="flex-1 min-w-[100px]">
        <div className="text-[0.8rem] text-white/45">From</div>
        <div className="font-bold text-white text-[1.1rem]">
          {formatCurrency(departure.price)}
        </div>
      </div>

      {/* Book Now */}
      <Button asChild className="book-now-btn btn-primary px-[22px] py-[10px] text-[0.88rem] h-auto rounded-xl shrink-0">
        <Link
          to={`/booking?trek=${encodeURIComponent(departure.trekTitle)}`}
          onClick={(e) => e.stopPropagation()}
        >
          Book Now
        </Link>
      </Button>
    </div>
  );
}
