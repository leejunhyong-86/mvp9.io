/**
 * @file components/products-filter.tsx
 * @description 상품 필터 컴포넌트
 *
 * 이 컴포넌트는 상품 목록의 필터링 및 정렬 기능을 제공합니다.
 *
 * 주요 기능:
 * 1. 카테고리 필터 (버튼 그룹)
 * 2. 가격 범위 필터 (버튼 그룹)
 * 3. 정렬 옵션 (Select 드롭다운)
 * 4. URL 쿼리 파라미터 동기화
 *
 * 핵심 구현 로직:
 * - useRouter와 useSearchParams를 사용한 URL 업데이트
 * - 필터 변경 시 페이지를 1로 리셋
 * - 현재 선택된 필터 하이라이트
 *
 * @dependencies
 * - next/navigation: useRouter, useSearchParams
 * - @/components/ui/button: Button 컴포넌트
 * - @/components/ui/select: Select 컴포넌트
 * - @/constants/products: 상수 정의
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CATEGORIES,
  PRICE_RANGES,
  SORT_OPTIONS,
  type CategoryType,
  type PriceRangeType,
  type SortOptionType,
} from "@/constants/products";

export function ProductsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // 현재 필터 상태 가져오기
  const currentCategory = (searchParams.get("category") ||
    "all") as CategoryType;
  const currentPriceRange = (searchParams.get("priceRange") ||
    "all") as PriceRangeType;
  const currentSort = (searchParams.get("sort") || "latest") as SortOptionType;

  /**
   * URL 파라미터 업데이트 함수
   */
  const updateParams = (key: string, value: string) => {
    console.log(`ProductsFilter: Updating ${key} to ${value}`);
    const params = new URLSearchParams(searchParams.toString());

    // 값이 기본값이면 파라미터 제거
    if (
      (key === "category" && value === "all") ||
      (key === "priceRange" && value === "all") ||
      (key === "sort" && value === "latest")
    ) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    // 필터 변경 시 페이지를 1로 리셋
    params.delete("page");

    // useTransition으로 래핑하여 로딩 상태 관리
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  /**
   * 카테고리 변경 핸들러
   */
  const handleCategoryChange = (category: CategoryType) => {
    updateParams("category", category);
  };

  /**
   * 가격 범위 변경 핸들러
   */
  const handlePriceRangeChange = (priceRange: PriceRangeType) => {
    updateParams("priceRange", priceRange);
  };

  /**
   * 정렬 변경 핸들러
   */
  const handleSortChange = (sort: SortOptionType) => {
    updateParams("sort", sort);
  };

  return (
    <div className="space-y-6 rounded-lg border bg-card p-6 relative">
      {/* 로딩 오버레이 */}
      {isPending && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            로딩 중...
          </div>
        </div>
      )}

      {/* 카테고리 필터 */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">카테고리</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(CATEGORIES).map(([key, label]) => (
            <Button
              key={key}
              variant={currentCategory === key ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(key as CategoryType)}
              disabled={isPending}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* 가격 범위 필터 */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">가격대</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(PRICE_RANGES).map(([key, { label }]) => (
            <Button
              key={key}
              variant={currentPriceRange === key ? "default" : "outline"}
              size="sm"
              onClick={() => handlePriceRangeChange(key as PriceRangeType)}
              disabled={isPending}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* 정렬 옵션 */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">정렬</h3>
        <Select 
          value={currentSort} 
          onValueChange={handleSortChange}
          disabled={isPending}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="정렬 방식 선택" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(SORT_OPTIONS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

