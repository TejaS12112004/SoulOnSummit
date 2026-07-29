import { HeroBackground } from './HeroBackground';
import { HeroContent } from './HeroContent';
import { HeroScrollIndicator } from './HeroScrollIndicator';

export interface CTA {
  label: string;
  href: string;
}

export interface HeroProps {
  label?: string;
  title: string;
  titleHighlight?: string;
  subtitle: string;
  backgroundImage: string;
  imageAlt?: string;
  searchPlaceholder?: string;
  primaryCTA: CTA;
  secondaryCTA?: CTA;
  scrollIndicatorText?: string;
}

export function Hero(props: HeroProps) {
  return (
    <section
      className="relative flex items-center justify-center overflow-hidden w-full"
      style={{ minHeight: '100dvh' }}
      aria-label="Hero"
    >
      <HeroBackground
        imageUrl={props.backgroundImage}
        altText={props.imageAlt}
      />

      <HeroContent {...props} />

      <HeroScrollIndicator text={props.scrollIndicatorText} />
    </section>
  );
}
