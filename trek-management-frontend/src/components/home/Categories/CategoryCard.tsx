import { Link } from 'react-router-dom';
import type { Category } from '@/types/category';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to={category.href}
      aria-label={`Explore ${category.name} treks`}
      style={{
        position: 'relative',
        display: 'block',
        height: '260px',
        borderRadius: '18px',
        overflow: 'hidden',
        textDecoration: 'none',
        background: '#1a1a18',
      }}
    >
      {/* Background image */}
      <img
        src={category.image}
        alt=""
        aria-hidden="true"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.5s ease',
          display: 'block',
        }}
        className="group-hover:[transform:scale(1.08)]"
      />

      {/* Gradient overlay — heavier at bottom */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      {/* Content — bottom left */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 18px 18px',
        }}
      >
        <div style={{ fontSize: '1.4rem', marginBottom: '4px', lineHeight: 1 }} aria-hidden="true">
          {category.icon}
        </div>
        <div style={{
          color: '#FFFFFF',
          fontWeight: 700,
          fontSize: '1.05rem',
          fontFamily: 'var(--font-sans-custom)',
          lineHeight: 1.2,
          marginBottom: '3px',
        }}>
          {category.name}
        </div>
        <div style={{
          color: 'rgba(255,255,255,0.6)',
          fontSize: '0.78rem',
          fontFamily: 'var(--font-sans-custom)',
        }}>
          {category.count} treks
        </div>
      </div>
    </Link>
  );
}
