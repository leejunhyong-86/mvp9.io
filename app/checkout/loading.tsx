/**
 * @file app/checkout/loading.tsx
 * @description 주문 페이지 로딩 UI
 */

import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutLoading() {
  return (
    <main className="min-h-[calc(100vh-80px)] px-4 py-8 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        {/* 헤더 스켈레톤 */}
        <div className="mb-8">
          <Skeleton className="mb-4 h-5 w-40" />
          <Skeleton className="h-8 w-32" />
        </div>

        {/* 2열 그리드 레이아웃 */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]">
          {/* 왼쪽: 배송 정보 폼 스켈레톤 */}
          <div className="space-y-6 rounded-lg border bg-card p-6">
            <Skeleton className="h-6 w-24" />
            
            {/* 폼 필드 스켈레톤 (6개) */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>

          {/* 오른쪽: 주문 요약 스켈레톤 */}
          <div className="space-y-6 rounded-lg border bg-card p-6 lg:sticky lg:top-24 lg:self-start">
            <Skeleton className="h-6 w-24" />

            {/* 상품 목록 스켈레톤 */}
            <div className="space-y-4">
              <Skeleton className="h-5 w-32" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </div>

            {/* 금액 요약 스켈레톤 */}
            <div className="border-t pt-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-7 w-24" />
                  </div>
                </div>
              </div>
            </div>

            {/* 버튼 스켈레톤 */}
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </main>
  );
}

