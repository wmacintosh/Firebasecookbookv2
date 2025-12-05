import { initializeApp, FirebaseApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  doc,
  updateDoc,
  Firestore 
} from "firebase/firestore";
import { Recipe } from "../types";
import { SEED_RECIPES, getAvatarColor } from "../constants";

// Configuration
const apiKey = process.env.API_KEY;

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "shirleys-kitchen.firebaseapp.com",
  projectId: "shirleys-kitchen",
  storageBucket: "shirleys-kitchen.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
  measurementId: "G-ABCDEF"
};

// Initialize State
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let isDemoMode = false;
let demoStore: Recipe[] = [];
let analyticsInitialized = false;

const initFirebase = () => {
  // 1. Heuristic Check: If no key, or key doesn't look like a Google API key, 
  // skip init to avoid immediate errors.
  if (!apiKey || typeof apiKey !== 'string' || !apiKey.startsWith('AIza')) {
    console.warn("Valid API Key not found. Defaulting to Demo Mode.");
    isDemoMode = true;
    return;
  }

  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    // NOTE: We deliberately DO NOT initialize Analytics here.
    // We wait until we successfully connect to the DB to ensure the key is valid.
    // This prevents the "400 INVALID_ARGUMENT" error on startup for users with Gemini-only keys.
  } catch (error) {
    console.error("Firebase Initialization failed. Defaulting to Demo Mode.", error);
    isDemoMode = true;
    db = null;
  }
};

// Helper to lazy-load analytics only if we have a valid app connection
const tryInitAnalytics = async () => {
  if (analyticsInitialized || !app || typeof window === 'undefined') return;
  
  try {
    const { getAnalytics } = await import("firebase/analytics");
    getAnalytics(app);
    analyticsInitialized = true;
    console.log("Firebase Analytics initialized successfully.");
  } catch (err) {
    // Silent failure is acceptable for analytics
    console.debug("Analytics failed to initialize (likely due to restricted API key).", err);
    analyticsInitialized = true; // Set true to avoid retrying
  }
};

initFirebase();

// Service Methods
export const recipeService = {
  
  async getAllRecipes(): Promise<Recipe[]> {
    if (isDemoMode || !db) {
      if (demoStore.length === 0) {
        demoStore = [...SEED_RECIPES].map((r, i) => ({...r, id: `demo-${i}`}));
      }
      return new Promise(resolve => setTimeout(() => resolve(demoStore), 800));
    }

    try {
      // We try to fetch. If the API key is invalid, this will throw.
      const querySnapshot = await getDocs(collection(db, "recipes"));
      
      // If we reached here, the API key is VALID for Firebase.
      // Now it is safe to initialize Analytics.
      tryInitAnalytics();

      const recipes: Recipe[] = [];
      querySnapshot.forEach((doc) => {
        recipes.push({ id: doc.id, ...doc.data() } as Recipe);
      });
      
      if (recipes.length === 0) {
        return this.seedDatabase();
      }
      return recipes;
    } catch (error) {
      console.warn("Error fetching recipes (likely invalid API key for Firebase). Falling back to Demo Mode.");
      isDemoMode = true; // Switch to demo mode globally
      return this.getAllRecipes(); // Retry in demo mode
    }
  },

  async addRecipe(recipe: Omit<Recipe, 'id' | 'timestamp'>): Promise<Recipe> {
    const newRecipe = {
      ...recipe,
      timestamp: Date.now(),
      userColor: getAvatarColor(recipe.addedBy)
    };

    if (isDemoMode || !db) {
      const mockId = `demo-${Date.now()}`;
      const saved = { ...newRecipe, id: mockId };
      demoStore.push(saved);
      await new Promise(resolve => setTimeout(resolve, 300));
      return saved;
    }

    try {
      const docRef = await addDoc(collection(db, "recipes"), newRecipe);
      return { ...newRecipe, id: docRef.id };
    } catch (error) {
       console.error("Error adding recipe to Firestore, falling back to demo mode:", error);
       isDemoMode = true;
       return this.addRecipe(recipe);
    }
  },

  async updateRecipe(recipe: Recipe): Promise<void> {
    const updatedData = {
      ...recipe,
      userColor: getAvatarColor(recipe.addedBy)
    };

    if (isDemoMode || !db) {
      const index = demoStore.findIndex(r => r.id === recipe.id);
      if (index !== -1) {
        demoStore[index] = updatedData;
      }
      await new Promise(resolve => setTimeout(resolve, 300));
      return;
    }

    try {
      if (!recipe.id) throw new Error("Recipe ID missing for update");
      const recipeRef = doc(db, "recipes", recipe.id);
      // Remove id from the data being sent to firestore (keep metadata clean)
      const { id, ...data } = updatedData;
      await updateDoc(recipeRef, data);
    } catch (error) {
      console.error("Error updating recipe in Firestore, falling back to demo mode:", error);
      isDemoMode = true;
      return this.updateRecipe(recipe);
    }
  },

  async seedDatabase(): Promise<Recipe[]> {
    if (isDemoMode || !db) {
      demoStore = [...SEED_RECIPES].map((r, i) => ({...r, id: `demo-${i}`}));
      return demoStore;
    }

    console.log("Seeding database...");
    // Sequentially add to ensure order/stability
    const results = [];
    for (const r of SEED_RECIPES) {
        try {
            const res = await this.addRecipe(r);
            results.push(res);
        } catch (e) {
            console.warn("Failed to seed recipe", r.title);
        }
    }
    return results;
  }
};