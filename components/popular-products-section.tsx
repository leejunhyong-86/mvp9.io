/**
 * @file components/popular-products-section.tsx
 * @description 인기 상품 섹션 컴포넌트
 *
 * 이 컴포넌트는 홈페이지 상단에 표시되는 인기 상품 섹션입니다.
 *
 * 주요 기능:
 * 1. 인기 상품 목록 표시 (최대 8개)
 * 2. 반응형 그리드 레이아웃
 * 3. 상품 카드 컴포넌트 재사용
 *
 * 핵심 구현 로직:
 * - ProductCard 컴포넌트를 사용하여 일관된 UI 제공
 * - Tailwind CSS로 반응형 레이아웃 구현
 * - 빈 상태 처리
 *
 * @dependencies
 * - @/actions/products: Product 타입
 * - @/components/product-card: ProductCard 컴포넌트
 */

import { Product } from "@/actions/products";
import { ProductCard } from "@/components/product-card";

interface PopularProductsSectionProps {
  products: Product[];
}

export function PopularProductsSection({
  products,
}: PopularProductsSectionProps) {
  if (products.length === 0) {
    return null; // 인기 상품이 없으면 섹션 숨김
  }

  return (
    <section className="space-y-6">
      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">🔥 인기 상품</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            지금 가장 인기있는 상품을 만나보세요
          </p>
        </div>
      </div>

      {/* 상품 그리드 */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

