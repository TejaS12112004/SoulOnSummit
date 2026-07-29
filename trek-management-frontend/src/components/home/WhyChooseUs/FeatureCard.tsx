import type { Feature } from '@/types/feature';

interface FeatureCardProps {
  feature: Feature;
}

export function FeatureCard({ feature }: FeatureCardProps) {
  const Icon = feature.icon;

  return (
    <div
      style={{
        background: '#141410',
        borderRadius: '16px',
        padding: '28px 28px 32px',
        border: '1px solid rgba(240,235,224,0.06)',
        transition: 'border-color 0.2s ease, transform 0.2s ease',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(240,235,224,0.14)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(240,235,224,0.06)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
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
          color: '#F0EBE0',
          fontFamily: 'var(--font-sans-custom)',
          marginBottom: '10px',
          lineHeight: 1.3,
        }}
      >
        {feature.title}
      </h3>

      {/* Description */}
      <p
        style={{
          color: 'rgba(240,235,224,0.45)',
          fontSize: '0.875rem',
          fontFamily: 'var(--font-sans-custom)',
          lineHeight: 1.7,
          margin: 0,
        }}
      >
        {feature.desc}
      </p>
    </div>
  );
}
