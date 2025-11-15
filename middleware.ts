import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 공개 라우트 정의
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

// Clerk Middleware 설정
export default clerkMiddleware(async (auth, request) => {
  // 공개 라우트가 아닌 경우 인증 필요
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

// Node.js 런타임을 명시적으로 설정하여 Vercel Edge Runtime 호환성 문제 해결
export const config = {
  runtime: "nodejs",
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
