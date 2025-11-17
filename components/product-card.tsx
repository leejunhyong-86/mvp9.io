/**
 * @file components/product-card.tsx
 * @description 상품 카드 컴포넌트
 *
 * 이 컴포넌트는 상품 정보를 카드 형태로 표시합니다.
 *
 * 주요 기능:
 * 1. 상품 이미지 표시 (임시 플레이스홀더)
 * 2. 상품명, 가격, 카테고리 표시
 * 3. 클릭 시 상품 상세 페이지로 이동
 *
 * 핵심 구현 로직:
 * - Next.js Link를 사용하여 상품 상세 페이지로 이동
 * - 가격은 천 단위 구분 기호로 포맷팅
 * - 카테고리 한글명 매핑
 *
 * @dependencies
 * - next/link: 페이지 네비게이션
 * - @/components/ui/button: shadcn/ui Button 컴포넌트
 * - @/actions/products: Product 타입
 */

import Link from "next/link";
import { Product } from "@/actions/products";
import { cn } from "@/lib/utils";

/**
 * 카테고리 영문명 → 한글명 매핑
 */
const categoryMap: Record<string, string> = {
  electronics: "전자제품",
  clothing: "의류",
  books: "도서",
  food: "식품",
  sports: "스포츠",
  beauty: "뷰티",
  home: "생활/가정",
};

/**
 * 가격을 천 단위 구분 기호로 포맷팅
 */
function formatPrice(price: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(price);
}

/**
 * 카테고리 한글명 반환
 */
function getCategoryName(category: string | null): string {
  if (!category) return "기타";
  return categoryMap[category] || category;
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className={cn(
        "group block rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md",
        className
      )}
    >
      {/* 상품 이미지 (임시 플레이스홀더) */}
      <div className="aspect-square w-full overflow-hidden rounded-t-lg bg-muted">
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
          <span className="text-4xl text-muted-foreground/50">📦</span>
        </div>
      </div>

      {/* 상품 정보 */}
      <div className="p-4">
        {/* 카테고리 */}
        {product.category && (
          <span className="text-xs text-muted-foreground">
            {getCategoryName(product.category)}
          </span>
        )}

        {/* 상품명 */}
        <h3 className="mt-1 line-clamp-2 font-semibold leading-tight group-hover:text-primary">
          {product.name}
        </h3>

        {/* 상품 설명 (선택적) */}
        {product.description && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {product.description}
          </p>
        )}

        {/* 가격 및 재고 */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {product.stock_quantity > 0 && (
            <span className="text-xs text-muted-foreground">
              재고 {product.stock_quantity}개
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

