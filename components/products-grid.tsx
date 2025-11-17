/**
 * @file components/products-grid.tsx
 * @description 상품 그리드 컴포넌트
 *
 * 이 컴포넌트는 상품 목록을 그리드 형태로 표시합니다.
 *
 * 주요 기능:
 * 1. 반응형 그리드 레이아웃
 * 2. 빈 상태 처리
 * 3. ProductCard 재사용
 *
 * 핵심 구현 로직:
 * - Tailwind CSS grid를 사용한 반응형 레이아웃
 * - 상품이 없을 때 안내 메시지 표시
 *
 * @dependencies
 * - @/actions/products: Product 타입
 * - @/components/product-card: ProductCard 컴포넌트
 */

import { Product } from "@/actions/products";
import { ProductCard } from "@/components/product-card";
import { Package } from "lucide-react";

interface ProductsGridProps {
  products: Product[];
}

export function ProductsGrid({ products }: ProductsGridProps) {
  // 빈 상태 처리
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Package className="h-16 w-16 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">상품이 없습니다</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          다른 필터 조건을 시도해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

