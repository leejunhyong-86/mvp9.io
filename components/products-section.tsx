/**
 * @file components/products-section.tsx
 * @description 상품 섹션 컴포넌트 (클라이언트 컴포넌트)
 *
 * 이 컴포넌트는 상품 목록과 카테고리 필터링 기능을 제공하는 클라이언트 컴포넌트입니다.
 *
 * 주요 기능:
 * 1. 카테고리 필터 버튼 그룹
 * 2. 클라이언트 사이드 필터링
 * 3. 필터링된 상품 그리드 레이아웃
 *
 * 핵심 구현 로직:
 * - useState로 선택된 카테고리 상태 관리
 * - useMemo로 필터링된 상품 목록 계산
 * - 카테고리별 필터링 로직
 *
 * @dependencies
 * - react: useState, useMemo
 * - @/actions/products: Product 타입
 * - @/components/product-card: ProductCard 컴포넌트
 * - @/components/ui/button: shadcn/ui Button 컴포넌트
 */

"use client";

import { useState, useMemo } from "react";
import { Product } from "@/actions/products";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * 카테고리 옵션 정의
 */
const CATEGORIES = [
  { value: "all", label: "전체" },
  { value: "electronics", label: "전자제품" },
  { value: "clothing", label: "의류" },
  { value: "books", label: "도서" },
  { value: "food", label: "식품" },
  { value: "sports", label: "스포츠" },
  { value: "beauty", label: "뷰티" },
  { value: "home", label: "생활/가정" },
] as const;

interface ProductsSectionProps {
  initialProducts: Product[];
}

export function ProductsSection({ initialProducts }: ProductsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // 필터링된 상품 목록 계산
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") {
      return initialProducts;
    }
    return initialProducts.filter(
      (product) => product.category === selectedCategory
    );
  }, [initialProducts, selectedCategory]);

  return (
    <section className="space-y-8">
      {/* 섹션 헤더 */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">전체 상품</h1>

        {/* 카테고리 필터 버튼 그룹 */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
              className={cn(
                "transition-all",
                selectedCategory === category.value &&
                  "bg-primary text-primary-foreground"
              )}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* 상품 그리드 */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-muted-foreground">
          <p>선택한 카테고리에 상품이 없습니다.</p>
        </div>
      )}
    </section>
  );
}

