import { model, models, Schema } from "mongoose";

export interface IMealTracking {
  userId: string;
  date: Date;
  completedMeals: {
    day: string;
    mealType: string;
    completed: boolean;
  }[];
}

const trackingSchema = new Schema<IMealTracking>({
  userId: { type: String, required: true },
  date: { type: Date, default: Date.now },
  completedMeals: [{ 
    day: String,
    mealType: String,
    completed: Boolean,
    timestamp: { type: Date, default: Date.now }
  }]
});

const MealTrackingModel = models?.MealTracking || model('MealTracking', trackingSchema);
export default MealTrackingModel;
