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
    catch(error: Error | unknown) {
        const errorMessage = error instanceof Error 
            ? error.message 
            : "Unknown error occurred";
            
        return NextResponse.json({
            message: "Failed to Register User",
            error: errorMessage
        }, {status: 500}); 
    }
}
