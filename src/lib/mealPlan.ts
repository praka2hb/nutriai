// types/mealPlan.ts
export interface MealPlanDay {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string;
  }
  
  export interface MealPlan {
    [day: string]: MealPlanDay;
  }
  
  export interface UserMetadata {
    [key: string]: string; // Allows for dynamic user metadata
  }
  
  export interface ApiResponse {
    mealPlan?: MealPlan;
    error?: string;
  }