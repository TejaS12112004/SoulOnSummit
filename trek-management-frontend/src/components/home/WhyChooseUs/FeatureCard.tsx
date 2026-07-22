import type { Feature } from '@/types/feature';

interface FeatureCardProps {
  feature: Feature;
}

export function FeatureCard({ feature }: FeatureCardProps) {
  const Icon = feature.icon;

  return (
    <div className="bg-white rounded-card p-7 border border-beige-dark transition-all duration-300 hover:shadow-forest hover:border-forest-light hover:-translate-y-1">
      {/* Icon container — tinted green gradient matches Figma exactly */}
      <div
        className="w-[52px] h-[52px] bg-gradient-forest-tint rounded-[14px] flex items-center justify-center mb-[18px]"
        aria-hidden="true"
      >
        <Icon className="w-6 h-6 text-forest" strokeWidth={1.75} />
      </div>
      <h3 className="font-bold text-base text-slate mb-2.5">
        {feature.title}
      </h3>
      <p className="text-muted text-[0.88rem] leading-[1.7]">
        {feature.desc}
      </p>
    </div>
  );
}
