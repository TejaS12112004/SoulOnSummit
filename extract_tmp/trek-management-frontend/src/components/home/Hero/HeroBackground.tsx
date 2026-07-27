interface HeroBackgroundProps {
  imageUrl: string;
  altText?: string;
}

export function HeroBackground({ imageUrl, altText = "Hero background" }: HeroBackgroundProps) {
  return (
    <>
      <img
        src={imageUrl}
        alt={altText}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div 
        className="absolute inset-0 bg-hero-overlay"
        aria-hidden="true"
      />
    </>
  );
}
