import withAuth from "next-auth/middleware";
import { NextResponse, NextRequest } from "next/server";

const allowedOrigins = ['https://nutriai-fit.vercel.app', 'http://localhost:3000']

const corsOptions = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export default withAuth(
    function middleware(request: NextRequest ){
        const origin = request.headers.get('origin') ?? ''
        const isAllowedOrigin = allowedOrigins.includes(origin)
       
        // Handle preflighted requests
        const isPreflight = request.method === 'OPTIONS'
       
        if (isPreflight) {
          const preflightHeaders = {
            ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
            ...corsOptions,
          }
          return NextResponse.json({}, { headers: preflightHeaders })
        }
       
        // Handle simple requests
        const response = NextResponse.next()
       
        if (isAllowedOrigin) {
          response.headers.set('Access-Control-Allow-Origin', origin)
        }
       
        Object.entries(corsOptions).forEach(([key, value]) => {
          response.headers.set(key, value)
        })
       
        return response
    },
    {
        callbacks:{
            authorized: ({token, req}) => {
                const {pathname} = req.nextUrl 

                if(pathname.startsWith("/api/auth") || pathname === "/login" || pathname === "/register"){
                    return true
                }

                if(pathname === "/" || pathname.startsWith("/api/nutrition-chat")){
                    return false
                }

                return !!token
            }
        }
    } 
)

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)", "/api/:path*"],
}