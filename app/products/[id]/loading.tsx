/**
 * @file app/products/[id]/loading.tsx
 * @description 상품 상세 페이지 로딩 스켈레톤
 *
 * 상품 상세 페이지가 로딩 중일 때 표시되는 스켈레톤 UI입니다.
 *
 * 주요 구성:
 * - 2열 그리드 레이아웃 (데스크톱: 이미지 60% | 정보 40%, 모바일: 세로 스택)
 * - 왼쪽: 이미지 갤러리 스켈레톤 (메인 + 썸네일)
 * - 오른쪽: 상품명, 가격, 재고, 카테고리, 설명, 장바구니 UI, 등록일 스켈레톤
 *
 * @dependencies
 * - @/components/ui/skeleton: Skeleton 컴포넌트
 */

import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <main className="min-h-[calc(100vh-80px)] px-8 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* 2열 그리드 레이아웃 */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[60%_40%]">
          {/* 왼쪽 열: 이미지 갤러리 스켈레톤 */}
          <div className="w-full space-y-4">
            {/* 메인 이미지 스켈레톤 */}
            <Skeleton className="aspect-square w-full rounded-lg" />

            {/* 썸네일 갤러리 스켈레톤 */}
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-20 rounded-lg" />
              ))}
            </div>
          </div>

          {/* 오른쪽 열: 상품 정보 스켈레톤 */}
          <div className="flex flex-col space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* 상품명 스켈레톤 */}
            <Skeleton className="h-10 w-3/4 lg:h-12" />

            {/* 가격 스켈레톤 */}
            <Skeleton className="h-10 w-40" />

            {/* 재고 상태 스켈레톤 */}
            <Skeleton className="h-8 w-32" />

            {/* 카테고리 뱃지 스켈레톤 */}
            <Skeleton className="h-6 w-20" />

            {/* 상품 설명 스켈레톤 */}
            <div className="space-y-3">
              {/* 제목 */}
              <Skeleton className="h-6 w-24" />
              {/* 설명 내용 (여러 줄) */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>

            {/* 장바구니 UI 스켈레톤 */}
            <div className="mt-6 rounded-lg border bg-card p-6">
              <div className="space-y-4">
                {/* 수량 선택 스켈레톤 */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-9" />
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-9" />
                    <Skeleton className="ml-auto h-4 w-20" />
                  </div>
                </div>

                {/* 총 금액 스켈레톤 */}
                <Skeleton className="h-20 w-full rounded-lg" />

                {/* 장바구니 버튼 스켈레톤 */}
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            {/* 등록일/수정일 스켈레톤 */}
            <div className="mt-auto space-y-2 pt-4">
              <div className="flex flex-wrap items-center gap-4">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

