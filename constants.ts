import { Recipe, Category } from './types';

export const APP_NAME = "Shirley's Kitchen";

// CSS for the MacIntosh Red Tartan pattern
// Based on the authentic MacIntosh Red sett: Red background with Green and Navy checks
export const TARTAN_PATTERN_STYLE = {
  backgroundColor: '#d90000', // Bright Red Base
  backgroundImage: `
    /* Vertical Lines */
    repeating-linear-gradient(90deg, 
      rgba(0, 50, 0, 0.5) 0px, rgba(0, 50, 0, 0.5) 50px, /* Green Block */
      transparent 50px, transparent 100px, /* Red Gap */
      rgba(0, 0, 80, 0.5) 100px, rgba(0, 0, 80, 0.5) 150px, /* Navy Block */
      transparent 150px, transparent 200px /* Red Gap */
    ),
    /* Horizontal Lines */
    repeating-linear-gradient(0deg, 
      rgba(0, 50, 0, 0.5) 0px, rgba(0, 50, 0, 0.5) 50px, 
      transparent 50px, transparent 100px, 
      rgba(0, 0, 80, 0.5) 100px, rgba(0, 0, 80, 0.5) 150px, 
      transparent 150px, transparent 200px
    ),
    /* Thin Crossing Lines for Detail */
    repeating-linear-gradient(90deg, 
      transparent 0px, transparent 24px, 
      rgba(0,0,0,0.2) 24px, rgba(0,0,0,0.2) 26px, 
      transparent 26px, transparent 200px
    ),
    repeating-linear-gradient(0deg, 
      transparent 0px, transparent 24px, 
      rgba(0,0,0,0.2) 24px, rgba(0,0,0,0.2) 26px, 
      transparent 26px, transparent 200px
    )
  `,
  backgroundBlendMode: 'multiply'
};

export const FAMILY_MEMBERS: Record<string, string> = {
  "Nan": "#d97706", // Amber
  "Wade": "#0369a1", // Sky
  "Shirley": "#e11d48", // Rose
  "Mom": "#059669", // Emerald
  "Grandma": "#7c2d12", // Brown
};

export const getAvatarColor = (name: string): string => {
  if (FAMILY_MEMBERS[name]) return FAMILY_MEMBERS[name];
  // Deterministic fallback
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
};

export const SEED_RECIPES: Recipe[] = [
  {
    title: "Famous Cactus Dip",
    category: Category.APPETIZERS,
    ingredients: [
      "1 cup sour cream",
      "1 cup mayonnaise",
      "1 can chopped green chilies",
      "1 cup shredded cheddar cheese",
      "1/2 cup chopped green onions",
      "Dash of garlic powder"
    ],
    instructions: [
      "Mix all ingredients in a medium bowl.",
      "Chill for at least 1 hour before serving.",
      "Serve with tortilla chips."
    ],
    addedBy: "Nan",
    prepTime: "10m",
    yields: "3 cups",
    timestamp: Date.now(),
    description: "The legendary family dip that disappears first at every gathering."
  },
  {
    title: "Sunday Roast Beef",
    category: Category.MAIN_DISHES,
    ingredients: [
      "4lb beef roast",
      "2 onions, quartered",
      "4 carrots, chopped",
      "4 potatoes, quartered",
      "Salt and pepper",
      "1 cup beef broth"
    ],
    instructions: [
      "Preheat oven to 325°F.",
      "Season roast generously with salt and pepper.",
      "Place in roasting pan with vegetables around it.",
      "Pour broth over everything.",
      "Roast for 3-4 hours until tender."
    ],
    addedBy: "Shirley",
    cookTime: "4h",
    temp: "325°F",
    timestamp: Date.now() - 10000,
    description: "A staple for Sunday afternoons after church."
  },
  {
    title: "Grandma's Apple Crisp",
    category: Category.DESSERTS,
    ingredients: [
      "6 apples, sliced",
      "1 cup flour",
      "1 cup sugar",
      "1 tsp cinnamon",
      "1/2 cup butter, softened"
    ],
    instructions: [
      "Place apples in a greased baking dish.",
      "Mix dry ingredients and cut in butter until crumbly.",
      "Sprinkle over apples.",
      "Bake at 350°F for 45 minutes."
    ],
    addedBy: "Grandma",
    cookTime: "45m",
    temp: "350°F",
    timestamp: Date.now() - 20000,
    description: "Best served warm with a scoop of vanilla bean ice cream."
  },
   {
    title: "Zesty Pasta Salad",
    category: Category.SOUPS_SALADS,
    ingredients: [
      "1 lb rotini pasta",
      "1 bottle Italian dressing",
      "1 cucumber, diced",
      "1 pint cherry tomatoes",
      "1 can black olives"
    ],
    instructions: [
      "Boil pasta until al dente. Rinse with cold water.",
      "Toss with dressing and vegetables.",
      "Refrigerate overnight for best flavor."
    ],
    addedBy: "Wade",
    prepTime: "20m",
    timestamp: Date.now() - 50000,
  }
];