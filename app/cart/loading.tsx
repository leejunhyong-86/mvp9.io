/**
 * @file app/cart/loading.tsx
 * @description 장바구니 페이지 로딩 UI
 *
 * 장바구니 페이지 로딩 중 표시되는 스켈레톤 UI입니다.
 */

import { Skeleton } from "@/components/ui/skeleton";
import { CartItemSkeleton } from "@/components/skeletons/cart-item-skeleton";

export default function CartLoading() {
  return (
    <main className="min-h-[calc(100vh-80px)] px-4 py-8 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        {/* 헤더 */}
        <div className="mb-8 flex items-center justify-between">
          <Skeleton className="h-9 w-32" />
        </div>

        {/* 2열 그리드 레이아웃 */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]">
          {/* 왼쪽: 장바구니 아이템 목록 */}
          <div className="space-y-4">
            {/* 전체 선택 & 선택 삭제 */}
            <div className="flex items-center justify-between rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-8 w-24 rounded" />
            </div>

            {/* 장바구니 아이템 스켈레톤 (3개) */}
            <CartItemSkeleton />
            <CartItemSkeleton />
            <CartItemSkeleton />
          </div>

          {/* 오른쪽: 주문 요약 스켈레톤 */}
          <div className="rounded-lg border bg-card p-6 lg:sticky lg:top-24 lg:self-start">
            <Skeleton className="mb-4 h-6 w-24" />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="rounded-md bg-muted p-3">
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="border-t pt-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-28" />
                  <Skeleton className="h-8 w-32" />
                </div>
              </div>
            </div>
            <Skeleton className="mt-4 h-12 w-full rounded" />
          </div>
        </div>
      </div>
    </main>
  );
}

