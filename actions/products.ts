/**
 * @file actions/products.ts
 * @description 상품 관련 Server Actions
 *
 * 이 파일은 Supabase에서 상품 데이터를 조회하는 Server Actions를 제공합니다.
 *
 * 주요 기능:
 * 1. 활성화된 모든 상품 조회
 * 2. 카테고리별 상품 조회
 *
 * 핵심 구현 로직:
 * - Supabase 클라이언트를 사용하여 products 테이블 조회
 * - is_active = true인 상품만 필터링
 * - 에러 처리 및 타입 안정성 보장
 *
 * @dependencies
 * - @supabase/supabase-js: createClient (공개 클라이언트 사용)
 */

"use server";

import { createClient } from "@supabase/supabase-js";

/**
 * 공개 상품 조회용 Supabase 클라이언트 생성
 * 홈페이지는 공개 페이지이므로 인증 없이 조회 가능
 */
function createPublicSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(supabaseUrl, supabaseKey);
}

/**
 * 상품 타입 정의
 */
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * 모든 활성화된 상품 조회
 * @returns 활성화된 상품 목록
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const supabase = createPublicSupabaseClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      throw new Error(`상품 조회 실패: ${error.message}`);
    }

    return (data as Product[]) || [];
  } catch (error) {
    console.error("Error in getProducts:", error);
    throw error;
  }
}

/**
 * 카테고리별 상품 조회
 * @param category - 조회할 카테고리 (예: 'electronics', 'clothing')
 * @returns 해당 카테고리의 활성화된 상품 목록
 */
export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  try {
    const supabase = createPublicSupabaseClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .eq("category", category)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products by category:", error);
      throw new Error(`카테고리별 상품 조회 실패: ${error.message}`);
    }

    return (data as Product[]) || [];
  } catch (error) {
    console.error("Error in getProductsByCategory:", error);
    throw error;
  }
}

/**
 * 인기 상품 조회
 * MVP 버전: 최근 생성된 상품 8개를 인기 상품으로 표시
 * 추후 판매량, 조회수 등의 지표로 변경 가능
 * @returns 인기 상품 목록 (최대 8개)
 */
export async function getPopularProducts(): Promise<Product[]> {
  try {
    const supabase = createPublicSupabaseClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(8);

    if (error) {
      console.error("Error fetching popular products:", error);
      throw new Error(`인기 상품 조회 실패: ${error.message}`);
    }

    return (data as Product[]) || [];
  } catch (error) {
    console.error("Error in getPopularProducts:", error);
    throw error;
  }
}

/**
 * 필터 및 페이지네이션 옵션
 */
export interface ProductFilters {
  page?: number;
  category?: string;
  priceRange?: "all" | "0-10000" | "10000-50000" | "50000+";
  sortBy?: "latest" | "price-asc" | "price-desc";
}

/**
 * 필터된 상품 조회 결과
 */
export interface ProductsResult {
  products: Product[];
  totalCount: number;
  totalPages: number;
}

/**
 * 페이지당 상품 개수
 */
const ITEMS_PER_PAGE = 12;

/**
 * 필터 및 페이지네이션을 적용한 상품 조회
 * @param filters - 필터 옵션
 * @returns 상품 목록, 총 개수, 총 페이지 수
 */
export async function getProductsWithFilters(
  filters: ProductFilters = {}
): Promise<ProductsResult> {
  try {
    const supabase = createPublicSupabaseClient();

    const {
      page = 1,
      category,
      priceRange,
      sortBy = "latest",
    } = filters;

    console.group("getProductsWithFilters");
    console.log("Filters:", filters);

    // 쿼리 빌더 시작
    let query = supabase
      .from("products")
      .select("*", { count: "exact" })
      .eq("is_active", true);

    // 카테고리 필터 적용
    if (category && category !== "all") {
      query = query.eq("category", category);
      console.log("Category filter applied:", category);
    }

    // 가격 범위 필터 적용
    if (priceRange && priceRange !== "all") {
      if (priceRange === "0-10000") {
        query = query.gte("price", 0).lte("price", 10000);
        console.log("Price range: 0-10000");
      } else if (priceRange === "10000-50000") {
        query = query.gte("price", 10000).lte("price", 50000);
        console.log("Price range: 10000-50000");
      } else if (priceRange === "50000+") {
        query = query.gte("price", 50000);
        console.log("Price range: 50000+");
      }
    }

    // 정렬 적용
    if (sortBy === "latest") {
      query = query.order("created_at", { ascending: false });
    } else if (sortBy === "price-asc") {
      query = query.order("price", { ascending: true });
    } else if (sortBy === "price-desc") {
      query = query.order("price", { ascending: false });
    }
    console.log("Sort applied:", sortBy);

    // 페이지네이션 적용
    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;
    query = query.range(from, to);
    console.log(`Pagination: page ${page}, range ${from}-${to}`);

    // 쿼리 실행
    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching products with filters:", error);
      throw new Error(`상품 조회 실패: ${error.message}`);
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    console.log(`Results: ${data?.length || 0} products, ${totalCount} total, ${totalPages} pages`);
    console.groupEnd();

    return {
      products: (data as Product[]) || [],
      totalCount,
      totalPages,
    };
  } catch (error) {
    console.error("Error in getProductsWithFilters:", error);
    throw error;
  }
}

