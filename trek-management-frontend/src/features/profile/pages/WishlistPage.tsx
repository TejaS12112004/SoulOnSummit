import { TrekCard } from '@/features/treks/components/TrekCard';
import { useWishlist } from '@/hooks/useWishlist';
import { Loader2, HeartCrack } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export function WishlistPage() {
  const { wishlistTreks, isLoadingTreks } = useWishlist();

  if (isLoadingTreks) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
        <Loader2 size={32} className="animate-spin" color="#1F4D3A" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-display font-extrabold text-foreground tracking-tight mb-6">
        My Wishlist
      </h1>
      
      {wishlistTreks.length === 0 ? (
        <div className="bg-card rounded-2xl p-16 flex flex-col items-center text-center border border-border shadow-sm">
          <HeartCrack className="w-16 h-16 text-muted-foreground mb-6" />
          <h2 className="text-xl font-bold text-foreground mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Looks like you haven't saved any treks yet. Explore our upcoming departures and save your favorites here!
          </p>
          <Link 
            to={ROUTES.TREKS}
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-6 py-3 rounded-lg font-semibold"
          >
            Explore Treks
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistTreks.map((trek) => (
            <TrekCard key={trek.id} trek={trek} />
          ))}
        </div>
      )}
    </div>
  );
}
