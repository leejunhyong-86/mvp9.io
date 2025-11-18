/**
 * @file components/skeletons/filter-skeleton.tsx
 * @description 필터 섹션 스켈레톤 컴포넌트
 *
 * 상품 필터(카테고리, 가격, 정렬)가 로딩 중일 때 표시되는 스켈레톤 UI입니다.
 *
 * @dependencies
 * - @/components/ui/skeleton: Skeleton 컴포넌트
 */

import { Skeleton } from "@/components/ui/skeleton";

export function FilterSkeleton() {
  return (
    <div className="space-y-6 rounded-lg border bg-card p-6">
      {/* 카테고리 필터 */}
      <div>
        <Skeleton className="mb-3 h-5 w-20" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={`category-${i}`} className="h-9 w-20" />
          ))}
        </div>
      </div>

      {/* 가격 범위 필터 */}
      <div>
        <Skeleton className="mb-3 h-5 w-16" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={`price-${i}`} className="h-9 w-24" />
          ))}
        </div>
      </div>

      {/* 정렬 옵션 */}
      <div>
        <Skeleton className="mb-3 h-5 w-12" />
        <Skeleton className="h-10 w-full sm:w-[180px]" />
      </div>
    </div>
  );
}

