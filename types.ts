export enum Category {
  APPETIZERS = "Appetizers",
  SOUPS_SALADS = "Soups & Salads",
  BREADS = "Breads",
  MAIN_DISHES = "Main Dishes",
  SIDE_DISHES = "Side Dishes",
  DESSERTS = "Desserts",
  SAUCES = "Sauces",
}

export interface Recipe {
  id?: string;
  title: string;
  category: Category;
  ingredients: string[];
  instructions: string[];
  addedBy: string; // "Nan", "Wade", etc.
  userColor?: string; // Hex code
  yields?: string;
  prepTime?: string;
  cookTime?: string;
  temp?: string;
  imageUrl?: string;
  description?: string;
  timestamp: number;
  isFavorite?: boolean; // Client-side only property
}

export interface NavItem {
  label: string;
  icon: any;
  view: 'dashboard' | 'all' | 'favorites' | 'add';
  filter?: Category;
}