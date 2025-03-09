import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try{

        await connectToDatabase();

        const {name, email, password } = await request.json();
        if(!name || !email || !password){
            return NextResponse.json({ message: "Email and Password is required" }, { status: 400 });
        }

        const user = await User.findOne({
            email: email
        })

        if(user){
            return NextResponse.json({ message: "User with this Email already exist" }, { status: 400 });
        }
        
        await User.create({
            name: name,
            email: email,
            password: password
        })

        return NextResponse.json({ message: "User Registered successfully" }, { status: 200 });
        
    }
    catch(error: any){
        return NextResponse.json({
            message: "User Failed to Register",
            error: error.message
        }, { status: 402 });   
    }
}
