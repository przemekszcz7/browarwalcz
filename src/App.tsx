import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Phone, MapPin, Mail, ArrowRight, ArrowUpRight } from 'lucide-react';

// Custom Hook for Scroll Reveal
function useIntersectionObserver(options = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        // Desubscribe once triggered to keep status or allow repeated animation
        observer.unobserve(entry.target);
      }
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px",
      ...options
    });

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);

  return [ref, isIntersecting] as const;
}

// Interactive Scroll Reveal Area Wrapper
interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const [ref, isIntersecting] = useIntersectionObserver();

  return (
    <div
      ref={ref}
      className={`transition-all duration-[600ms] cubic-bezier(0.16, 1, 0.3, 1) ${className}`}
      style={{
        opacity: isIntersecting ? 1 : 0,
        transform: isIntersecting ? 'translateY(0)' : 'translateY(16px)',
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Track scroll position to add header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToAnchor = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 88; // Height of sticky navigation bar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F0EEE9] text-[#1A1917] font-sans antialiased selection:bg-[#FF5E00] selection:text-[#F8F6F1]">
      
      {/* 2. STICKY NAVIGATION */}
      <nav 
        id="navbar"
        className="fixed top-0 left-0 w-full z-50 bg-[#1A1917] border-b border-white/8 transition-all duration-300 py-3 md:py-4 px-6 md:px-12"
      >
        <div className="max-w-[1180px] mx-auto flex items-center justify-between">
          {/* Left info brand */}
          <div className="flex flex-col justify-start">
            <a 
              href="#" 
              onClick={(e) => scrollToAnchor('navbar', e)}
              className="group flex items-center hover:opacity-90 transition-opacity"
              id="brand-link"
            >
              <span className="font-condensed font-extrabold text-[#F8F6F1] text-[1.2rem] tracking-[0.08em] uppercase leading-none">
                BROWAR
              </span>
              <span className="font-condensed font-normal text-[#FF5E00] text-[1.2rem] tracking-[0.08em] uppercase ml-1.5 leading-none transition-transform duration-200 group-hover:scale-105 inline-block">
                WAŁCZ
              </span>
            </a>
            <span className="font-sans font-light text-[#9A958E] text-[0.7rem] uppercase tracking-wider mt-0.5">
              ul. Sienkiewicza 3, Wałcz
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-9 font-condensed font-medium text-[0.875rem] text-[#9A958E]">
            <a 
              href="#historia" 
              onClick={(e) => scrollToAnchor('historia', e)}
              className="hover:text-[#F8F6F1] hover:underline hover:decoration-[#FF5E00] hover:decoration-2 hover:underline-offset-4 tracking-wider transition-all duration-200"
              id="nav-link-historia"
            >
              HISTORIA
            </a>
            <span className="text-white/20 select-none">•</span>
            <a 
              href="#przestrzen" 
              onClick={(e) => scrollToAnchor('przestrzen', e)}
              className="hover:text-[#F8F6F1] hover:underline hover:decoration-[#FF5E00] hover:decoration-2 hover:underline-offset-4 tracking-wider transition-all duration-200"
              id="nav-link-przestrzen"
            >
              PRZESTRZEŃ
            </a>
            <span className="text-white/20 select-none">•</span>
            <a 
              href="#dla-kogo" 
              onClick={(e) => scrollToAnchor('dla-kogo', e)}
              className="hover:text-[#F8F6F1] hover:underline hover:decoration-[#FF5E00] hover:decoration-2 hover:underline-offset-4 tracking-wider transition-all duration-200"
              id="nav-link-dla-kogo"
            >
              DLA KOGO
            </a>
            <span className="text-white/20 select-none">•</span>
            <a 
              href="#kontakt" 
              onClick={(e) => scrollToAnchor('kontakt', e)}
              className="hover:text-[#F8F6F1] hover:underline hover:decoration-[#FF5E00] hover:decoration-2 hover:underline-offset-4 tracking-wider transition-all duration-200"
              id="nav-link-kontakt"
            >
              KONTAKT
            </a>
          </div>

          {/* Far Right phone link */}
          <div className="hidden md:block">
            <a 
              href="tel:790200205" 
              className="font-condensed font-extrabold text-[1.1rem] text-[#FF5E00] hover:text-[#F8F6F1] transition-colors duration-200 tracking-wide flex items-center gap-1.5"
              id="nav-phone-link"
            >
              <Phone className="w-3.5 h-3.5 static text-[#FF5E00]" />
              790 200 205
            </a>
          </div>

          {/* Mobile hamburger button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#F8F6F1] hover:text-[#FF5E00] transition-colors focus:outline-none"
            aria-label="Menu"
            id="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* MOBILE NAV OVERLAY */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-[#1A1917] flex flex-col justify-center items-center px-8 transition-all duration-300"
          id="mobile-drawer"
        >
          <div className="flex flex-col space-y-8 text-center animate-fade-in">
            <a 
              href="#historia" 
              onClick={(e) => scrollToAnchor('historia', e)}
              className="font-condensed font-bold text-[2rem] text-[#F8F6F1] hover:text-[#FF5E00] transition-colors tracking-widest"
              id="mobile-link-historia"
            >
              HISTORIA
            </a>
            <a 
              href="#przestrzen" 
              onClick={(e) => scrollToAnchor('przestrzen', e)}
              className="font-condensed font-bold text-[2rem] text-[#F8F6F1] hover:text-[#FF5E00] transition-colors tracking-widest"
              id="mobile-link-przestrzen"
            >
              PRZESTRZEŃ
            </a>
            <a 
              href="#dla-kogo" 
              onClick={(e) => scrollToAnchor('dla-kogo', e)}
              className="font-condensed font-bold text-[2rem] text-[#F8F6F1] hover:text-[#FF5E00] transition-colors tracking-widest"
              id="mobile-link-dlakogo"
            >
              DLA KOGO
            </a>
            <a 
              href="#kontakt" 
              onClick={(e) => scrollToAnchor('kontakt', e)}
              className="font-condensed font-bold text-[2rem] text-[#F8F6F1] hover:text-[#FF5E00] transition-colors tracking-widest"
              id="mobile-link-kontakt"
            >
              KONTAKT
            </a>
            
            <div className="h-px bg-white/10 w-24 mx-auto my-4"></div>

            <a 
              href="tel:790200205" 
              className="font-condensed font-extrabold text-[1.6rem] text-[#FF5E00] hover:text-[#F8F6F1] transition-colors tracking-wide flex items-center justify-center gap-2"
              id="mobile-phone-link"
            >
              <Phone className="w-4 h-4" />
              790 200 205
            </a>

            <span className="font-sans font-light text-[#9A958E] text-[0.8rem] tracking-wider uppercase">
              ul. Sienkiewicza 3, Wałcz
            </span>
          </div>
        </div>
      )}

      {/* 3. HERO SECTION (full viewport height) */}
      <header 
        id="hero"
        className="relative min-h-screen flex items-end overflow-hidden bg-[#1A1917]"
        style={{
          backgroundImage: `url('https://i.ibb.co/rKw8mCX5/681189944-1276868284559877-3485658379447019078-n.jpg')`, /* Correct high fidelity direct raw file link */
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Smeared grease stains (patina) to carry the industrial weight */}
        <div className="grease-smudge w-[500px] h-[350px] top-[15%] -left-[100px] opacity-[0.65]"></div>
        <div className="grease-smudge-streak w-[450px] h-[400px] bottom-[20%] right-[5%] opacity-50"></div>
        <div className="grease-smudge-light w-[600px] h-[400px] top-0 right-0 opacity-45"></div>

        {/* Deep, rough linear-gradient overlays to capture brutalist soot aspect */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-[#1A1917]/55 via-[#1A1917]/80 to-[#1A1917]/97 z-10"
          id="hero-overlay"
        ></div>

        {/* Decorative elements - Only shown on desktop platforms */}
        <div className="hidden lg:block absolute top-[120px] right-12 z-20 select-none">
          <div 
            className="font-sans font-light text-[0.7rem] text-white/10 uppercase tracking-[0.2em] [writing-mode:vertical-rl] transform rotate-180"
            id="vertical-text-hero"
          >
            BROWAR WAŁCZ · PRZYWRACAMY DO ŻYCIA
          </div>
        </div>

        {/* Removed "1900" decorative text watermark as requested */}

        {/* Hero Content Area */}
        <div className="relative w-full z-20 mx-auto max-w-[1180px] px-6 md:px-12 pb-[72px] md:pb-[10vh] pt-[140px] flex flex-col justify-end">
          
          {/* Section label top-left */}
          <div className="mb-4">
            <span 
              className="font-condensed font-semibold text-[#FF5E00] text-[0.72rem] uppercase tracking-[0.2em]"
              id="hero-section-label"
            >
              Wałcz · ul. Sienkiewicza 3
            </span>
          </div>

          {/* Asymmetrical H1 Header Element with Cracked Concrete Text (SVG displacement mapped, line cracks removed) */}
          <div className="flex flex-col mb-7 relative select-none" id="hero-heading-group">
            
            {/* SVG filter for rough, eroded concrete textures (displacement mapping) */}
            <svg className="absolute w-0 h-0" width="0" height="0">
              <defs>
                <filter id="cracked-distortion">
                  <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="7" xChannelSelector="R" yChannelSelector="G" />
                </filter>
              </defs>
            </svg>

            <div className="relative inline-block overflow-visible mb-2 md:mb-0">
              <h1 className="font-hero text-[#F8F6F1] leading-[0.88] tracking-[-0.02em] text-[clamp(3.8rem,11vw,10.5rem)] uppercase relative cracked-concrete-text z-10 transition-all duration-300">
                BROWAR
              </h1>
            </div>

            <div className="relative inline-block overflow-visible ml-[1rem] md:ml-[clamp(2rem,4vw,5rem)]">
              <h1 
                className="font-hero text-[#F8F6F1] leading-[0.88] tracking-[-0.02em] text-[clamp(3.8rem,11vw,10.5rem)] uppercase relative cracked-concrete-text z-10 transition-all duration-300"
                id="hero-subheading-indented"
              >
                WAŁCZ
              </h1>
            </div>
          </div>

          {/* Thick industrial raw line */}
          <div className="w-[80px] h-[3px] bg-[#FF5E00] mb-8" id="hero-orange-bar"></div>

          {/* Tagline */}
          <h2 
            className="font-condensed font-bold text-[#F8F6F1] text-[clamp(1.4rem,3vw,2.2rem)] uppercase tracking-[0.05em] mb-4"
            id="hero-tagline"
          >
            HISTORIA · PRZESTRZEŃ · PRZYSZŁOŚĆ
          </h2>

          {/* Body and link directions */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mt-2">
            <p className="font-sans font-light text-white/50 text-[1rem] leading-[1.76] max-w-[480px]">
              Przywracamy życie miejscu z historią. Tworzymy przestrzeń dla ludzi, przedsiębiorczości i inicjatyw.
            </p>

            <div className="flex flex-wrap gap-x-8 gap-y-3 font-condensed font-semibold text-[0.95rem] tracking-wider uppercase">
              <a 
                href="#przestrzen" 
                onClick={(e) => scrollToAnchor('przestrzen', e)}
                className="text-[#FF5E00] hover:text-[#F8F6F1] flex items-center gap-1.5 transition-colors duration-200"
                id="hero-cta-pillars"
              >
                <span>→ Dla kogo?</span>
              </a>
              <a 
                href="#kontakt" 
                onClick={(e) => scrollToAnchor('kontakt', e)}
                className="text-white/30 hover:text-white/65 flex items-center gap-1.5 transition-colors duration-200"
                id="hero-cta-contact"
              >
                <span>→ Kontakt</span>
              </a>
            </div>
          </div>

        </div>
      </header>


      {/* 4. HISTORIA SECTION */}
      <section 
        id="historia" 
        className="scroll-mt-20 py-[112px] bg-[#F8F6F1] border-b-2 border-[#D8D4CC] transition-colors duration-300 relative overflow-hidden"
      >
        {/* Grease mud/soot textures in the margins */}
        <div className="grease-smudge w-[300px] h-[260px] top-[10%] -left-16 opacity-35"></div>
        <div className="grease-smudge-streak w-[280px] h-[340px] bottom-[15%] -right-12 opacity-30"></div>

        <div className="max-w-[1180px] mx-auto px-6 md:px-12 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">
            {/* Left column - Content (55% / 12 grids) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                {/* Section Header Label */}
                <div className="font-condensed font-semibold text-[0.72rem] tracking-[0.22em] text-[#FF5E00] uppercase mb-4">
                  01 —— HISTORIA
                </div>

                {/* Subtitle H2 */}
                <h2 className="font-condensed font-extrabold text-[#1A1917] text-[clamp(2.2rem,5vw,4.2rem)] tracking-[-0.01em] leading-[0.95] uppercase mb-8">
                  Miejsce z pamięcią.
                </h2>

                {/* Body texts */}
                <div className="font-sans font-normal text-[#5A5651] text-[1rem] leading-[1.76] space-y-6 mb-12">
                  <p>
                    Browar w Wałczu to budynek z historią sięgającą ponad sto lat. Przez dekady był częścią życia miasta — produkcji, pracy, codzienności.
                  </p>
                  <p>
                    Dziś stoi w miejscu, gdzie historia i przyszłość mogą się spotkać. Przywracamy go do życia — nie wymazując przeszłości, ale budując na niej.
                  </p>
                </div>
              </div>

              {/* Three Raw Brutalist Stats Rows */}
              <div className="space-y-0" id="historia-metrics">
                <div className="border-t-2 border-[#D8D4CC] py-5 flex flex-col sm:flex-row justify-between items-baseline gap-2">
                  <span className="font-condensed font-bold text-[#1A1917] text-[1.5rem] tracking-tight">
                    Wałcz
                  </span>
                  <span className="font-sans font-normal text-[#9A958E] text-[0.9rem] sm:text-right">
                    centrum historycznej przestrzeni przemysłowej
                  </span>
                </div>
                
                <div className="border-t-2 border-[#D8D4CC] py-5 flex flex-col sm:flex-row justify-between items-baseline gap-2">
                  <span className="font-condensed font-bold text-[#1A1917] text-[1.5rem] tracking-tight">
                    ul. Sienkiewicza 3
                  </span>
                  <span className="font-sans font-normal text-[#9A958E] text-[0.9rem] sm:text-right">
                    serce projektu rewitalizacji
                  </span>
                </div>

                <div className="border-t-2 border-[#D8D4CC] py-5 flex flex-col sm:flex-row justify-between items-baseline gap-2">
                  <span className="font-condensed font-bold text-[#1A1917] text-[1.5rem] tracking-tight">
                    Przyszłość
                  </span>
                  <span className="font-sans font-normal text-[#9A958E] text-[0.9rem] sm:text-right">
                    planowana przestrzeń dla całej społeczności
                  </span>
                </div>
              </div>
            </div>

            {/* Right column - Concrete dark quote badge block (45% / 12 grids) */}
            <div className="lg:col-span-5 flex items-stretch">
              <div className="w-full bg-[#1A1917] p-10 flex flex-col justify-between border-l-4 border-[#FF5E00] relative overflow-hidden">
                {/* Minor grease smudge behind typography inside quote block */}
                <div className="grease-smudge-streak w-48 h-48 bottom-4 left-4 opacity-15"></div>
                
                <div className="relative z-10">
                  <span className="font-condensed font-bold text-[#FF5E00] text-[0.7rem] uppercase tracking-[0.18em]">
                    BROWAR WAŁCZ WRACA DO ŻYCIA
                  </span>
                  <div className="w-12 h-[2px] bg-[#FF5E00] my-4"></div>
                  
                  <p className="font-condensed font-extrabold text-[#F8F6F1] text-[1.8rem] leading-[1.15] mt-6">
                    "Z historią w korzeniach. Z ludźmi w centrum. Z przyszłością w planach."
                  </p>
                </div>


              </div>
            </div>
          </div>

        </div>
      </section>


      {/* 5. TRZY FILARY (Three Pillars) SECTION */}
      <section 
        id="przestrzen" 
        className="scroll-mt-20 py-[112px] bg-[#1A1917] concrete-grid relative border-b-2 border-white/5 overflow-hidden"
      >
        {/* Grease & soot industrial carbon patina wash behind text sequence */}
        <div className="absolute w-[450px] h-[450px] -top-12 -right-12 bg-radial from-[rgba(15,10,5,0.7)] to-transparent pointer-events-none opacity-80 blur-[80px]"></div>
        <div className="absolute w-[400px] h-[400px] bottom-10 left-[10%] bg-radial from-[rgba(0,0,0,0.9)] to-transparent pointer-events-none opacity-90 blur-[70px]"></div>

        <div className="max-w-[1180px] mx-auto px-6 md:px-12 relative z-10">
          
          <div className="mb-14">
            {/* Section label */}
            <div className="font-condensed font-semibold text-[0.72rem] tracking-[0.22em] text-[#FF5E00] uppercase mb-4" id="pillars-sec-label">
              02 —— DLA KOGO
            </div>

            {/* H2 Title with italic subtitle underneath */}
            <h2 className="font-condensed font-extrabold text-[#F8F6F1] text-[clamp(2.2rem,5vw,4.2rem)] tracking-[-0.01em] leading-none uppercase mb-2">
              Browar Wałcz —
            </h2>
            <p className="font-condensed font-light italic text-[#9A958E] text-[clamp(1.2rem,2.5vw,1.8rem)]">
              dla każdego kto chce tworzyć.
            </p>
          </div>

          <div id="dla-kogo"></div>

          {/* Stacked typographic sequence */}
          <div className="space-y-0 mt-10">
            
            {/* Pillar 1 */}
            <Reveal delay={0}>
              <div 
                className="border-t border-white/8 py-12 flex flex-col md:flex-row items-baseline md:items-center justify-between gap-6"
                id="pillar-row-01"
              >
                <div className="font-condensed font-extrabold text-[#FF5E00] text-[4rem] leading-none min-w-[80px]">
                  01
                </div>
                <div className="font-condensed font-extrabold text-[#F8F6F1] text-[clamp(2.2rem,5.5vw,4.2rem)] leading-[0.95] uppercase tracking-[-0.01em]">
                  DLA LUDZI
                </div>
                <div className="font-sans font-normal text-[#9A958E] text-[1rem] leading-[1.72] max-w-[380px] md:ml-auto">
                  Miejsce spotkań, kultury i wydarzeń. Przestrzeń, gdzie ludzie mogą się spotykać, świętować i tworzyć razem.
                </div>
              </div>
            </Reveal>

            {/* Pillar 2 */}
            <Reveal delay={150}>
              <div 
                className="border-t border-white/8 py-12 flex flex-col md:flex-row items-baseline md:items-center justify-between gap-6"
                id="pillar-row-02"
              >
                <div className="font-condensed font-extrabold text-[#FF5E00] text-[4rem] leading-none min-w-[80px]">
                  02
                </div>
                <div className="font-condensed font-extrabold text-[#F8F6F1] text-[clamp(2.2rem,5.5vw,4.2rem)] leading-[0.95] uppercase tracking-[-0.01em]">
                  DLA PRZEDSIĘBIORCÓW
                </div>
                <div className="font-sans font-normal text-[#9A958E] text-[1rem] leading-[1.72] max-w-[380px] md:ml-auto">
                  Przestrzeń do rozwoju biznesu i współpracy. Biura, warsztaty, miejsca pracy dla tych, którzy chcą działać.
                </div>
              </div>
            </Reveal>

            {/* Pillar 3 */}
            <Reveal delay={300}>
              <div 
                className="border-t border-white/8 py-12 flex flex-col md:flex-row items-baseline md:items-center justify-between gap-6"
                id="pillar-row-03"
              >
                <div className="font-condensed font-extrabold text-[#FF5E00] text-[4rem] leading-none min-w-[80px]">
                  03
                </div>
                <div className="font-condensed font-extrabold text-[#F8F6F1] text-[clamp(2.2rem,5.5vw,4.2rem)] leading-[0.95] uppercase tracking-[-0.01em]">
                  DLA INICJATYW
                </div>
                <div className="font-sans font-normal text-[#9A958E] text-[1rem] leading-[1.72] max-w-[380px] md:ml-auto">
                  Wsparcie pomysłów, pasji i projektów. Dla organizacji, twórców i każdego kto ma coś do powiedzenia.
                </div>
              </div>
            </Reveal>

          </div>

          {/* Bottom pillar statement with thick boundaries */}
          <div className="border-t border-white/8 pt-12 mt-4 text-center" id="pillars-footer-accent">
            <div className="max-w-[700px] mx-auto">
              <h4 className="font-condensed font-bold text-[#F8F6F1] text-[clamp(1.5rem,3vw,2.2rem)] tracking-wide leading-tight">
                Browar Wałcz wraca do życia.
              </h4>
              <p className="font-sans font-light text-[#9A958E] text-[1rem] mt-3">
                — skontaktuj się z nami i bądź częścią tej historii
              </p>
            </div>
          </div>

        </div>
      </section>


      {/* 6. MANIFEST SECTION (Full-width custom signal orange background) */}
      <section 
        id="manifest"
        className="w-full bg-[#FF5E00] py-20 px-6 md:px-[6vw] overflow-hidden relative"
      >
        {/* Subtle dark grease smear along the manifest block */}
        <div className="grease-smudge-streak w-[300px] h-[250px] -bottom-[50px] left-[5%] opacity-20 contrast-[1.3] brightness-50"></div>
        
        <div className="max-w-[860px] mx-auto text-center relative z-10">
          <Reveal>
            <div className="flex flex-col space-y-4" id="manifest-lines">
              <div className="border-b border-black/15 pb-4">
                <span className="font-condensed font-extrabold text-[#1A1917] text-[clamp(1.8rem,4vw,3.2rem)] tracking-tight leading-none uppercase">
                  Z HISTORIĄ W KORZENIACH
                </span>
              </div>
              
              <div className="border-b border-black/15 py-4">
                <span className="font-condensed font-extrabold text-[#1A1917] text-[clamp(1.8rem,4vw,3.2rem)] tracking-tight leading-none uppercase">
                  Z LUDŹMI W CENTRUM
                </span>
              </div>

              <div className="border-b border-black/15 py-4">
                <span className="font-condensed font-extrabold text-[#1A1917] text-[clamp(1.8rem,4vw,3.2rem)] tracking-tight leading-none uppercase">
                  Z PRZYSZŁOŚCIĄ W PLANACH
                </span>
              </div>
            </div>

            <p className="font-sans font-normal text-[#1A1917]/75 text-[1.05rem] leading-relaxed mt-8 max-w-[580px] mx-auto">
              Przywracamy życie miejscu z historią. Tworzymy przestrzeń dla ludzi, przedsiębiorczości i inicjatyw.
            </p>
          </Reveal>
        </div>
      </section>


      {/* 7. CONTACT SECTION */}
      <section 
        id="kontakt" 
        className="scroll-mt-20 py-[112px] bg-[#F0EEE9] border-t-2 border-[#D8D4CC] transition-colors duration-300 relative overflow-hidden"
      >
        {/* Grease stains inside contact details */}
        <div className="grease-smudge w-[250px] h-[300px] top-[15%] -right-12 opacity-30"></div>
        <div className="grease-smudge-streak w-[300px] h-[250px] bottom-[20%] -left-16 opacity-35"></div>

        <div className="max-w-[1180px] mx-auto px-6 md:px-12 relative z-10">
          
          {/* Section label */}
          <div className="font-condensed font-semibold text-[0.72rem] tracking-[0.22em] text-[#FF5E00] uppercase mb-4" id="kontakt-heading-label">
            03 —— KONTAKT
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch" id="kontakt-main-grid">
            
            {/* Left column - details (52% grid equivalent) */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <h2 className="font-condensed font-extrabold text-[#1A1917] text-[clamp(2.2rem,5vw,4.2rem)] tracking-[-0.01em] leading-tight uppercase mb-6">
                  Bądź częścią tego.
                </h2>
                <p className="font-sans font-normal text-[#5A5651] text-[1.05rem] leading-[1.76] mb-10">
                  Masz pytanie, pomysł lub chcesz się zaangażować? Napisz lub zadzwoń. Chętnie opowiemy więcej o tym, co budujemy w Wałczu.
                </p>
              </div>

              {/* Robust Contact Rows */}
              <div className="border-b border-[#D8D4CC] space-y-0" id="contact-rows-container">
                
                {/* Telefon */}
                <div className="border-t border-[#D8D4CC] py-5 flex justify-between items-baseline gap-4 group">
                  <div className="flex flex-col">
                    <span className="font-condensed font-medium text-[0.7rem] uppercase tracking-wider text-[#9A958E]">
                      TELEFON
                    </span>
                    <a 
                      href="tel:790200205" 
                      className="font-condensed font-bold text-[1.4rem] text-[#1A1917] hover:text-[#FF5E00] transition-colors mt-1"
                    >
                      790 200 205
                    </a>
                  </div>
                  <Phone className="w-4 h-4 text-[#9A958E] group-hover:text-[#FF5E00] transition-colors static flex-shrink-0" />
                </div>

                {/* Adres */}
                <div className="border-t border-[#D8D4CC] py-5 flex justify-between items-baseline gap-4 group">
                  <div className="flex flex-col">
                    <span className="font-condensed font-medium text-[0.7rem] uppercase tracking-wider text-[#9A958E]">
                      ADRES
                    </span>
                    <p className="font-sans font-normal text-[#1A1917] text-[1.05rem] mt-1">
                      ul. Henryka Sienkiewicza 3, 78-600 Wałcz
                    </p>
                  </div>
                  <MapPin className="w-4 h-4 text-[#9A958E] static flex-shrink-0" />
                </div>

                {/* Email */}
                <div className="border-t border-[#D8D4CC] py-5 flex justify-between items-baseline gap-4 group">
                  <div className="flex flex-col">
                    <span className="font-condensed font-medium text-[0.7rem] uppercase tracking-wider text-[#9A958E]">
                      E-MAIL
                    </span>
                    <a 
                      href="mailto:architektzmian@op.pl"
                      className="font-sans font-normal text-[#1A1917] hover:text-[#FF5E00] text-[1.05rem] transition-colors mt-1 underline decoration-dotted decoration-[#FF5E00] underline-offset-4"
                    >
                      architektzmian@op.pl
                    </a>
                  </div>
                  <Mail className="w-4 h-4 text-[#9A958E] group-hover:text-[#FF5E00] transition-colors static flex-shrink-0" />
                </div>

                {/* Facebook icon row */}
                <div className="border-t border-[#D8D4CC] py-5 flex justify-between items-baseline gap-4 group">
                  <div className="flex flex-col">
                    <span className="font-condensed font-medium text-[0.7rem] uppercase tracking-wider text-[#9A958E]">
                      FACEBOOK
                    </span>
                    <a 
                      href="https://www.facebook.com/BrowarWalcz/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-condensed font-semibold text-[#FF5E00] hover:text-[#1A1917] text-[1.1rem] tracking-wide transition-colors mt-1 inline-flex items-center gap-1.5"
                    >
                      <i className="fa-brands fa-facebook-f text-sm"></i>
                      <span>Browar Wałcz →</span>
                    </a>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#FF5E00] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 static flex-shrink-0" />
                </div>

              </div>
            </div>

            {/* Right column - Maps Embed (48% grid equivalent) */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div 
                className="w-full h-full min-h-[380px] lg:h-[380px] border-2 border-[#1A1917] bg-[#1A1917]/5 relative shadow-lg"
                id="maps-wrapper"
              >
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2386.16466649221!2d16.461699312721212!3d53.26866918041644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47015da2130a6329%3A0x5e4e4c431448a644!2sSienkiewicza%203%2C%2078-600%20Wa%C5%82cz!5e0!3m2!1spl!2spl!4v1781845614766!5m2!1spl!2spl" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, minHeight: '380px' }} 
                  allowFullScreen={true}
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Browar Wałcz - ul. Sienkiewicza 3"
                  className="w-full h-full select-none"
                ></iframe>
              </div>
            </div>
            
          </div>

        </div>
      </section>


      {/* 8. FOOTER */}
      <footer 
        id="footer"
        className="bg-[#0E0D0B] text-white/50 py-9 border-t-2 border-[#FF5E00]"
      >
        <div className="max-w-[1180px] mx-auto px-6 md:px-12 flex flex-col justify-between">
          
          {/* Top row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left" id="footer-top-row">
            <div className="flex items-center gap-1.5" id="footer-brand">
              <span className="font-condensed font-extrabold text-[#F8F6F1] text-[1.1rem] tracking-[0.08em] uppercase leading-none">
                BROWAR
              </span>
              <span className="font-condensed font-normal text-[#FF5E00] text-[1.1rem] tracking-[0.08em] uppercase leading-none">
                WAŁCZ
              </span>
            </div>
            
            <p className="font-sans font-light text-[#9A958E] text-[0.85rem] tracking-wide italic">
              Historia · Przestrzeń · Przyszłość
            </p>
            
            <span className="font-sans font-light text-white/20 text-[0.8rem]">
              © 2026 ALL RIGHTS RESERVED
            </span>
          </div>

          {/* Thin raw border spacer */}
          <div className="w-full h-px bg-white/5 my-4" id="footer-divider"></div>

          {/* Bottom row */}
          <div className="text-center" id="footer-bottom-row">
            <p className="font-sans font-light text-white/20 text-[0.75rem] tracking-wide leading-relaxed">
              ul. Sienkiewicza 3, 78-600 Wałcz · 790 200 205 · architektzmian@op.pl
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
