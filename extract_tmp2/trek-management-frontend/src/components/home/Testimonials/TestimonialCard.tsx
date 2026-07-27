import { Star } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { Testimonial } from '@/types/testimonial';

interface TestimonialCardProps {
  testimonial: Testimonial;
  isActive: boolean;
}

export function TestimonialCard({ testimonial, isActive }: TestimonialCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-7 border transition-colors duration-200 ease-out",
        isActive
          ? "bg-forest border-transparent"
          : "bg-beige border-beige-dark"
      )}
    >
      {/* Star rating */}
      <div className="flex gap-0.5 mb-4" aria-label={`${testimonial.rating} out of 5 stars`}>
        {Array.from({ length: testimonial.rating }).map((_, idx) => (
          <Star key={idx} className="w-4 h-4 fill-accent text-accent" aria-hidden="true" />
        ))}
      </div>

      {/* Review text */}
      <p className={cn(
        "text-[0.9rem] leading-[1.75] italic mb-5",
        isActive ? "text-white/85" : "text-white-muted"
      )}>
        &ldquo;{testimonial.text}&rdquo;
      </p>

      {/* Avatar + author */}
      <div className="flex items-center gap-3">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          loading="lazy"
          decoding="async"
          className="w-11 h-11 rounded-full object-cover border-2 border-accent shrink-0"
        />
        <div>
          <div className={cn("font-bold text-[0.9rem]", isActive ? "text-white" : "text-white")}>
            {testimonial.name}
          </div>
          <div className={cn("text-[0.78rem]", isActive ? "text-white/55" : "text-muted")}>
            {testimonial.location} · {testimonial.date}
          </div>
        </div>
      </div>

      {/* Trek label */}
      <div className={cn(
        "mt-3.5 pt-3.5 border-t text-[0.75rem]",
        isActive ? "border-white/12 text-white/45" : "border-beige-dark text-gray-400"
      )}>
        Trekked: {testimonial.trek}
      </div>
    </div>
  );
}
