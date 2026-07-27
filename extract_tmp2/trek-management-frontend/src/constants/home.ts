import type { HeroProps } from '@/components/home/Hero';
import type { HomeFeaturedTrekViewModel, HomeUpcomingDepartureViewModel } from '@/types/home';
import type { Category } from '@/types/category';
import type { Feature } from '@/types/feature';
import type { Testimonial } from '@/types/testimonial';
import {
  Compass, ShieldCheck, Leaf, Backpack, MapPin, MessageCircle
} from 'lucide-react';

export const HERO_DATA: HeroProps = {
  label: "✨ Premium Trekking Experiences ✨",
  title: "Every Summit Has a Story.",
  titleHighlight: "Begin Yours.",
  subtitle: "Hand-crafted Himalayan adventures led by certified experts. Safety, soul, and summit — all in one journey.",
  backgroundImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&auto=format",
  scrollIndicatorText: "Scroll to explore",
  primaryCTA: {
    label: "Explore Treks",
    href: "/treks"
  }
};

export const FEATURED_TREKS_SECTION = {
  label: "Featured Expeditions",
  title: "Treks That Will Change You",
  description: "Each trek is carefully curated for the perfect balance of challenge, beauty, and personal growth.",
  viewAllLink: "/treks",
  viewAllText: "View All 150+ Treks ➔"
};

export const FEATURED_TREKS: HomeFeaturedTrekViewModel[] = [
  {
    id: "1",
    title: "Kashmir Great Lakes",
    subtitle: "",
    coverImageUrl: "https://images.unsplash.com/photo-1590595906931-81f04f0ccebb?auto=format&fit=crop&q=80&w=800",
    difficulty: "MODERATE",
    maxAltitude: 4191,
    location: "Kashmir, India",
    state: "Jammu and Kashmir",
    durationDays: 7,
    rating: 4.9,
    reviewCount: 128,
    nextBatch: "15 Aug 2026",
    seatsLeft: 4,
    originalPrice: 22000,
    price: 18500,
    featured: true
  },
  {
    id: "2",
    title: "Everest Base Camp",
    subtitle: "",
    coverImageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800",
    difficulty: "DIFFICULT",
    maxAltitude: 5364,
    location: "Nepal",
    state: "Province No. 1",
    durationDays: 14,
    rating: 4.9,
    reviewCount: 320,
    nextBatch: "12 Oct 2026",
    seatsLeft: 12,
    originalPrice: 75000,
    price: 65000,
    featured: true
  },
  {
    id: "3",
    title: "Valley of Flowers",
    subtitle: "",
    coverImageUrl: "https://images.unsplash.com/photo-1626621334693-01825cba4837?auto=format&fit=crop&q=80&w=800",
    difficulty: "EASY",
    maxAltitude: 3658,
    location: "Uttarakhand, India",
    state: "Uttarakhand",
    durationDays: 6,
    rating: 4.7,
    reviewCount: 89,
    nextBatch: "10 Jul 2026",
    seatsLeft: 2,
    originalPrice: 15000,
    price: 12500,
    featured: true
  }
];

// 🏔️ Sprint 1: Categories 🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️

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
    icon: "🏞️",
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
    icon: "🛕",
    count: 9,
    href: "/treks?category=pilgrimage"
  },
  {
    name: "Wildlife",
    image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&q=80&w=800",
    icon: "🦅",
    count: 7,
    href: "/treks?category=wildlife"
  }
];

// 🏔️ Sprint 1: Why Choose Us 🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️

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

// 🏔️ Sprint 2: Upcoming Departures 🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️

export const UPCOMING_DEPARTURES_SECTION = {
  label: "Limited Seats Available",
  title: "Upcoming Departures",
};

export const UPCOMING_DEPARTURES: HomeUpcomingDepartureViewModel[] = [
  {
    departureId: "1",
    trekTitle: "Kashmir Great Lakes",
    trekId: "kashmir-great-lakes",
    departureDate: "15 Aug 2026",
    difficulty: "MODERATE",
    availableSeats: 4,
    price: 18500
  },
  {
    departureId: "2",
    trekTitle: "Everest Base Camp",
    trekId: "everest-base-camp",
    departureDate: "12 Oct 2026",
    difficulty: "DIFFICULT",
    availableSeats: 8,
    price: 65000
  },
  {
    departureId: "3",
    trekTitle: "Valley of Flowers",
    trekId: "valley-of-flowers",
    departureDate: "10 Jul 2026",
    difficulty: "EASY",
    availableSeats: 2,
    price: 12500
  },
  {
    departureId: "4",
    trekTitle: "Roopkund Trek",
    trekId: "roopkund",
    departureDate: "5 Sep 2026",
    difficulty: "DIFFICULT",
    availableSeats: 6,
    price: 16000
  },
  {
    departureId: "5",
    trekTitle: "Hampta Pass",
    trekId: "hampta-pass",
    departureDate: "22 Aug 2026",
    difficulty: "MODERATE",
    availableSeats: 10,
    price: 14500
  }
];

// 🏔️ Sprint 2: Testimonials 🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️

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

// 🏔️ Sprint 3: Gallery 🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️

export const GALLERY_SECTION = {
  label: "Visual Journey",
  title: "Moments Captured",
  description: "A glimpse into the stunning landscapes and experiences that await you.",
};

export const GALLERY_IMAGES = [
  { id: "1", url: "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&q=80&w=800", alt: "Gallery Image 1" },
  { id: "2", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800", alt: "Gallery Image 2" },
  { id: "3", url: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&q=80&w=800", alt: "Gallery Image 3" },
  { id: "4", url: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=800", alt: "Gallery Image 4" },
  { id: "5", url: "https://images.unsplash.com/photo-1611843467160-25afb8df1074?auto=format&fit=crop&q=80&w=800", alt: "Gallery Image 5" },
  { id: "6", url: "https://images.unsplash.com/photo-1491555103944-7c647fd857e6?auto=format&fit=crop&q=80&w=800", alt: "Gallery Image 6" },
];

// 🏔️ Sprint 3: Newsletter 🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️

export const NEWSLETTER_SECTION = {
  label: "Stay Updated",
  title: "Join Our Community",
  description: "Subscribe to our newsletter for early access to new routes, exclusive offers, and trekking tips.",
  finePrint: "We respect your inbox. No spam, ever.",
  successMessage: "Thanks for subscribing! Check your email soon.",
  placeholder: "Your email address",
  submitLabel: "Subscribe",
};
