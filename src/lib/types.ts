export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
export type FitnessGoal = 'maintenance' | 'weightLoss' | 'weightGain';
export type Gender = 'male' | 'female';

export interface FormData {
  age: string;
  weight: string;
  height: string;
  gender: Gender | '';
  activityLevel: ActivityLevel | '';
  goal: FitnessGoal | '';
}

export interface MealItem {
  title: string;
  calories: number;
  items: string[];
}

export interface MealPlan {
  targetCalories: number;
  meals: {
    breakfast: MealItem;
    lunch: MealItem;
    dinner: MealItem;
  };
}
