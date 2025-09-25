const publisherLogos = [
  "cryptodaily.png",
  "coinranking.svg",
  "cryptodaily.png",
  "coinranking.svg",
  "cryptodaily.png",
  "coinranking.svg",
  "cryptodaily.png",
  "coinranking.svg",
  "cryptodaily.png",
  "coinranking.svg"
];

export default function LogosBar() {
  return (
    <section className="overflow-hidden bg-white/15 dark:bg-slate-600/25 backdrop-blur-sm border-y border-white/20 dark:border-slate-500/20 shadow-lg shadow-black/5 dark:shadow-black/20">
      <div className="py-6">
        <p className="text-center text-sm text-muted-foreground mb-8">
          Trusted by leading crypto publishers worldwide
        </p>
        
        {/* Single Row Carousel Container - Full Width */}
        <div className="relative overflow-hidden w-full">
          {/* Left fade overlay */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white/15 to-transparent dark:from-slate-600/25 dark:to-transparent z-10 pointer-events-none"></div>
          {/* Right fade overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white/15 to-transparent dark:from-slate-600/25 dark:to-transparent z-10 pointer-events-none"></div>
          <div className="flex animate-scroll-left gap-12 items-center opacity-80 whitespace-nowrap">
            {/* First set */}
            {publisherLogos.map((logo, index) => (
              <div key={`set1-${index}`} className="flex-shrink-0">
                <img 
                  src={`/logos/publishers/${logo}`} 
                  alt="" 
                  className={`w-auto mx-auto object-contain ${logo === 'coinranking.svg' ? 'h-8' : 'h-16'}`}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
            {/* Second set for seamless loop */}
            {publisherLogos.map((logo, index) => (
              <div key={`set2-${index}`} className="flex-shrink-0">
                <img 
                  src={`/logos/publishers/${logo}`} 
                  alt="" 
                  className={`w-auto mx-auto object-contain ${logo === 'coinranking.svg' ? 'h-8' : 'h-16'}`}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
