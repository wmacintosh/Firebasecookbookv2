import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutGrid, List, Heart, Search, Plus, 
  Menu, X, ChefHat, UtensilsCrossed
} from 'lucide-react';
import LandingPage from './components/LandingPage';
import RecipeCard from './components/RecipeCard';
import RecipeDetail from './components/RecipeDetail';
import { recipeService } from './services/firebaseService';
import { Recipe, Category } from './types';
import { FAMILY_MEMBERS, getAvatarColor } from './constants';

const App: React.FC = () => {
  // State
  const [hasEntered, setHasEntered] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All' | 'Favorites'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Recipe Form State
  const [recipeForm, setRecipeForm] = useState<Partial<Recipe>>({
    title: '',
    category: Category.MAIN_DISHES,
    ingredients: [''],
    instructions: [''],
    addedBy: 'Nan'
  });

  // Load Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await recipeService.getAllRecipes();
        setRecipes(data);
      } catch (err) {
        console.error("Failed to load recipes", err);
      } finally {
        setLoading(false);
      }
    };

    const savedFavs = localStorage.getItem('shirley_favorites');
    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs));
    }

    fetchData();
  }, []);

  // Save Favorites
  useEffect(() => {
    localStorage.setItem('shirley_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  // Filtering
  const filteredRecipes = useMemo(() => {
    let result = recipes;

    // Category Filter
    if (selectedCategory === 'Favorites') {
      result = result.filter(r => r.id && favorites.includes(r.id));
    } else if (selectedCategory !== 'All') {
      result = result.filter(r => r.category === selectedCategory);
    }

    // Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => 
        r.title.toLowerCase().includes(q) || 
        r.ingredients.some(i => i.toLowerCase().includes(q))
      );
    }

    return result;
  }, [recipes, selectedCategory, searchQuery, favorites]);

  // Handlers
  const openAddModal = () => {
    setRecipeForm({
      title: '',
      category: Category.MAIN_DISHES,
      ingredients: [''],
      instructions: [''],
      addedBy: 'Nan'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (recipe: Recipe) => {
    setRecipeForm({ ...recipe });
    setIsModalOpen(true);
    // Optionally close detail if you want, but often nicer to keep context or just close it
    // setSelectedRecipe(null); 
  };

  const handleAddIngredient = () => {
    setRecipeForm(prev => ({...prev, ingredients: [...(prev.ingredients || []), '']}));
  };

  const handleAddInstruction = () => {
    setRecipeForm(prev => ({...prev, instructions: [...(prev.instructions || []), '']}));
  };

  const handleSaveRecipe = async () => {
    if (!recipeForm.title || !recipeForm.ingredients?.length) return;
    
    // Clean empty entries
    const cleanIngredients = recipeForm.ingredients.filter(i => i.trim() !== '');
    const cleanInstructions = recipeForm.instructions?.filter(i => i.trim() !== '');

    const recipeToSave = {
      ...recipeForm,
      ingredients: cleanIngredients,
      instructions: cleanInstructions
    } as Recipe;

    if (recipeForm.id) {
      // Update existing
      await recipeService.updateRecipe(recipeToSave);
      // Update local state
      setRecipes(prev => prev.map(r => r.id === recipeForm.id ? { ...r, ...recipeToSave, userColor: getAvatarColor(recipeToSave.addedBy) } : r));
      // Update selected recipe if it's the one being edited
      if (selectedRecipe?.id === recipeForm.id) {
        setSelectedRecipe({ ...selectedRecipe, ...recipeToSave, userColor: getAvatarColor(recipeToSave.addedBy) });
      }
    } else {
      // Create new
      const saved = await recipeService.addRecipe(recipeToSave);
      setRecipes(prev => [...prev, saved]);
    }

    setIsModalOpen(false);
  };

  // Render logic
  if (!hasEntered) {
    return <LandingPage onEnter={() => setHasEntered(true)} />;
  }

  const categories = Object.values(Category);
  const familyNames = Object.keys(FAMILY_MEMBERS);

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden font-sans">
      
      {/* Mobile Nav Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-stone-900/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed md:static inset-y-0 left-0 w-64 bg-stone-900 text-stone-300 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 flex flex-col border-r border-stone-800`}>
        <div className="p-6 border-b border-stone-800 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl text-white">Shirley's Kitchen</h2>
            <p className="text-xs text-stone-500 uppercase tracking-widest mt-1">Family Recipes</p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <button 
            onClick={() => { setSelectedCategory('All'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${selectedCategory === 'All' ? 'bg-stone-800 text-white' : 'hover:bg-stone-800/50'}`}
          >
            <UtensilsCrossed size={18} /> All Recipes
          </button>
          
          <button 
            onClick={() => { setSelectedCategory('Favorites'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${selectedCategory === 'Favorites' ? 'bg-rose-900/30 text-rose-200' : 'hover:bg-stone-800/50'}`}
          >
            <Heart size={18} /> Favorites
          </button>

          <div className="pt-6 pb-2 px-4 text-xs font-bold text-stone-500 uppercase tracking-widest">
            Categories
          </div>
          
          {categories.map(cat => (
             <button 
                key={cat}
                onClick={() => { setSelectedCategory(cat); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-md transition-colors text-sm ${selectedCategory === cat ? 'text-amber-500 bg-stone-800' : 'hover:text-white'}`}
            >
                {cat}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-stone-800">
           <button 
            onClick={openAddModal}
            className="w-full flex items-center justify-center gap-2 bg-amber-600 text-white py-3 rounded shadow-lg hover:bg-amber-500 transition-colors"
           >
             <Plus size={18} /> Add Recipe
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Navbar */}
        <header className="bg-white border-b border-stone-200 h-16 flex items-center justify-between px-6 shadow-sm z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-stone-600">
                <Menu size={24} />
            </button>
            <h1 className="font-serif text-2xl text-stone-800 hidden sm:block">
                {selectedCategory === 'All' ? 'All Recipes' : selectedCategory}
            </h1>
          </div>

          <div className="flex items-center gap-4 flex-1 justify-end max-w-xl">
             <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search for cactus dip..." 
                    className="w-full pl-10 pr-4 py-2 bg-stone-100 border-none rounded-full focus:ring-2 focus:ring-amber-500/50 outline-none text-stone-700 placeholder-stone-400 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
             
             <div className="flex bg-stone-100 p-1 rounded-lg border border-stone-200">
                <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm text-stone-800' : 'text-stone-400'}`}
                >
                    <LayoutGrid size={18} />
                </button>
                <button 
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm text-stone-800' : 'text-stone-400'}`}
                >
                    <List size={18} />
                </button>
             </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
            {loading ? (
                <div className="flex flex-col items-center justify-center h-64 text-stone-400">
                    <ChefHat className="animate-bounce mb-4" size={48} />
                    <p>Warming up the oven...</p>
                </div>
            ) : filteredRecipes.length === 0 ? (
                <div className="text-center py-20">
                    <h3 className="font-serif text-2xl text-stone-400 mb-2">No recipes found</h3>
                    <p className="text-stone-500">Try adjusting your search or add a new family classic.</p>
                </div>
            ) : (
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                    {filteredRecipes.map(recipe => (
                        <RecipeCard 
                            key={recipe.id} 
                            recipe={recipe} 
                            isFavorite={!!recipe.id && favorites.includes(recipe.id)}
                            onToggleFavorite={toggleFavorite}
                            onClick={setSelectedRecipe}
                            viewMode={viewMode}
                        />
                    ))}
                </div>
            )}
        </div>
      </main>

      {/* Details Modal */}
      {selectedRecipe && (
        <RecipeDetail 
            recipe={selectedRecipe} 
            onClose={() => setSelectedRecipe(null)}
            onEdit={openEditModal}
        />
      )}

      {/* Add/Edit Recipe Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                    <h2 className="font-serif text-2xl text-stone-800">
                        {recipeForm.id ? "Edit Recipe" : "Add New Recipe"}
                    </h2>
                    <button onClick={() => setIsModalOpen(false)}><X className="text-stone-400 hover:text-stone-600" /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Recipe Title</label>
                            <input 
                                className="w-full border border-stone-200 rounded p-2 focus:ring-2 focus:ring-amber-500 outline-none"
                                value={recipeForm.title}
                                onChange={e => setRecipeForm({...recipeForm, title: e.target.value})}
                                placeholder="e.g. Aunt May's Cornbread"
                            />
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Category</label>
                             <select 
                                className="w-full border border-stone-200 rounded p-2 bg-white"
                                value={recipeForm.category}
                                onChange={e => setRecipeForm({...recipeForm, category: e.target.value as Category})}
                             >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                             </select>
                        </div>
                         <div>
                             <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Owner / Added By</label>
                             <select 
                                className="w-full border border-stone-200 rounded p-2 bg-white"
                                value={recipeForm.addedBy}
                                onChange={e => setRecipeForm({...recipeForm, addedBy: e.target.value})}
                             >
                                {familyNames.map(m => <option key={m} value={m}>{m}</option>)}
                                <option value="Guest">Guest</option>
                             </select>
                        </div>
                         <div className="col-span-2">
                            <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Description</label>
                            <textarea 
                                className="w-full border border-stone-200 rounded p-2 focus:ring-2 focus:ring-amber-500 outline-none"
                                rows={2}
                                value={recipeForm.description || ''}
                                onChange={e => setRecipeForm({...recipeForm, description: e.target.value})}
                                placeholder="A short story about this dish..."
                            />
                        </div>
                         <div>
                            <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Prep Time</label>
                            <input 
                                className="w-full border border-stone-200 rounded p-2 focus:ring-2 focus:ring-amber-500 outline-none"
                                value={recipeForm.prepTime || ''}
                                onChange={e => setRecipeForm({...recipeForm, prepTime: e.target.value})}
                                placeholder="e.g. 15m"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Cook Time</label>
                            <input 
                                className="w-full border border-stone-200 rounded p-2 focus:ring-2 focus:ring-amber-500 outline-none"
                                value={recipeForm.cookTime || ''}
                                onChange={e => setRecipeForm({...recipeForm, cookTime: e.target.value})}
                                placeholder="e.g. 1h"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Temperature</label>
                            <input 
                                className="w-full border border-stone-200 rounded p-2 focus:ring-2 focus:ring-amber-500 outline-none"
                                value={recipeForm.temp || ''}
                                onChange={e => setRecipeForm({...recipeForm, temp: e.target.value})}
                                placeholder="e.g. 350°F"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Yields</label>
                            <input 
                                className="w-full border border-stone-200 rounded p-2 focus:ring-2 focus:ring-amber-500 outline-none"
                                value={recipeForm.yields || ''}
                                onChange={e => setRecipeForm({...recipeForm, yields: e.target.value})}
                                placeholder="e.g. 4 servings"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                             <label className="block text-xs font-bold text-stone-500 uppercase">Ingredients</label>
                             <button onClick={handleAddIngredient} className="text-amber-600 text-xs font-bold hover:underline">+ Add Item</button>
                        </div>
                        <div className="space-y-2">
                            {recipeForm.ingredients?.map((ing, idx) => (
                                <input 
                                    key={idx}
                                    className="w-full border border-stone-200 rounded p-2 text-sm"
                                    value={ing}
                                    onChange={e => {
                                        const list = [...(recipeForm.ingredients || [])];
                                        list[idx] = e.target.value;
                                        setRecipeForm({...recipeForm, ingredients: list});
                                    }}
                                    placeholder={`Ingredient ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                     <div>
                        <div className="flex justify-between items-center mb-2">
                             <label className="block text-xs font-bold text-stone-500 uppercase">Instructions</label>
                             <button onClick={handleAddInstruction} className="text-amber-600 text-xs font-bold hover:underline">+ Add Step</button>
                        </div>
                        <div className="space-y-2">
                            {recipeForm.instructions?.map((inst, idx) => (
                                <textarea 
                                    key={idx}
                                    rows={2}
                                    className="w-full border border-stone-200 rounded p-2 text-sm"
                                    value={inst}
                                    onChange={e => {
                                        const list = [...(recipeForm.instructions || [])];
                                        list[idx] = e.target.value;
                                        setRecipeForm({...recipeForm, instructions: list});
                                    }}
                                    placeholder={`Step ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-stone-100 bg-stone-50 flex justify-end gap-3">
                    <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-stone-500 hover:text-stone-800">Cancel</button>
                    <button 
                        onClick={handleSaveRecipe}
                        className="px-6 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 shadow-sm"
                    >
                        Save Recipe
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default App;