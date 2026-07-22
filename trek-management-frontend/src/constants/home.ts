import type { HeroProps } from '@/components/home/Hero';
import type { Trek } from '@/types/trek';
import type { Category } from '@/types/category';
import type { Feature } from '@/types/feature';
import type { Departure } from '@/types/departure';
import type { Testimonial } from '@/types/testimonial';
import {
  Compass, ShieldCheck, Leaf, Backpack, MapPin, MessageCircle
} from 'lucide-react';

export const HERO_DATA: HeroProps = {
  label: "✦ Premium Trekking Experiences ✦",
  title: "Every Summit Has a Story.",
  titleHighlight: "Begin Yours.",
  subtitle: "Hand-crafted Himalayan adventures led by certified experts. Safety, soul, and summit — all in one journey.",
  backgroundImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&auto=format",
  imageAlt: "Himalayan mountain peaks at sunrise",
  searchPlaceholder: "Search treks, destinations, or activities...",
  primaryCTA: {
    label: "🏔️ View All Treks",
    href: "/treks"
  },
  secondaryCTA: {
    label: "▶ Watch Video",
    href: "#"
  },
  scrollIndicatorText: "Scroll to explore"
};

export const FEATURED_TREKS_SECTION = {
  label: "Featured Expeditions",
  title: "Treks That Will Change You",
  description: "Each trek is carefully curated for the perfect balance of challenge, beauty, and personal growth.",
  viewAllLink: "/treks",
  viewAllText: "View All 150+ Treks →"
};

export const FEATURED_TREKS: Trek[] = [
  {
    id: "1",
    name: "Kashmir Great Lakes",
    image: "https://images.unsplash.com/photo-1590595906931-81f04f0ccebb?auto=format&fit=crop&q=80&w=800",
    difficulty: "Moderate",
    maxAltitude: "4,191m",
    location: "Kashmir, India",
    duration: "7 Days",
    rating: 4.9,
    reviewCount: 128,
    nextBatch: "15 Aug 2026",
    seatsLeft: 4,
    originalPrice: 22000,
    price: 18500
  },
  {
    id: "2",
    name: "Everest Base Camp",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800",
    difficulty: "Hard",
    maxAltitude: "5,364m",
    location: "Nepal",
    duration: "14 Days",
    rating: 4.9,
    reviewCount: 320,
    nextBatch: "12 Oct 2026",
    seatsLeft: 12,
    originalPrice: 75000,
    price: 65000
  },
  {
    id: "3",
    name: "Valley of Flowers",
    image: "https://images.unsplash.com/photo-1626621334693-01825cba4837?auto=format&fit=crop&q=80&w=800",
    difficulty: "Easy",
    maxAltitude: "3,658m",
    location: "Uttarakhand, India",
    duration: "6 Days",
    rating: 4.7,
    reviewCount: 89,
    nextBatch: "10 Jul 2026",
    seatsLeft: 2,
    originalPrice: 15000,
    price: 12500
  }
];
// ── Sprint 1: Categories ────────────────────────────────

export const CATEGORIES_SECTION = {
  label: "Explore by Type",
  title: "Popular Categories",
};

export const CATEGORIES: Category[] = [
  {
    name: "High Altitude",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=800",
    icon: "🏔️",
    count: 34,
    href: "/treks?category=high-altitude"
  },
  {
    name: "Winter Treks",
    image: "https://images.unsplash.com/photo-1491555103944-7c647fd857e6?auto=format&fit=crop&q=80&w=800",
    icon: "❄️",
    count: 18,
    href: "/treks?category=winter"
  },
  {
    name: "Valley Walks",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
    icon: "🌿",
    count: 22,
    href: "/treks?category=valley"
  },
  {
    name: "Glacier Trek",
    image: "https://images.unsplash.com/photo-1611843467160-25afb8df1074?auto=format&fit=crop&q=80&w=800",
    icon: "🧊",
    count: 11,
    href: "/treks?category=glacier"
  },
  {
    name: "Pilgrimage",
    image: "https://images.unsplash.com/photo-1604608672516-5fb6e48d8a28?auto=format&fit=crop&q=80&w=800",
    icon: "🙏",
    count: 9,
    href: "/treks?category=pilgrimage"
  },
  {
    name: "Wildlife",
    image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&q=80&w=800",
    icon: "🦁",
    count: 7,
    href: "/treks?category=wildlife"
  }
];

// ── Sprint 1: Why Choose Us ─────────────────────────────

export const WHY_CHOOSE_US_SECTION = {
  label: "The Soul On Summit Difference",
  title: "Why Thousands Trust Us",
};

export const WHY_CHOOSE_US_FEATURES: Feature[] = [
  {
    icon: Compass,
    title: "Expert-Led Expeditions",
    desc: "Every trek is led by certified Himalayan guides with 10+ years of high-altitude experience and wilderness first-aid training."
  },
  {
    icon: ShieldCheck,
    title: "Safety First, Always",
    desc: "We carry satellite communicators, emergency oxygen, and a dedicated rescue protocol on every expedition above 4,000m."
  },
  {
    icon: Leaf,
    title: "Leave No Trace",
    desc: "Our treks follow strict LNT principles. We pack out all waste and actively restore trails in partnership with local communities."
  },
  {
    icon: Backpack,
    title: "All-Inclusive Packages",
    desc: "Permits, accommodation, meals, transport, and equipment are bundled so you can focus entirely on the experience."
  },
  {
    icon: MapPin,
    title: "Small Group Sizes",
    desc: "We cap groups at 12 trekkers to preserve trail quality, enable personalised attention, and minimise ecological impact."
  },
  {
    icon: MessageCircle,
    title: "24/7 Support",
    desc: "From booking to summit, our operations team is always reachable. You're never alone on the mountain."
  }
];

// ── Sprint 2: Upcoming Departures ───────────────────────

export const UPCOMING_DEPARTURES_SECTION = {
  label: "Limited Seats Available",
  title: "Upcoming Departures",
};

export const UPCOMING_DEPARTURES: Departure[] = [
  {
    id: "1",
    trek: "Kashmir Great Lakes",
    trekSlug: "kashmir-great-lakes",
    date: "15 Aug 2026",
    difficulty: "Moderate",
    seatsLeft: 4,
    price: 18500
  },
  {
    id: "2",
    trek: "Everest Base Camp",
    trekSlug: "everest-base-camp",
    date: "12 Oct 2026",
    difficulty: "Hard",
    seatsLeft: 8,
    price: 65000
  },
  {
    id: "3",
    trek: "Valley of Flowers",
    trekSlug: "valley-of-flowers",
    date: "10 Jul 2026",
    difficulty: "Easy",
    seatsLeft: 2,
    price: 12500
  },
  {
    id: "4",
    trek: "Roopkund Trek",
    trekSlug: "roopkund",
    date: "5 Sep 2026",
    difficulty: "Hard",
    seatsLeft: 6,
    price: 16000
  },
  {
    id: "5",
    trek: "Hampta Pass",
    trekSlug: "hampta-pass",
    date: "22 Aug 2026",
    difficulty: "Moderate",
    seatsLeft: 10,
    price: 14500
  }
];

// ── Sprint 2: Testimonials ───────────────────────────────

export const TESTIMONIALS_SECTION = {
  label: "Real Stories",
  title: "Voices from the Mountains",
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Priya Sharma",
    location: "Mumbai",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    text: "The Kashmir Great Lakes trek was life-changing. The guides were professional, the camping spots were stunning, and the safety protocols gave me complete confidence.",
    trek: "Kashmir Great Lakes",
    date: "June 2026"
  },
  {
    id: "2",
    name: "Rahul Mehta",
    location: "Bangalore",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    text: "Reaching Everest Base Camp with Soul On Summit was the highlight of my decade. Immaculate organisation and the team's passion for the mountains is truly infectious.",
    trek: "Everest Base Camp",
    date: "October 2025"
  },
  {
    id: "3",
    name: "Ananya Iyer",
    location: "Chennai",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    text: "Valley of Flowers was a dream I had for years. Soul On Summit made it completely accessible, even for a first-time trekker like me. Highly recommended.",
    trek: "Valley of Flowers",
    date: "July 2026"
  },
  {
    id: "4",
    name: "Vikram Nair",
    location: "Delhi",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    text: "The small group size made all the difference. I felt like a guest, not a customer. The Roopkund circuit was breathtaking and every meal was surprisingly excellent.",
    trek: "Roopkund Trek",
    date: "September 2025"
  }
];
