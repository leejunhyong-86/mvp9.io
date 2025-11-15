import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

// Node.js 런타임을 명시적으로 설정하여 Vercel Edge Runtime 호환성 문제 해결
export const runtime = "nodejs";

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
