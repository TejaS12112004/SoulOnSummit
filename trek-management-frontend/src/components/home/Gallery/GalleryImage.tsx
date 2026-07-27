import { Heart } from 'lucide-react';
import type { GalleryImage as GalleryImageType } from '@/types/gallery';

interface GalleryImageProps {
  image: GalleryImageType;
}

export function GalleryImage({ image }: GalleryImageProps) {
  const content = (
    <>
      <img
        src={`https://images.unsplash.com/${image.id}?w=400&h=400&fit=crop&auto=format`}
        alt={image.alt}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
      />
      {/* Hover overlay — opacity-0 by default, visible on group-hover */}
      <div
        className="absolute inset-0 bg-forest-dark/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out"
        aria-hidden="true"
      >
        <Heart className="w-8 h-8 text-white" />
      </div>
    </>
  );

  // If href is provided, wrap in an anchor for Instagram deep-link integration.
  // Otherwise render a plain div — no cursor-pointer on a non-interactive element.
  if (image.href) {
    return (
      <a
        href={image.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={image.alt}
        className="group aspect-square rounded-2xl overflow-hidden bg-image-placeholder relative block"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="group aspect-square rounded-2xl overflow-hidden bg-image-placeholder relative">
      {content}
    </div>
  );
}
