import React from 'react';
import { Clock, Users, Heart } from 'lucide-react';
import { Recipe } from '../types';
import { getAvatarColor } from '../constants';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClick: (recipe: Recipe) => void;
  viewMode?: 'grid' | 'list';
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, isFavorite, onToggleFavorite, onClick, viewMode = 'grid' }) => {
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (recipe.id) onToggleFavorite(recipe.id);
  };

  const avatarColor = recipe.userColor || getAvatarColor(recipe.addedBy);

  if (viewMode === 'list') {
    return (
        <div 
            onClick={() => onClick(recipe)}
            className="group relative flex items-center bg-white p-4 rounded-lg shadow-sm border border-stone-200 hover:shadow-md transition-all cursor-pointer"
        >
             <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-serif font-bold text-lg shadow-sm mr-4"
                style={{ backgroundColor: avatarColor }}
            >
                {recipe.addedBy.charAt(0)}
            </div>
            <div className="flex-1">
                <h3 className="font-serif text-xl text-stone-800">{recipe.title}</h3>
                <p className="text-sm text-stone-500 uppercase tracking-wide">{recipe.category}</p>
            </div>
            <div className="flex items-center gap-6 mr-6 text-stone-500 text-sm">
                {recipe.prepTime && <span className="flex items-center gap-1"><Clock size={14} /> {recipe.prepTime}</span>}
                {recipe.yields && <span className="flex items-center gap-1"><Users size={14} /> {recipe.yields}</span>}
            </div>
             <button 
                onClick={handleFavoriteClick}
                className={`p-2 rounded-full transition-colors ${isFavorite ? 'text-rose-500 bg-rose-50' : 'text-stone-300 hover:text-rose-400'}`}
            >
                <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>
        </div>
    )
  }

  return (
    <div 
      onClick={() => onClick(recipe)}
      className="group relative bg-white rounded-xl shadow-card hover:shadow-lift transition-all duration-300 cursor-pointer overflow-hidden border border-stone-100 flex flex-col h-full"
    >
      {/* Header Image Area (Pattern or Actual Image) */}
      <div className="h-48 bg-stone-200 relative overflow-hidden">
        {recipe.imageUrl ? (
             <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
            <div className="w-full h-full opacity-10 bg-[radial-gradient(circle_at_1px_1px,#444_1px,transparent_0)] [background-size:20px_20px]" />
        )}
        
        {/* Author Badge */}
        <div className="absolute bottom-[-16px] right-6">
             <div 
                className="w-12 h-12 rounded-full border-4 border-white flex items-center justify-center text-white font-serif font-bold text-lg shadow-sm"
                style={{ backgroundColor: avatarColor }}
                title={`Added by ${recipe.addedBy}`}
            >
                {recipe.addedBy.charAt(0)}
            </div>
        </div>

        {/* Favorite Button */}
        <button 
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-colors ${isFavorite ? 'text-rose-500' : 'text-stone-400 hover:text-rose-400'}`}
        >
            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 pt-8 flex-1 flex flex-col">
        <span className="text-xs font-bold tracking-widest text-stone-400 uppercase mb-2">{recipe.category}</span>
        <h3 className="font-serif text-2xl text-stone-800 leading-tight mb-3 group-hover:text-amber-600 transition-colors">
            {recipe.title}
        </h3>
        
        {recipe.description && (
            <p className="text-stone-500 text-sm line-clamp-2 mb-4 font-light">
                {recipe.description}
            </p>
        )}

        <div className="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between text-stone-400 text-sm">
            <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{recipe.cookTime || recipe.prepTime || "30m"}</span>
            </div>
             <div className="flex items-center gap-2">
                <Users size={16} />
                <span>{recipe.yields || "4"}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;