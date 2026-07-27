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
    <div className="bg-white rounded-2xl p-2 pl-5 flex items-center gap-3 w-full max-w-[580px] mx-auto shadow-hero">
      <Search className="w-5 h-5 text-muted-foreground shrink-0" aria-hidden="true" />
      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder={placeholder || "Search..."}
        className="flex-1 border-none outline-none shadow-none focus-visible:ring-0 text-[0.95rem] text-white bg-transparent min-w-0 px-0 h-auto"
        aria-label={placeholder || "Search destination"}
      />
      <Button 
        onClick={handleSearch} 
        className="btn-primary rounded-xl px-6 py-3 h-auto shrink-0"
      >
        Explore
      </Button>
    </div>
  );
}
