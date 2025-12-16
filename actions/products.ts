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
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase 환경 변수가 설정되지 않았습니다.\n" +
      "NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 .env 파일에 추가하거나\n" +
      "Vercel 대시보드의 Environment Variables에서 설정해주세요."
    );
  }

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
  images: string[] | null;
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
      console.error("Error fetching products:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw new Error(`상품 조회 실패: ${error.message}`);
    }

    return (data as Product[]) || [];
  } catch (error) {
    console.error("Error in getProducts:", error);
    // 빌드 타임 에러 방지: 빈 배열 반환
    return [];
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
      console.error("Error fetching popular products:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw new Error(`인기 상품 조회 실패: ${error.message}`);
    }

    return (data as Product[]) || [];
  } catch (error) {
    console.error("Error in getPopularProducts:", error);
    // 빌드 타임 에러 방지: 빈 배열 반환
    return [];
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
    // 빌드 타임 에러 방지: 빈 결과 반환
    return {
      products: [],
      totalCount: 0,
      totalPages: 0,
    };
  }
}

/**
 * ID로 단일 상품 조회
 * @param id - 상품 ID
 * @returns 상품 객체 또는 null (상품이 없을 경우)
 */
export async function getProductById(
  id: string
): Promise<Product | null> {
  try {
    const supabase = createPublicSupabaseClient();

    console.group("getProductById");
    console.log("Product ID:", id);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // 상품이 존재하지 않음
        console.log("Product not found");
        console.groupEnd();
        return null;
      }
      throw error;
    }

    console.log("Product found:", data?.name);
    console.groupEnd();

    return data as Product;
  } catch (error) {
    console.error("Error in getProductById:", error);
    console.groupEnd();
    // 빌드 타임 에러 방지: null 반환
    return null;
  }
}

/**
 * 상품 이미지 업로드 및 DB 업데이트
 *
 * @param productId - 상품 ID
 * @param imageUrls - 이미지 URL 배열
 * @returns 업데이트 결과
 */
export async function updateProductImages(
  productId: string,
  imageUrls: string[]
): Promise<{
  success: boolean;
  message?: string;
}> {
  "use server";

  try {
    console.group("🖼️ Update Product Images");
    console.log("Product ID:", productId);
    console.log("Image URLs:", imageUrls);

    const supabase = createPublicSupabaseClient();

    // 상품 존재 여부 확인
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("id")
      .eq("id", productId)
      .single();

    if (fetchError || !product) {
      console.error("Product not found:", fetchError);
      console.groupEnd();
      return {
        success: false,
        message: "상품을 찾을 수 없습니다.",
      };
    }

    // 이미지 URL 업데이트
    const { error: updateError } = await supabase
      .from("products")
      .update({ images: imageUrls })
      .eq("id", productId);

    if (updateError) {
      console.error("Update error:", updateError);
      console.groupEnd();
      return {
        success: false,
        message: updateError.message,
      };
    }

    console.log("✅ Images updated successfully");
    console.groupEnd();

    return {
      success: true,
      message: "이미지가 업데이트되었습니다.",
    };
  } catch (error) {
    console.error("Error in updateProductImages:", error);
    console.groupEnd();
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "이미지 업데이트 중 오류 발생",
    };
  }
}

