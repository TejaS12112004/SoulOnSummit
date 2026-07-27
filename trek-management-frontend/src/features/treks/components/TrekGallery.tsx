import { useState } from 'react'
import type { TrekImageViewModel } from '../types/trekDetail'
import { X } from 'lucide-react'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80'

interface TrekGalleryProps {
  images: TrekImageViewModel[]
}

export function TrekGallery({ images }: TrekGalleryProps) {
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)

  if (images.length === 0) return null

  return (
    <section>
      <h2 className="text-2xl font-display font-bold text-white mb-4">Gallery</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.slice(0, 6).map((img) => (
          <button
            key={img.id}
            className="aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer"
            onClick={() => setLightboxUrl(img.imageUrl)}
          >
            <img
              src={img.imageUrl}
              alt={img.caption ?? 'Trek gallery image'}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).src = PLACEHOLDER
              }}
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white"
            onClick={() => setLightboxUrl(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={lightboxUrl}
            alt="Enlarged gallery image"
            className="max-w-full max-h-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  )
}
