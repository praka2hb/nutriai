import mongoose, { model, models, Schema } from "mongoose";

export interface IMealPlan {
    userId: string
    mealPlan: object[]
    startDate?: Date
    expiryDate?: Date
    _id?: mongoose.Types.ObjectId;
}

const mealPlanSchema = new Schema<IMealPlan>({
    userId: { type: String, required: true },
    mealPlan: { type: [Object], required: true },
    startDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true }
})

const MealModel = models?.MealPlan || model('MealPlan', mealPlanSchema);

export default MealModel