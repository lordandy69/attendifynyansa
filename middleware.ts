import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";
import { supabaseClient } from "./lib/supabase/client";

export async function middleware(request: NextRequest) {
  // update user's auth session

  const res = NextResponse.next();

  // const {
  //   data: { session },
  // } = await supabaseClient().auth.getSession();

  // // Check if user is trying to access protected routes
  // if (
  //   request.nextUrl.pathname.startsWith("/class") ||
  //   request.nextUrl.pathname.startsWith("/profile")
  // ) {
  //   if (!session?.user!) {
  //     // If no active session, redirect to home page
  //     return NextResponse.redirect(new URL("/", request.url));
  //   }
  // }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    // "/class/:path*",
    // "/profile/:path*",
  ],
};
