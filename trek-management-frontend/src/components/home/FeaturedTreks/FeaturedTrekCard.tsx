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
      className="card flex flex-col group cursor-pointer hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-400 ease-out focus-visible:outline-none bg-card rounded-2xl overflow-hidden border border-border/40"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <img
            src={trek.coverImageUrl}
            alt={trek.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" aria-hidden="true" />
          <div className="absolute top-4 left-4">
            <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm", getDifficultyColor(trek.difficulty))}>
              {trek.difficulty}
            </span>
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex justify-end">
            <div className="bg-black/70 backdrop-blur-md text-white rounded-lg px-3 py-1.5 text-[11px] font-bold border border-white/20 shadow-lg">
              {trek.maxAltitude}
            </div>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <h3 className="font-display font-bold text-2xl text-foreground mb-1 group-hover:text-forest transition-colors line-clamp-2">
            {trek.title}
          </h3>
          
          <div className="flex items-baseline gap-2.5 mb-4">
            <span className="text-[1.35rem] font-bold text-accent tracking-tight">
              {formatCurrency(trek.price)}
            </span>
            <span className="line-through text-muted-foreground/50 text-[0.8rem] font-medium">
              {formatCurrency(trek.originalPrice)}
            </span>
          </div>

          <div className="text-muted-foreground/75 text-[0.85rem] mb-5 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary/70 shrink-0" />
            <span className="truncate">{trek.location}</span>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-3 mb-7 text-[0.8rem] text-muted-foreground/60 font-medium">
            <span className="flex items-center gap-1.5">
              <Clock3 className="w-4 h-4 opacity-80" />
              {trek.durationDays} Days
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-accent text-accent opacity-90" />
              <span className="text-muted-foreground/80">{trek.rating}</span> ({trek.reviewCount})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="opacity-60">Next:</span> <span className="text-muted-foreground/80">{trek.nextBatch}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className={cn(trek.seatsLeft <= 5 ? "text-destructive/90 font-semibold" : "")}>
                {trek.seatsLeft} seats left
              </span>
            </span>
          </div>

          <div className="mt-auto pt-5 border-t border-border/40">
            <div className="flex justify-center items-center w-full bg-muted/40 text-foreground/90 px-5 py-3.5 text-[0.9rem] rounded-xl font-bold transition-all duration-300 group-hover:bg-forest group-hover:text-white group-hover:shadow-md">
              View Details
            </div>
          </div>
        </div>
    </Link>
  );
}
