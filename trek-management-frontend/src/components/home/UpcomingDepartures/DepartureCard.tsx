import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDifficultyColor } from '@/utils/difficulty';
import { formatCurrency } from '@/utils/formatters/currency';
import { cn } from '@/utils/cn';
import type { Departure } from '@/types/departure';

interface DepartureCardProps {
  departure: Departure;
}

export function DepartureCard({ departure }: DepartureCardProps) {
  const isLowSeats = departure.seatsLeft <= 5;

  return (
    <div
      className="group flex items-center justify-between flex-wrap gap-4 bg-white/5 border border-white/10 rounded-2xl px-7 py-5 transition-colors duration-200 hover:bg-white/[0.09]"
      role="group"
      aria-label={`${departure.trek} departing ${departure.date}`}
    >
      {/* Trek name + date */}
      <div className="flex-[2] min-w-[180px]">
        <Link
          to={`/treks/${departure.trekSlug}`}
          className="font-bold text-white text-base hover:text-accent transition-colors focus-visible:outline-none focus-visible:underline"
        >
          {departure.trek}
        </Link>
        <div className="flex items-center gap-1.5 text-white/50 text-[0.82rem] mt-1">
          <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
          {departure.date}
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
          {departure.seatsLeft} seats
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
      <Button asChild className="btn-primary px-[22px] py-[10px] text-[0.88rem] h-auto rounded-xl shrink-0">
        <Link to={`/booking?trek=${encodeURIComponent(departure.trek)}`}>
          Book Now
        </Link>
      </Button>
    </div>
  );
}
