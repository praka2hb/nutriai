import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
    try{
        const { email, password } = await request.json();
        if(!email || !password){
            return NextResponse.json({ error: "Email and Password is required" }, { status: 400 });
        }

        const user = await User.findOne({
            email: email
        })

        if(!user){
            return NextResponse.json({ error: "User not found" }, { status: 400 });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if(!isValid){
            return NextResponse.json({ error: "Invalid Password" }, { status: 400 });
        }

        return NextResponse.json({ message: "User logged in successfully" }, { status: 200 });
    }
    catch(error: any){
        return NextResponse.json({
            message: "User Failed to login",
            error: error.message
        }, { status: 200 });   
    }
}
