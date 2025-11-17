/**
 * @file app/page.tsx
 * @description 홈페이지 - 인기 상품 및 전체 상품 섹션
 *
 * 이 페이지는 쇼핑몰의 메인 홈페이지로, 인기 상품과 전체 상품을 표시합니다.
 *
 * 주요 기능:
 * 1. 인기 상품 섹션 (상단)
 * 2. 전체 상품 목록 및 카테고리 필터링 (하단)
 *
 * 핵심 구현 로직:
 * - Server Component에서 초기 상품 데이터 조회
 * - 인기 상품과 전체 상품을 병렬로 조회
 * - 각 섹션을 독립적인 컴포넌트로 분리
 *
 * @dependencies
 * - @/actions/products: getProducts, getPopularProducts
 * - @/components/popular-products-section: PopularProductsSection
 * - @/components/products-section: ProductsSection
 */

import { getProducts, getPopularProducts } from "@/actions/products";
import { PopularProductsSection } from "@/components/popular-products-section";
import { ProductsSection } from "@/components/products-section";

export default async function Home() {
  // Server Component에서 병렬로 데이터 조회
  const [popularProducts, allProducts] = await Promise.all([
    getPopularProducts(),
    getProducts(),
  ]);

  return (
    <main className="min-h-[calc(100vh-80px)] px-8 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl space-y-16">
        {/* 인기 상품 섹션 */}
        <PopularProductsSection products={popularProducts} />

        {/* 구분선 */}
        <div className="border-t" />

        {/* 전체 상품 섹션 */}
        <ProductsSection initialProducts={allProducts} />
      </div>
    </main>
  );
}
