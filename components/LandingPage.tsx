import React from 'react';
import { ArrowRight } from 'lucide-react';
import { TARTAN_PATTERN_STYLE } from '../constants';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Background with CSS Tartan */}
      <div 
        className="absolute inset-0 z-0"
        style={TARTAN_PATTERN_STYLE}
      />
      
      {/* Overlay Vignette for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent z-10" />
      <div className="absolute inset-0 bg-black/10 z-10" />

      {/* Content Card */}
      <div className="relative z-20 max-w-2xl mx-4 text-center">
        <div className="bg-stone-50/95 backdrop-blur-sm p-12 rounded-lg shadow-2xl border-4 border-double border-stone-300">
            {/* Crest */}
            <div className="w-40 h-40 mx-auto mb-8 relative">
                <div className="absolute inset-0 bg-heritage-red rounded-full opacity-5 blur-xl"></div>
                {/* Authentic MacIntosh Clan Crest */}
                <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Clan_member_crest_badge_-_Clan_Mackintosh.svg/480px-Clan_member_crest_badge_-_Clan_Mackintosh.svg.png"
                    alt="Touch Not The Cat Bot A Glove - MacIntosh Family Crest" 
                    className="w-full h-full object-contain drop-shadow-lg opacity-90 hover:opacity-100 transition-opacity duration-700"
                />
            </div>

            <h1 className="font-serif text-5xl md:text-6xl text-stone-900 mb-6 tracking-tight">
                Shirley's Kitchen
            </h1>

            <div className="space-y-4 mb-10 font-serif text-stone-600 italic text-lg leading-relaxed">
                <p>
                    "For my family — the loud ones, the quiet ones, and the ones always asking for seconds."
                </p>
                <p className="text-sm text-stone-400 not-italic font-sans uppercase tracking-widest mt-4">
                    Est. 1974
                </p>
            </div>

            <button 
                onClick={onEnter}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-stone-900 text-stone-50 font-sans tracking-wide uppercase text-sm hover:bg-rose-900 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl rounded-sm"
            >
                Enter Kitchen
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;