import { Heart } from 'lucide-react';
import type { GalleryImage as GalleryImageType } from '@/types/gallery';

interface GalleryImageProps {
  image: GalleryImageType;
}

export function GalleryImage({ image }: GalleryImageProps) {
  const content = (
    <>
      <img
        src={image.url}
        alt={image.alt}
        loading="lazy"
        decoding="async"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.5s ease',
          display: 'block',
        }}
        className="group-hover:[transform:scale(1.08)]"
      />
      {/* Hover overlay with heart */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          transition: 'opacity 0.2s ease',
        }}
        className="group-hover:opacity-100"
        aria-hidden="true"
      >
        <Heart style={{ width: '28px', height: '28px', color: '#FFFFFF' }} />
      </div>
    </>
  );

  const sharedStyle: React.CSSProperties = {
    position: 'relative',
    aspectRatio: '1 / 1',
    borderRadius: '16px',
    overflow: 'hidden',
    background: '#1a1a18',
    display: 'block',
  };

  if (image.href) {
    return (
      <a
        href={image.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={image.alt}
        className="group"
        style={sharedStyle}
      >
        {content}
      </a>
    );
  }

  return (
    <div className="group" style={sharedStyle}>
      {content}
    </div>
  );
}
