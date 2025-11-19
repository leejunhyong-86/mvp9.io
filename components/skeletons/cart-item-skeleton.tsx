/**
 * @file components/skeletons/cart-item-skeleton.tsx
 * @description 장바구니 아이템 스켈레톤 컴포넌트
 *
 * 장바구니 아이템 로딩 중 표시되는 스켈레톤입니다.
 */

import { Skeleton } from "@/components/ui/skeleton";

export function CartItemSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 sm:flex-row sm:items-start">
      {/* 체크박스 */}
      <Skeleton className="h-5 w-5 rounded" />

      {/* 이미지 */}
      <Skeleton className="h-20 w-20 rounded-md sm:h-24 sm:w-24" />

      {/* 상품 정보 */}
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* 수량 & 소계 */}
      <div className="flex flex-col items-end gap-3 sm:w-48">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-16 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
        <div className="space-y-1 text-right">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-8 w-16 rounded" />
      </div>
    </div>
  );
}

