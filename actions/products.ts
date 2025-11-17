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

