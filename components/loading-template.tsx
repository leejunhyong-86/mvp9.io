/**
 * @file components/loading-template.tsx
 * @description 범용 로딩 템플릿 컴포넌트
 *
 * 다양한 페이지에서 재사용 가능한 로딩 UI 템플릿입니다.
 * 간단한 페이지나 특별한 스켈레톤이 필요 없는 페이지에서 사용합니다.
 *
 * @dependencies
 * - @/components/ui/skeleton: Skeleton 컴포넌트
 */

import { Skeleton } from "@/components/ui/skeleton";

export function LoadingTemplate() {
  return (
    <main className="min-h-[calc(100vh-80px)] px-8 py-16 lg:py-24">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* 페이지 헤더 */}
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>

        {/* 콘텐츠 영역 */}
        <div className="space-y-4 rounded-lg border bg-card p-6">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-4/6" />
          <div className="pt-4">
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    </main>
  );
}

