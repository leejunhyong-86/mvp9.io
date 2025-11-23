/**
 * @file app/mypage/orders/loading.tsx
 * @description 주문 목록 페이지 로딩 UI
 */

import { OrderCardSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersLoading() {
  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-5 w-20" />
      </div>

      {/* 필터 탭 */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-24" />
          ))}
        </div>
        {/* 정렬 */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
      </div>

      {/* 주문 카드 스켈레톤 */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <OrderCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

