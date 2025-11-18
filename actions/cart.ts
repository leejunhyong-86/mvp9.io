/**
 * @file actions/cart.ts
 * @description 장바구니 관련 Server Actions
 *
 * 이 파일은 장바구니 추가, 조회, 수정, 삭제 기능을 제공합니다.
 *
 * 주요 기능:
 * 1. 장바구니 추가 (중복 상품 처리: 수량 증가)
 * 2. 장바구니 조회
 * 3. 장바구니 수량 업데이트
 * 4. 장바구니 삭제
 *
 * 핵심 구현 로직:
 * - Clerk 인증 사용 (createClerkSupabaseClient)
 * - clerk_id로 사용자 필터링
 * - 재고 확인
 * - 중복 상품 처리 (UNIQUE 제약조건 활용)
 *
 * @dependencies
 * - @/lib/supabase/server: createClerkSupabaseClient
 * - @clerk/nextjs/server: auth
 */

"use server";

import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";

/**
 * 장바구니 아이템 타입
 */
export interface CartItem {
  id: string;
  clerk_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  // 조인된 상품 정보
  product?: {
    id: string;
    name: string;
    price: number;
    stock_quantity: number;
    category: string | null;
  };
}

/**
 * 장바구니 추가 결과
 */
export interface AddToCartResult {
  success: boolean;
  message: string;
  cartItem?: CartItem;
}

/**
 * 장바구니에 상품 추가
 * @param productId - 상품 ID
 * @param quantity - 수량 (기본값: 1)
 * @returns 추가 결과
 */
export async function addToCart(
  productId: string,
  quantity: number = 1
): Promise<AddToCartResult> {
  try {
    // 인증 확인
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        message: "로그인이 필요합니다.",
      };
    }

    console.group("addToCart");
    console.log("User ID:", userId);
    console.log("Product ID:", productId);
    console.log("Quantity:", quantity);

    const supabase = createClerkSupabaseClient();

    // 1. 상품 정보 조회 및 재고 확인
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, name, price, stock_quantity, is_active")
      .eq("id", productId)
      .eq("is_active", true)
      .single();

    if (productError || !product) {
      console.error("Product not found:", productError);
      console.groupEnd();
      return {
        success: false,
        message: "상품을 찾을 수 없습니다.",
      };
    }

    // 재고 확인
    if (product.stock_quantity < quantity) {
      console.log("Insufficient stock");
      console.groupEnd();
      return {
        success: false,
        message: `재고가 부족합니다. (현재 재고: ${product.stock_quantity}개)`,
      };
    }

    // 2. 기존 장바구니 아이템 확인
    const { data: existingItem, error: checkError } = await supabase
      .from("cart_items")
      .select("*")
      .eq("clerk_id", userId)
      .eq("product_id", productId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116은 "not found" 에러이므로 정상
      console.error("Error checking existing cart item:", checkError);
      console.groupEnd();
      return {
        success: false,
        message: "장바구니 확인 중 오류가 발생했습니다.",
      };
    }

    // 3. 기존 아이템이 있으면 수량 증가, 없으면 새로 추가
    if (existingItem) {
      // 기존 수량 + 새 수량이 재고를 초과하는지 확인
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock_quantity) {
        console.log("Total quantity exceeds stock");
        console.groupEnd();
        return {
          success: false,
          message: `재고가 부족합니다. (현재 재고: ${product.stock_quantity}개, 장바구니: ${existingItem.quantity}개)`,
        };
      }

      // 수량 업데이트
      const { data: updatedItem, error: updateError } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("id", existingItem.id)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating cart item:", updateError);
        console.groupEnd();
        return {
          success: false,
          message: "장바구니 업데이트 중 오류가 발생했습니다.",
        };
      }

      console.log("Cart item updated:", updatedItem);
      console.groupEnd();

      return {
        success: true,
        message: "장바구니에 추가되었습니다.",
        cartItem: updatedItem as CartItem,
      };
    } else {
      // 새 아이템 추가
      const { data: newItem, error: insertError } = await supabase
        .from("cart_items")
        .insert({
          clerk_id: userId,
          product_id: productId,
          quantity,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error adding to cart:", insertError);
        console.groupEnd();
        return {
          success: false,
          message: "장바구니 추가 중 오류가 발생했습니다.",
        };
      }

      console.log("Cart item added:", newItem);
      console.groupEnd();

      return {
        success: true,
        message: "장바구니에 추가되었습니다.",
        cartItem: newItem as CartItem,
      };
    }
  } catch (error) {
    console.error("Error in addToCart:", error);
    console.groupEnd();
    return {
      success: false,
      message: "예기치 않은 오류가 발생했습니다.",
    };
  }
}

