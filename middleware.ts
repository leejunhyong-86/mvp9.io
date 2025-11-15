import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 임시 테스트용 middleware - Clerk 없이 기본 동작만
export function middleware(request: NextRequest) {
  console.log("Middleware running for:", request.nextUrl.pathname);
  return NextResponse.next();
}

// Matcher 설정: 미들웨어가 실행될 경로 정의
export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
