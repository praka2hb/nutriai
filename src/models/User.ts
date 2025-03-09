import mongoose, { model, models, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
    name?: string;
    email: string;
    password: string;
    _id?: mongoose.Types.ObjectId;
}

const userSchema = new Schema<IUser>({
    name: {type: String},
    email: { type: String, required: true },
    password: { type: String, required: true }
})

userSchema.pre('save', async function (next) {
    if(this.isModified('password')){
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
    }
    next();
})

const User = models?.User ||model<IUser>('User', userSchema);

export default User