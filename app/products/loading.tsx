/**
 * @file app/products/loading.tsx
 * @description 상품 목록 페이지 로딩 스켈레톤
 *
 * 이 컴포넌트는 상품 목록 페이지가 로딩 중일 때 표시되는 스켈레톤 UI입니다.
 *
 * 주요 기능:
 * 1. 페이지 헤더 스켈레톤
 * 2. 필터 섹션 스켈레톤
 * 3. 상품 그리드 스켈레톤 (12개)
 * 4. 페이지네이션 스켈레톤
 *
 * 핵심 구현 로직:
 * - Next.js 15의 loading.tsx 파일 규칙 활용
 * - Suspense boundary로 자동 래핑됨
 * - 실제 페이지 레이아웃과 동일한 구조
 *
 * @dependencies
 * - @/components/ui/skeleton: Skeleton 컴포넌트
 */

import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <main className="min-h-[calc(100vh-80px)] px-8 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* 페이지 헤더 스켈레톤 */}
        <div>
          <Skeleton className="h-9 w-32" />
          <Skeleton className="mt-2 h-5 w-48" />
        </div>

        {/* 필터 섹션 스켈레톤 */}
        <div className="space-y-6 rounded-lg border bg-card p-6">
          {/* 카테고리 필터 */}
          <div>
            <Skeleton className="mb-3 h-5 w-20" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-20" />
              ))}
            </div>
          </div>

          {/* 가격 범위 필터 */}
          <div>
            <Skeleton className="mb-3 h-5 w-16" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-24" />
              ))}
            </div>
          </div>

          {/* 정렬 옵션 */}
          <div>
            <Skeleton className="mb-3 h-5 w-12" />
            <Skeleton className="h-10 w-full sm:w-[180px]" />
          </div>
        </div>

        {/* 상품 그리드 스켈레톤 */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border bg-card shadow-sm"
            >
              {/* 상품 이미지 스켈레톤 */}
              <Skeleton className="aspect-square w-full rounded-t-lg" />

              {/* 상품 정보 스켈레톤 */}
              <div className="p-4 space-y-3">
                {/* 카테고리 */}
                <Skeleton className="h-4 w-16" />

                {/* 상품명 */}
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />

                {/* 가격 및 재고 */}
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 스켈레톤 */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-10" />
          ))}
        </div>
      </div>
    </main>
  );
}

