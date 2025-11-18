/**
 * @file components/skeletons/section-header-skeleton.tsx
 * @description 섹션 헤더 스켈레톤 컴포넌트
 *
 * 페이지 섹션의 제목과 설명이 로딩 중일 때 표시되는 스켈레톤 UI입니다.
 *
 * @dependencies
 * - @/components/ui/skeleton: Skeleton 컴포넌트
 */

import { Skeleton } from "@/components/ui/skeleton";

interface SectionHeaderSkeletonProps {
  showDescription?: boolean;
}

export function SectionHeaderSkeleton({
  showDescription = true,
}: SectionHeaderSkeletonProps) {
  return (
    <div className="space-y-2">
      {/* 제목 */}
      <Skeleton className="h-8 w-48" />
      {/* 설명 (선택적) */}
      {showDescription && <Skeleton className="h-5 w-64" />}
    </div>
  );
}

