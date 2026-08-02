interface HeroBackgroundProps {
  imageUrl: string;
  altText?: string;
}

export function HeroBackground(_props: HeroBackgroundProps) {
  return (
    <>
      <video
        src="/hero-video.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Primary overlay — darkens evenly, slight cool tint like the reference */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(10,18,28,0.52) 0%, rgba(10,18,28,0.62) 55%, rgba(8,14,22,0.82) 100%)' }}
        aria-hidden="true"
      />
      {/* Subtle vignette — keeps center brighter so mountains stay visible */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 120% 80% at 50% 40%, transparent 30%, rgba(5,10,18,0.38) 100%)' }}
        aria-hidden="true"
      />
    </>
  );
}
