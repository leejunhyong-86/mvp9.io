/**
 * @file app/payment/success/loading.tsx
 * @description 결제 성공 페이지 로딩 UI
 */

import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentSuccessLoading() {
  return (
    <main className="min-h-[calc(100vh-80px)] px-4 py-8 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-3xl">
        {/* 헤더 스켈레톤 */}
        <div className="mb-8 flex flex-col items-center text-center">
          <Skeleton className="mb-4 h-16 w-16 rounded-full" />
          <Skeleton className="mb-2 h-8 w-64" />
          <Skeleton className="h-5 w-48" />
        </div>

        <div className="space-y-6">
          {/* 주문 정보 스켈레톤 */}
          <div className="rounded-lg border bg-card p-6">
            <Skeleton className="mb-4 h-6 w-24" />
            <div className="space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
          </div>

          {/* 주문 상품 스켈레톤 */}
          <div className="rounded-lg border bg-card p-6">
            <Skeleton className="mb-4 h-6 w-32" />
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>

          {/* 배송 정보 스켈레톤 */}
          <div className="rounded-lg border bg-card p-6">
            <Skeleton className="mb-4 h-6 w-24" />
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* 버튼 스켈레톤 */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 flex-1" />
          </div>
        </div>
      </div>
    </main>
  );
}

