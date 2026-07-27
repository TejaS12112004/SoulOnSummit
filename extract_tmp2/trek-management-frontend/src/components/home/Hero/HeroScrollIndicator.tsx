interface HeroScrollIndicatorProps {
  text?: string;
}

export function HeroScrollIndicator({ text = "Scroll to explore" }: HeroScrollIndicatorProps) {
  return (
    <div 
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 text-[0.72rem] tracking-[0.15em] uppercase"
      aria-hidden="true"
    >
      <span>{text}</span>
      <div className="w-[1px] h-10 bg-gradient-to-b from-white/50 to-transparent" />
    </div>
  );
}
