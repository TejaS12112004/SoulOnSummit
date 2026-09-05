export function TrekHero() {
  return (
    <div 
      className="relative w-full overflow-hidden" 
      style={{ paddingTop: 'clamp(100px, 18vw, 160px)', paddingBottom: 'clamp(48px, 8vw, 96px)', minHeight: 'clamp(360px, 60vw, 500px)' }}
    >
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 w-full h-full object-cover"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 z-1 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      <div className="absolute inset-0 z-1 bg-black/30" />

      {/* Content */}
      <div 
        className="relative z-10 w-full flex flex-col items-start text-left max-w-[1300px] mx-auto px-4 md:px-12" 
      >
        
        {/* Breadcrumb */}
        <div className="text-[13px] md:text-[14px] text-gray-300 font-semibold tracking-wide mb-5 md:mb-6">
          Home <span className="mx-2 opacity-50">/</span> All Treks
        </div>
        
        {/* Title */}
        <h1 
          className="font-display font-bold text-white leading-[1.1] tracking-tight mb-4 md:mb-5"
          style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', maxWidth: '800px', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
        >
          Discover Your Next Adventure
        </h1>
        
        {/* Subtitle */}
        <p
          className="text-gray-200 font-medium mb-8 md:mb-10"
          style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.25rem)', maxWidth: '600px', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
        >
          8 treks across India's most breathtaking landscapes, carefully curated for every explorer.
        </p>

        {/* CTA Button */}
        <button 
          onClick={() => {
            document.getElementById('trek-grid-section')?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="bg-[#F59E0B] text-[#1C2B3A] font-bold rounded-[12px] hover:bg-[#D97706] hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_24px_rgba(245,158,11,0.3)]"
          style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)', padding: 'clamp(12px, 2vw, 16px) clamp(20px, 4vw, 32px)' }}
        >
          Explore Treks Below
        </button>
      </div>
    </div>
  )
}
