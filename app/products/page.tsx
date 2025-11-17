/**
 * @file app/products/page.tsx
 * @description 상품 목록 페이지
 *
 * 이 페이지는 필터링, 정렬, 페이지네이션 기능을 갖춘 상품 목록을 표시합니다.
 *
 * 주요 기능:
 * 1. URL 쿼리 파라미터 기반 필터링 및 페이지네이션
 * 2. 카테고리 및 가격 범위 필터
 * 3. 정렬 옵션 (최신순, 가격순)
 * 4. 반응형 그리드 레이아웃
 *
 * 핵심 구현 로직:
 * - Server Component에서 searchParams 파싱
 * - getProductsWithFilters Server Action 호출
 * - 필터, 그리드, 페이지네이션 컴포넌트 조합
 *
 * @dependencies
 * - @/actions/products: getProductsWithFilters
 * - @/components/products-filter: ProductsFilter
 * - @/components/products-grid: ProductsGrid
 * - @/components/pagination: Pagination
 */

import { getProductsWithFilters } from "@/actions/products";
import { ProductsFilter } from "@/components/products-filter";
import { ProductsGrid } from "@/components/products-grid";
import { Pagination } from "@/components/pagination";

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    priceRange?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage(props: ProductsPageProps) {
  // Next.js 15: searchParams는 Promise
  const searchParams = await props.searchParams;

  // searchParams 파싱
  const page = parseInt(searchParams.page || "1", 10);
  const category = searchParams.category;
  const priceRange = searchParams.priceRange as
    | "0-10000"
    | "10000-50000"
    | "50000+"
    | undefined;
  const sortBy = (searchParams.sort || "latest") as
    | "latest"
    | "price-asc"
    | "price-desc";

  console.group("ProductsPage");
  console.log("SearchParams:", {
    page,
    category,
    priceRange,
    sortBy,
  });

  // 상품 데이터 조회
  const { products, totalCount, totalPages } = await getProductsWithFilters({
    page,
    category,
    priceRange,
    sortBy,
  });

  console.log(`Loaded ${products.length} products`);
  console.groupEnd();

  return (
    <main className="min-h-[calc(100vh-80px)] px-8 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* 페이지 헤더 */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">전체 상품</h1>
          <p className="mt-2 text-muted-foreground">
            총 {totalCount}개의 상품이 있습니다
          </p>
        </div>

        {/* 필터 */}
        <ProductsFilter />

        {/* 상품 그리드 */}
        <ProductsGrid products={products} />

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination currentPage={page} totalPages={totalPages} />
          </div>
        )}
      </div>
    </main>
  );
}

