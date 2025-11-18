/**
 * @file components/skeletons/pagination-skeleton.tsx
 * @description 페이지네이션 스켈레톤 컴포넌트
 *
 * 페이지네이션이 로딩 중일 때 표시되는 스켈레톤 UI입니다.
 *
 * @dependencies
 * - @/components/ui/skeleton: Skeleton 컴포넌트
 */

import { Skeleton } from "@/components/ui/skeleton";

export function PaginationSkeleton() {
  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      {Array.from({ length: 7 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-10" />
      ))}
    </div>
  );
}

