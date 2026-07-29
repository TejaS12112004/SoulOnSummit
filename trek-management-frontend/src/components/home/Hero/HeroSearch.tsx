import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface HeroSearchProps {
  placeholder?: string;
  onSearch: (query: string) => void;
}

export function HeroSearch({ placeholder, onSearch }: HeroSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '580px',
        maxWidth: '90vw',
        background: 'rgba(12, 18, 26, 0.82)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '9999px',
        padding: '6px 6px 6px 22px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        gap: '10px',
      }}
    >
      <Search
        style={{ color: '#F59E0B', width: '18px', height: '18px', flexShrink: 0 }}
        aria-hidden="true"
      />
      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder={placeholder || 'Search treks, destinations, or activities...'}
        className="flex-1 border-none outline-none shadow-none focus-visible:ring-0 bg-transparent px-0 h-[38px]"
        style={{
          color: '#FFFFFF',
          fontSize: '0.92rem',
          fontFamily: 'var(--font-sans-custom)',
          fontWeight: 400,
        }}
        aria-label={placeholder || 'Search destination'}
      />
      <Button
        onClick={handleSearch}
        style={{
          background: '#F59E0B',
          color: '#1C2B3A',
          borderRadius: '9999px',
          height: '46px',
          paddingLeft: '28px',
          paddingRight: '28px',
          fontSize: '0.92rem',
          fontWeight: 700,
          fontFamily: 'var(--font-sans-custom)',
          border: 'none',
          flexShrink: 0,
          cursor: 'pointer',
        }}
      >
        Explore
      </Button>
    </div>
  );
}
