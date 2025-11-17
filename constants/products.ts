/**
 * @file constants/products.ts
 * @description 상품 관련 상수 정의
 *
 * 이 파일은 상품 목록 페이지에서 사용되는 상수들을 정의합니다.
 *
 * 주요 내용:
 * 1. 페이지네이션 설정
 * 2. 카테고리 목록 및 한글명
 * 3. 가격 범위 프리셋
 * 4. 정렬 옵션
 */

/**
 * 페이지당 표시할 상품 개수
 */
export const ITEMS_PER_PAGE = 12;

/**
 * 카테고리 타입
 */
export type CategoryType =
  | "all"
  | "electronics"
  | "clothing"
  | "books"
  | "food"
  | "sports"
  | "beauty"
  | "home";

/**
 * 카테고리 목록 및 한글명
 */
export const CATEGORIES = {
  all: "전체",
  electronics: "전자제품",
  clothing: "의류",
  books: "도서",
  food: "식품",
  sports: "스포츠",
  beauty: "뷰티",
  home: "생활/가정",
} as const;

/**
 * 가격 범위 타입
 */
export type PriceRangeType = "all" | "0-10000" | "10000-50000" | "50000+";

/**
 * 가격 범위 프리셋
 */
export const PRICE_RANGES: Record<
  PriceRangeType,
  { label: string; min?: number; max?: number }
> = {
  all: { label: "전체" },
  "0-10000": { label: "~1만원", min: 0, max: 10000 },
  "10000-50000": { label: "1만원~5만원", min: 10000, max: 50000 },
  "50000+": { label: "5만원 이상", min: 50000 },
} as const;

/**
 * 정렬 옵션 타입
 */
export type SortOptionType = "latest" | "price-asc" | "price-desc";

/**
 * 정렬 옵션
 */
export const SORT_OPTIONS: Record<SortOptionType, string> = {
  latest: "최신순",
  "price-asc": "가격 낮은순",
  "price-desc": "가격 높은순",
} as const;

