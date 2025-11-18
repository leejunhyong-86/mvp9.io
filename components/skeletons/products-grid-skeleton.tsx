/**
 * @file components/skeletons/products-grid-skeleton.tsx
 * @description 상품 그리드 스켈레톤 컴포넌트
 *
 * 여러 개의 상품 카드가 그리드로 표시될 때의 스켈레톤 UI입니다.
 *
 * @dependencies
 * - @/components/skeletons/product-card-skeleton: ProductCardSkeleton
 */

import { ProductCardSkeleton } from "./product-card-skeleton";

interface ProductsGridSkeletonProps {
  count?: number;
}

export function ProductsGridSkeleton({ count = 8 }: ProductsGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

