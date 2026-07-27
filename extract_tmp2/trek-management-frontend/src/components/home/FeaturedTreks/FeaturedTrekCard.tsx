import { Link } from 'react-router-dom';
import { Star, MapPin, Clock3 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { toTrekDetail } from '@/constants/routes';
import { getDifficultyColor } from '@/utils/difficulty';
import { formatCurrency } from '@/utils/formatters/currency';
import type { HomeFeaturedTrekViewModel } from '@/types/home';

interface FeaturedTrekCardProps {
  trek: HomeFeaturedTrekViewModel;
}

export function FeaturedTrekCard({ trek }: FeaturedTrekCardProps) {
  return (
    <Link 
      to={toTrekDetail(trek.id)} 
      className="card block group cursor-pointer hover:-translate-y-1 hover:shadow-hover transition-all duration-200 ease-out focus-visible:outline-none"
    >
      <div className="relative h-[220px] overflow-hidden bg-image-placeholder">
          <img
            src={trek.coverImageUrl}
            alt={trek.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" aria-hidden="true" />
          <div className="absolute top-3.5 left-3.5">
            <span className={cn("px-2.5 py-1 rounded text-xs font-semibold", getDifficultyColor(trek.difficulty))}>
              {trek.difficulty}
            </span>
          </div>
          <div className="absolute bottom-3.5 right-3.5 bg-black/55 text-white rounded-lg px-2.5 py-1 text-[0.78rem] font-semibold">
            {trek.maxAltitude}
          </div>
        </div>

        <div className="p-5 pb-6">
          <h3 className="font-bold text-[1.05rem] text-foreground mb-1.5 group-hover:text-forest transition-colors">
            {trek.title}
          </h3>
          <div className="text-muted-foreground text-[0.82rem] mb-3.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {trek.location}
          </div>

          <div className="flex gap-4 mb-3.5 text-[0.82rem] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock3 className="w-3.5 h-3.5" />
              {trek.durationDays} Days
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-accent text-accent" />
              {trek.rating} ({trek.reviewCount})
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-y border-beige-dark mb-4">
            <div>
              <div className="text-[0.75rem] text-muted-foreground">Next Batch</div>
              <div className="text-[0.88rem] font-semibold text-forest">{trek.nextBatch}</div>
            </div>
            <div className="text-right">
              <div className="text-[0.75rem] text-muted-foreground">Seats Left</div>
              <div className={cn("text-[0.88rem] font-semibold", trek.seatsLeft <= 5 ? "text-destructive" : "text-forest")}>
                {trek.seatsLeft} only!
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <span className="line-through text-muted-foreground/70 text-[0.82rem] mr-1.5">
                {formatCurrency(trek.originalPrice)}
              </span>
              <span className="text-[1.15rem] font-bold text-forest">
                {formatCurrency(trek.price)}
              </span>
              <span className="text-muted-foreground text-[0.78rem]">/person</span>
            </div>
            <div className="bg-forest text-white px-4 py-2 text-[0.85rem] rounded-lg font-medium transition-colors group-hover:bg-forest/90">
              View Details
            </div>
          </div>
        </div>
    </Link>
  );
}
