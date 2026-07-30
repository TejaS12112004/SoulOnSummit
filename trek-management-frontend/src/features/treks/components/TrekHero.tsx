export function TrekHero() {
  return (
    <div 
      className="relative w-full overflow-hidden" 
      style={{ paddingTop: '160px', paddingBottom: '96px', minHeight: '500px' }}
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
        className="relative z-10 w-full flex flex-col items-start text-left" 
        style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 48px' }}
      >
        
        {/* Breadcrumb */}
        <div className="text-[14px] text-gray-300 font-semibold tracking-wide" style={{ marginBottom: '24px' }}>
          Home <span className="mx-2 opacity-50">/</span> All Treks
        </div>
        
        {/* Title */}
        <h1 
          className="text-[48px] md:text-[64px] font-display font-bold text-white leading-[1.1] tracking-tight" 
          style={{ marginBottom: '20px', maxWidth: '800px', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
        >
          Discover Your Next Adventure
        </h1>
        
        {/* Subtitle */}
        <p className="text-[18px] md:text-[20px] text-gray-200 font-medium" style={{ marginBottom: '40px', maxWidth: '600px', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
          8 treks across India's most breathtaking landscapes, carefully curated for every explorer.
        </p>

        {/* CTA Button */}
        <button 
          onClick={() => {
            document.getElementById('trek-grid-section')?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="bg-[#F59E0B] text-[#1C2B3A] font-bold text-[16px] rounded-[12px] hover:bg-[#D97706] hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_24px_rgba(245,158,11,0.3)]"
          style={{ padding: '16px 32px' }}
        >
          Explore Treks Below
        </button>
      </div>
    </div>
  )
}
