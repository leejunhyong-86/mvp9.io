/**
 * @file components/skeletons/order-card-skeleton.tsx
 * @description 주문 카드 스켈레톤 컴포넌트
 */

import { Skeleton } from "@/components/ui/skeleton";

export function OrderCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 space-y-2">
          {/* 주문 번호 */}
          <Skeleton className="h-4 w-32" />
          {/* 주문 날짜 */}
          <Skeleton className="h-3 w-40" />
        </div>
        {/* 상태 뱃지 */}
        <Skeleton className="h-6 w-20" />
      </div>

      <div className="space-y-3">
        {/* 상품명 */}
        <div>
          <Skeleton className="h-5 w-48" />
        </div>

        {/* 결제 금액 */}
        <div className="flex items-center justify-between pt-3 border-t">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-28" />
        </div>
      </div>
    </div>
  );
}

