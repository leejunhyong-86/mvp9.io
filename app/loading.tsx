/**
 * @file app/loading.tsx
 * @description 홈페이지 로딩 스켈레톤
 *
 * 홈페이지가 로딩 중일 때 표시되는 스켈레톤 UI입니다.
 * Next.js 15의 loading.tsx 파일 규칙을 활용합니다.
 *
 * 주요 구성:
 * 1. 인기 상품 섹션 스켈레톤
 * 2. 구분선
 * 3. 전체 상품 섹션 스켈레톤 (필터 포함)
 *
 * 핵심 구현 로직:
 * - Next.js 15의 loading.tsx 파일 규칙 활용
 * - Suspense boundary로 자동 래핑됨
 * - 실제 페이지 레이아웃과 동일한 구조
 *
 * @dependencies
 * - @/components/skeletons: 재사용 가능한 스켈레톤 컴포넌트들
 */

import {
  SectionHeaderSkeleton,
  ProductsGridSkeleton,
} from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <main className="min-h-[calc(100vh-80px)] px-8 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl space-y-16">
        {/* 인기 상품 섹션 스켈레톤 */}
        <section className="space-y-8">
          {/* 섹션 헤더 */}
          <SectionHeaderSkeleton showDescription />

          {/* 상품 그리드 (8개) */}
          <ProductsGridSkeleton count={8} />
        </section>

        {/* 구분선 */}
        <div className="border-t" />

        {/* 전체 상품 섹션 스켈레톤 */}
        <section className="space-y-8">
          {/* 섹션 헤더 */}
          <SectionHeaderSkeleton showDescription />

          {/* 카테고리 필터 버튼들 */}
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-24" />
            ))}
          </div>

          {/* 상품 그리드 (8개) */}
          <ProductsGridSkeleton count={8} />
        </section>
      </div>
    </main>
  );
}

