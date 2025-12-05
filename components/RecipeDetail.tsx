import React, { useRef } from 'react';
import { X, Printer, Clock, Thermometer, Users, ChevronRight } from 'lucide-react';
import { Recipe } from '../types';
import { getAvatarColor } from '../constants';

interface RecipeDetailProps {
  recipe: Recipe;
  onClose: () => void;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const avatarColor = recipe.userColor || getAvatarColor(recipe.addedBy);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-stone-900/60 backdrop-blur-sm print:p-0 print:static print:bg-white print:z-auto">
      <div 
        ref={printRef}
        className="bg-stone-50 w-full max-w-4xl h-full md:h-[90vh] md:rounded-lg shadow-2xl overflow-y-auto relative flex flex-col print:h-auto print:shadow-none print:overflow-visible"
      >
        {/* Sticky Header Actions (Hidden in Print) */}
        <div className="sticky top-0 z-20 flex justify-between items-center p-4 bg-white/80 backdrop-blur-md border-b border-stone-100 print:hidden">
            <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-500">
                <X size={24} />
            </button>
            <div className="flex gap-2">
                <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-stone-800 text-white rounded-md text-sm hover:bg-stone-700 transition-colors">
                    <Printer size={16} /> Print Recipe
                </button>
            </div>
        </div>

        {/* Hero Section */}
        <div className="relative h-64 md:h-80 bg-stone-200 print:h-48 print:grayscale">
            {recipe.imageUrl ? (
                <img src={recipe.imageUrl} className="w-full h-full object-cover" alt={recipe.title} />
            ) : (
                <div 
                    className="w-full h-full opacity-20"
                    style={{
                        backgroundImage: `repeating-linear-gradient(45deg, ${avatarColor} 0, ${avatarColor} 1px, transparent 0, transparent 50%)`,
                        backgroundSize: '20px 20px'
                    }}
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent print:hidden" />
            
            <div className="absolute bottom-0 left-0 p-8 text-white w-full print:relative print:text-black print:p-0 print:mb-8">
                <span className="inline-block px-3 py-1 bg-amber-600 text-xs font-bold tracking-widest uppercase mb-3 rounded-sm print:border print:border-black print:bg-transparent print:text-black">
                    {recipe.category}
                </span>
                <h2 className="font-serif text-4xl md:text-5xl mb-2 shadow-black print:text-black">{recipe.title}</h2>
                <div className="flex items-center gap-2 text-stone-200 font-light print:text-stone-600">
                    <span>Submitted by {recipe.addedBy}</span>
                </div>
            </div>
        </div>

        {/* Content Body */}
        <div className="p-8 md:p-12 max-w-3xl mx-auto w-full">
            
            {/* Metadata Grid */}
            <div className="grid grid-cols-3 gap-4 mb-12 border-y border-stone-200 py-6">
                <div className="flex flex-col items-center justify-center text-center">
                    <Clock className="text-amber-600 mb-2" size={24} />
                    <span className="text-xs text-stone-400 uppercase tracking-widest">Time</span>
                    <span className="font-serif text-lg">{recipe.cookTime || recipe.prepTime || "--"}</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center border-x border-stone-200">
                    <Thermometer className="text-rose-500 mb-2" size={24} />
                    <span className="text-xs text-stone-400 uppercase tracking-widest">Temp</span>
                    <span className="font-serif text-lg">{recipe.temp || "--"}</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                    <Users className="text-sky-700 mb-2" size={24} />
                    <span className="text-xs text-stone-400 uppercase tracking-widest">Yields</span>
                    <span className="font-serif text-lg">{recipe.yields || "--"}</span>
                </div>
            </div>

            {recipe.description && (
                <blockquote className="font-serif text-xl italic text-stone-600 border-l-4 border-amber-600 pl-6 mb-12 bg-stone-50 py-4 print:bg-transparent">
                    "{recipe.description}"
                </blockquote>
            )}

            <div className="grid md:grid-cols-[1fr_1.5fr] gap-12 print:block">
                {/* Ingredients */}
                <div className="print:mb-8">
                    <h3 className="font-serif text-2xl text-stone-800 mb-6 flex items-center gap-3">
                        Ingredients
                        <span className="h-px flex-1 bg-stone-200"></span>
                    </h3>
                    <ul className="space-y-3">
                        {recipe.ingredients.map((ing, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-stone-700 font-sans">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-600 flex-shrink-0" />
                                <span className="leading-relaxed">{ing}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Instructions */}
                <div>
                    <h3 className="font-serif text-2xl text-stone-800 mb-6 flex items-center gap-3">
                        Preparation
                        <span className="h-px flex-1 bg-stone-200"></span>
                    </h3>
                    <div className="space-y-8">
                        {recipe.instructions.map((step, idx) => (
                            <div key={idx} className="group">
                                <h4 className="font-serif text-amber-600 text-lg mb-2 flex items-center gap-2">
                                    Step {idx + 1}
                                </h4>
                                <p className="text-stone-700 leading-relaxed pl-4 border-l-2 border-stone-100 group-hover:border-amber-200 transition-colors">
                                    {step}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Print Footer */}
            <div className="hidden print:block mt-16 pt-8 border-t border-stone-300 text-center">
                <p className="font-serif italic text-stone-500">From Shirley's Kitchen - Established 1974</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;