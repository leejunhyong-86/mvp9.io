import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 공개 라우트 정의 (인증 없이 접근 가능)
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/sync-user(.*)", // sync-user API도 공개로 설정 (내부적으로 인증 체크함)
]);

// Clerk Middleware 설정
export default clerkMiddleware((auth, request) => {
  // 공개 라우트가 아닌 경우 인증 필요
  if (!isPublicRoute(request)) {
    auth.protect();
  }
});

// Matcher 설정: 미들웨어가 실행될 경로 정의
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
