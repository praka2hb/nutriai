import mongoose, { model, models, Schema } from "mongoose";

export interface IUser {
    age: string
    height: string
    weight: string
    gender: string
    // Fitness Goals
    fitnessGoal: string
    userId: string
    allergies: string
    activities: string[]
    activityLevel: string
    // Nutrition
    mealsPerDay: string
    dietaryPreferences: string[]
    _id?: mongoose.Types.ObjectId;
}

const userMetaSchema = new Schema<IUser>({
    age: {type: String, required: true},
    weight: { type: String, required: true },
    height: { type: String, required: true },
    gender: { type: String, required: true },
    fitnessGoal: { type: String, required: true },
    userId: { type: String, required: true },
    allergies: { type: String },
    dietaryPreferences: { type: [String] },
    activities: { type: [String], required: true },
    activityLevel: { type: String, required: true },
    mealsPerDay: { type: String, required: true },
})

const Metadata = models?.Metadata || model<IUser>('Metadata', userMetaSchema);

export default Metadata