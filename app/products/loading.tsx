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
 * - 재사용 가능한 스켈레톤 컴포넌트 활용
 *
 * @dependencies
 * - @/components/skeletons: 재사용 가능한 스켈레톤 컴포넌트들
 */

import {
  SectionHeaderSkeleton,
  FilterSkeleton,
  ProductsGridSkeleton,
  PaginationSkeleton,
} from "@/components/skeletons";

export default function ProductsLoading() {
  return (
    <main className="min-h-[calc(100vh-80px)] px-8 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* 페이지 헤더 스켈레톤 */}
        <SectionHeaderSkeleton showDescription />

        {/* 필터 섹션 스켈레톤 */}
        <FilterSkeleton />

        {/* 상품 그리드 스켈레톤 (12개) */}
        <ProductsGridSkeleton count={12} />

        {/* 페이지네이션 스켈레톤 */}
        <PaginationSkeleton />
      </div>
    </main>
  );
}

