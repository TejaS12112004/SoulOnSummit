import type { Feature } from '@/types/feature';

interface FeatureCardProps {
  feature: Feature;
}

export function FeatureCard({ feature }: FeatureCardProps) {
  const Icon = feature.icon;

  return (
    <div className="bg-card rounded-2xl p-6 border border-border transition-all duration-200 ease-out hover:shadow-hover hover:border-primary/50 hover:-translate-y-1">
      {/* Icon container — tinted green gradient matches Figma exactly */}
      <div
        className="w-14 h-14 bg-gradient-forest-tint rounded-xl flex items-center justify-center mb-5"
        aria-hidden="true"
      >
        <Icon className="w-8 h-8 text-primary" strokeWidth={1.75} />
      </div>
      <h3 className="font-bold text-base text-card-foreground mb-2">
        {feature.title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {feature.desc}
      </p>
    </div>
  );
}
