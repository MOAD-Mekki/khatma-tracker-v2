import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/middleware";

// Type of routes that the project have.
const PROTECTED_PATHS = ["/pages/main", "/pages/khatmas-history"];
const AUTH_PATHS = ["/", "/pages/signin", "/pages/signup"];

export  async function proxy(request: NextRequest) {
  const { supabase, response } = createClient(request); // creating supabase client

  const { data: { user } } = await supabase.auth.getUser(); // getting the user's informations

  const { pathname } = request.nextUrl; // getting the request path

  const isProtectedPath = PROTECTED_PATHS.some((path) => // checking if the request path is one of the protected paths
    pathname.startsWith(path)
  );
  const isAuthPath = AUTH_PATHS.includes(pathname); // same check if it's from the auth paths

  if (!user && isProtectedPath) { // this runs when there is no auth-user, and the view is on the main page
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/"; // redirect to the welcome page
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isAuthPath) { // this runs when there is an auth-user, and the view is on the sign-in/up or welcome pages
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/pages/main"; // redirect to the main page
    return NextResponse.redirect(redirectUrl);
  }

  return response;// the normal function flow when non of the above statements is true.
}

export const config = {
  matcher: [ // this matcher verifys that this function is called in the assignable routes, not in any static file.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};