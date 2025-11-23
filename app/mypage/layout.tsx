/**
 * @file app/mypage/layout.tsx
 * @description 마이페이지 레이아웃
 * 
 * 로그인된 사용자만 접근 가능하며, 사이드바 네비게이션을 포함합니다.
 */

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, User, MapPin } from "lucide-react";

export default async function MypageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 로그인 확인
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in?returnUrl=/mypage/orders");
  }

  return (
    <div className="min-h-[calc(100vh-80px)] px-4 py-8 sm:px-8 lg:px-12 xl:px-16">
      <div className="w-full">
        <h1 className="mb-6 text-2xl font-bold sm:text-3xl">마이페이지</h1>

        {/* 상단 탭 (모든 화면) */}
        <nav className="mb-6 flex gap-2 overflow-x-auto pb-2">
          <Link
            href="/mypage/orders"
            className="flex items-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            <Package className="h-4 w-4" />
            주문 내역
          </Link>
          <button
            disabled
            className="flex items-center gap-2 whitespace-nowrap rounded-md border bg-card px-4 py-2 text-sm font-medium text-muted-foreground opacity-50 cursor-not-allowed"
            title="추후 구현 예정"
          >
            <User className="h-4 w-4" />
            회원 정보
          </button>
          <button
            disabled
            className="flex items-center gap-2 whitespace-nowrap rounded-md border bg-card px-4 py-2 text-sm font-medium text-muted-foreground opacity-50 cursor-not-allowed"
            title="추후 구현 예정"
          >
            <MapPin className="h-4 w-4" />
            배송지 관리
          </button>
        </nav>

        {/* 콘텐츠 영역 */}
        <main>{children}</main>
      </div>
    </div>
  );
}

