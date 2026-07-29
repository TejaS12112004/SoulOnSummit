import type { HeroProps } from '@/components/home/Hero';
import type { HomeFeaturedTrekViewModel, HomeUpcomingDepartureViewModel } from '@/types/home';
import type { Category } from '@/types/category';
import type { Feature } from '@/types/feature';
import type { Testimonial } from '@/types/testimonial';
import {
  Compass, ShieldCheck, Leaf, Backpack, MapPin, MessageCircle
} from 'lucide-react';

export const HERO_DATA: HeroProps = {
  label: "PREMIUM TREKKING EXPERIENCES",
  title: "Every Summit Has a Story.",
  titleHighlight: "Begin Yours.",
  subtitle: "Hand-crafted Himalayan adventures led by certified experts. Safety, soul, and summit — all in one journey.",
  backgroundImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&auto=format",
  scrollIndicatorText: "Scroll to explore",
  primaryCTA: {
    label: "View All Treks",
    href: "/treks"
  },
  secondaryCTA: {
    label: "Watch Video",
    href: "#"
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
    name: "Himalayan Treks",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800",
    icon: "🏔️",
    count: 45,
    href: "/treks?category=himalayan"
  },
  {
    name: "Weekend Treks",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=800",
    icon: "🎒",
    count: 38,
    href: "/treks?category=weekend"
  },
  {
    name: "Backpacking",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=800",
    icon: "🎽",
    count: 22,
    href: "/treks?category=backpacking"
  },
  {
    name: "Camping",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
    icon: "🔥",
    count: 31,
    href: "/treks?category=camping"
  },
  {
    name: "International Trips",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800",
    icon: "✈️",
    count: 15,
    href: "/treks?category=international"
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
    emoji: "🧭",
    title: "Certified Trek Leaders",
    desc: "All our guides hold NIMAS & Wilderness First Responder certifications."
  },
  {
    icon: ShieldCheck,
    emoji: "🛡️",
    title: "Safety First",
    desc: "Comprehensive safety protocols and risk management on every trek."
  },
  {
    icon: Leaf,
    emoji: "🩺",
    title: "Medical Support",
    desc: "Trained medical personnel and first-aid kits on all expeditions."
  },
  {
    icon: Backpack,
    emoji: "🌿",
    title: "Eco Friendly",
    desc: "Leave no trace principles — we love the mountains, so we protect them."
  },
  {
    icon: MapPin,
    emoji: "👥",
    title: "Small Groups",
    desc: "Maximum 12 trekkers per batch for a personal, immersive experience."
  },
  {
    icon: MessageCircle,
    emoji: "💰",
    title: "Best Price",
    desc: "Transparent pricing, no hidden costs. Best price guarantee."
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
    name: "Arjun Sharma",
    location: "Mumbai",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    text: "Absolutely life-changing experience! The guides were incredibly knowledgeable and the entire trip was perfectly organized. Standing at the summit with 360° views of the Himalayas is something I'll cherish forever.",
    trek: "Kedarkantha Summit Trek",
    date: "December 2024"
  },
  {
    id: "2",
    name: "Priya Nair",
    location: "Bengaluru",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    text: "Soul On Summit made my dream trek a reality. The attention to detail, safety protocols, and the warmth of the team made it exceptional. The Valley of Flowers was beyond imagination!",
    trek: "Valley of Flowers",
    date: "July 2024"
  },
  {
    id: "3",
    name: "Rohan Gupta",
    location: "Delhi",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    text: "The best trekking company I've ever used. Professional guides, excellent food, quality tents, and an itinerary that was both challenging and enjoyable. Already booked my next trek!",
    trek: "Hampta Pass Crossing",
    date: "August 2024"
  },
  {
    id: "4",
    name: "Sneha Patel",
    location: "Ahmedabad",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    text: "Perfect first trek! The team at Soul On Summit took great care of us first-timers. The moonlit camping at Triund was magical — stars so close you could almost touch them.",
    trek: "Triund Moonlight Trek",
    date: "October 2024"
  }
];

// 🏔️ Sprint 3: Gallery 🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️🏔️

export const GALLERY_SECTION = {
  label: "@SOULONSUMMIT",
  title: "Life on the Trail",
  description: "Follow our adventures on Instagram",
};

export const GALLERY_IMAGES = [
  { id: "1", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=600", alt: "Mountain panorama view" },
  { id: "2", url: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=600", alt: "Trekker on mountain trail" },
  { id: "3", url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=600", alt: "Backpacker by alpine lake" },
  { id: "4", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600", alt: "Dramatic mountain sunset" },
  { id: "5", url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=600", alt: "Snow capped peaks" },
  { id: "6", url: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?auto=format&fit=crop&q=80&w=600", alt: "Misty forest mountain trail" },
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
