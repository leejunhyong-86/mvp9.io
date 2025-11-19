/**
 * @file app/products/[id]/page.tsx
 * @description 상품 상세 페이지
 *
 * 이 페이지는 개별 상품의 상세 정보를 표시합니다.
 *
 * 주요 기능:
 * 1. 2열 레이아웃 (데스크톱: 이미지 60% | 정보 40%, 모바일: 세로 스택)
 * 2. 왼쪽: 상품 이미지 플레이스홀더
 * 3. 오른쪽: 상품명, 가격, 재고, 카테고리, 설명, 등록일
 *
 * 핵심 구현 로직:
 * - Dynamic Route로 상품 ID 받기
 * - getProductById Server Action으로 상품 조회
 * - 404 처리 (상품이 없을 경우)
 * - 반응형 2열 그리드 레이아웃
 *
 * @dependencies
 * - @/actions/products: getProductById, Product
 * - @/components/ui/badge: Badge
 * - next/navigation: notFound
 */

import { getProductById } from "@/actions/products";
import { Badge } from "@/components/ui/badge";
import { ProductImageGallery } from "@/components/product-image-gallery";
import { AddToCartSection } from "@/components/add-to-cart-section";
import { notFound } from "next/navigation";

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

/**
 * 날짜를 한국어 형식으로 포맷팅 (YYYY년 MM월 DD일)
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}년 ${month}월 ${day}일`;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  // Next.js 15: params는 Promise
  const { id } = await params;

  console.group("ProductDetailPage");
  console.log("Product ID:", id);

  // 상품 정보 조회
  const product = await getProductById(id);

  // 상품이 없으면 404 페이지로
  if (!product) {
    console.log("Product not found, showing 404");
    console.groupEnd();
    notFound();
  }

  console.log("Product loaded:", product.name);
  console.groupEnd();

  // 재고 상태 판단
  const isInStock = product.stock_quantity > 0;

  return (
    <main className="min-h-[calc(100vh-80px)] px-8 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* 2열 그리드 레이아웃 */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[60%_40%]">
          {/* 왼쪽 열: 이미지 갤러리 */}
          <div className="w-full">
            <ProductImageGallery />
          </div>

          {/* 오른쪽 열: 상품 정보 + 장바구니 UI */}
          <div className="flex flex-col space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* 상품명 */}
            <h1 className="text-3xl font-bold leading-tight lg:text-4xl">
              {product.name}
            </h1>

            {/* 가격 */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
            </div>

            {/* 재고 상태 */}
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                  isInStock
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
              >
                {isInStock ? (
                  <>
                    <svg
                      className="-ml-0.5 mr-1.5 h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    재고 있음 ({product.stock_quantity}개)
                  </>
                ) : (
                  <>
                    <svg
                      className="-ml-0.5 mr-1.5 h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    품절
                  </>
                )}
              </span>
            </div>

            {/* 카테고리 뱃지 */}
            {product.category && (
              <div>
                <Badge variant="secondary" className="text-sm">
                  {getCategoryName(product.category)}
                </Badge>
              </div>
            )}

            {/* 상품 설명 */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">상품 설명</h2>
              {product.description ? (
                <p className="leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {product.description}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  상품 설명이 없습니다.
                </p>
              )}
            </div>

            {/* 장바구니 UI */}
            <div className="mt-6 rounded-lg border bg-card p-6">
              <AddToCartSection
                productId={product.id}
                productName={product.name}
                price={product.price}
                stockQuantity={product.stock_quantity}
              />
            </div>

            {/* 등록일/수정일 */}
            <div className="mt-auto space-y-2 pt-4">
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span>등록일: {formatDate(product.created_at)}</span>
                {product.created_at !== product.updated_at && (
                  <span>수정일: {formatDate(product.updated_at)}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

