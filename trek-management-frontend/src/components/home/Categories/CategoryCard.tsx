import { Link } from 'react-router-dom';
import type { Category } from '@/types/category';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to={category.href}
      className="group relative h-[200px] rounded-2xl overflow-hidden block bg-image-placeholder focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      aria-label={`Explore ${category.name} treks`}
    >
      {/* Decorative background image */}
      <img
        src={category.image}
        alt=""
        aria-hidden="true"
        className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-[1.08]"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-category-overlay" aria-hidden="true" />
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 px-[18px] py-4">
        <div className="text-2xl mb-1" aria-hidden="true">{category.icon}</div>
        <div className="text-white font-bold text-base">{category.name}</div>
        <div className="text-white/65 text-[0.78rem]">{category.count} treks</div>
      </div>
    </Link>
  );
}
