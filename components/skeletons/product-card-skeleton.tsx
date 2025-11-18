/**
 * @file components/skeletons/product-card-skeleton.tsx
 * @description 상품 카드 스켈레톤 컴포넌트
 *
 * 상품 카드가 로딩 중일 때 표시되는 스켈레톤 UI입니다.
 * ProductCard 컴포넌트와 동일한 레이아웃을 가집니다.
 *
 * 주요 구성:
 * - 상품 이미지 영역 (정사각형)
 * - 카테고리 뱃지
 * - 상품명 (2줄)
 * - 가격 및 재고 정보
 *
 * @dependencies
 * - @/components/ui/skeleton: Skeleton 컴포넌트
 */

import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card shadow-sm">
      {/* 상품 이미지 스켈레톤 */}
      <Skeleton className="aspect-square w-full rounded-t-lg" />

      {/* 상품 정보 스켈레톤 */}
      <div className="space-y-3 p-4">
        {/* 카테고리 */}
        <Skeleton className="h-4 w-16" />

        {/* 상품명 (2줄) */}
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />

        {/* 가격 및 재고 */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

