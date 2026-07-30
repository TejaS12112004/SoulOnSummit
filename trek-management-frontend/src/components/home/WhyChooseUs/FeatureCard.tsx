import type { Feature } from '@/types/feature';

interface FeatureCardProps {
  feature: Feature;
}

export function FeatureCard({ feature }: FeatureCardProps) {
  const Icon = feature.icon;

  return (
    <div
      className="bg-card rounded-[16px] p-7 pb-8 border border-border transition-all duration-200 cursor-default hover:border-primary/50 hover:-translate-y-1 shadow-sm hover:shadow-md"
    >
      {/* Icon in dark forest-green rounded square */}
      <div
        style={{
          width: '52px',
          height: '52px',
          background: '#1F4D3A',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          fontSize: '1.5rem',
        }}
        aria-hidden="true"
      >
        {feature.emoji ? (
          <span>{feature.emoji}</span>
        ) : (
          <Icon style={{ width: '26px', height: '26px', color: '#6EE7B7' }} strokeWidth={1.75} />
        )}
      </div>

      {/* Title */}
      <h3
        style={{
          fontWeight: 700,
          fontSize: '1rem',
          fontFamily: 'var(--font-sans-custom)',
          marginBottom: '10px',
          lineHeight: 1.3,
        }}
        className="text-foreground"
      >
        {feature.title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: '0.875rem',
          fontFamily: 'var(--font-sans-custom)',
          lineHeight: 1.7,
          margin: 0,
        }}
        className="text-muted-foreground"
      >
        {feature.desc}
      </p>
    </div>
  );
}
