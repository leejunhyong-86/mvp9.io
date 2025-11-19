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

/**
 * 장바구니 아이템 목록 조회 결과
 */
export interface GetCartItemsResult {
  success: boolean;
  items: CartItem[];
  message?: string;
}

/**
 * 장바구니 아이템 목록 조회
 * @returns 장바구니 아이템 목록 (상품 정보 포함)
 */
export async function getCartItems(): Promise<GetCartItemsResult> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        items: [],
        message: "로그인이 필요합니다.",
      };
    }

    console.group("getCartItems");
    console.log("User ID:", userId);

    const supabase = createClerkSupabaseClient();

    // 장바구니 아이템 조회 (상품 정보 조인)
    const { data: items, error } = await supabase
      .from("cart_items")
      .select(
        `
        *,
        product:products (
          id,
          name,
          price,
          stock_quantity,
          category,
          is_active
        )
      `
      )
      .eq("clerk_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching cart items:", error);
      console.groupEnd();
      return {
        success: false,
        items: [],
        message: "장바구니 조회 중 오류가 발생했습니다.",
      };
    }

    console.log("Cart items fetched:", items?.length || 0);
    console.groupEnd();

    return {
      success: true,
      items: (items || []) as CartItem[],
    };
  } catch (error) {
    console.error("Error in getCartItems:", error);
    console.groupEnd();
    return {
      success: false,
      items: [],
      message: "예기치 않은 오류가 발생했습니다.",
    };
  }
}

/**
 * 장바구니 아이템 총 개수 조회
 * @returns 장바구니 아이템 총 개수 (수량 합계)
 */
export async function getCartCount(): Promise<number> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return 0;
    }

    console.group("getCartCount");
    console.log("User ID:", userId);

    const supabase = createClerkSupabaseClient();

    // 장바구니 아이템 수량 합계 조회
    const { data, error } = await supabase
      .from("cart_items")
      .select("quantity")
      .eq("clerk_id", userId);

    if (error) {
      console.error("Error fetching cart count:", error);
      console.groupEnd();
      return 0;
    }

    const totalCount = data?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    console.log("Cart count:", totalCount);
    console.groupEnd();

    return totalCount;
  } catch (error) {
    console.error("Error in getCartCount:", error);
    console.groupEnd();
    return 0;
  }
}

/**
 * 장바구니 아이템 수량 업데이트 결과
 */
export interface UpdateCartItemResult {
  success: boolean;
  message: string;
  cartItem?: CartItem;
}

/**
 * 장바구니 아이템 수량 업데이트
 * @param cartItemId - 장바구니 아이템 ID
 * @param quantity - 변경할 수량
 * @returns 업데이트 결과
 */
export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number
): Promise<UpdateCartItemResult> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        message: "로그인이 필요합니다.",
      };
    }

    console.group("updateCartItemQuantity");
    console.log("User ID:", userId);
    console.log("Cart Item ID:", cartItemId);
    console.log("New Quantity:", quantity);

    // 수량 검증
    if (quantity < 1) {
      console.log("Invalid quantity");
      console.groupEnd();
      return {
        success: false,
        message: "수량은 1개 이상이어야 합니다.",
      };
    }

    const supabase = createClerkSupabaseClient();

    // 1. 장바구니 아이템 조회 (상품 정보 포함)
    const { data: cartItem, error: fetchError } = await supabase
      .from("cart_items")
      .select(
        `
        *,
        product:products (
          id,
          stock_quantity,
          is_active
        )
      `
      )
      .eq("id", cartItemId)
      .eq("clerk_id", userId)
      .single();

    if (fetchError || !cartItem) {
      console.error("Cart item not found:", fetchError);
      console.groupEnd();
      return {
        success: false,
        message: "장바구니 아이템을 찾을 수 없습니다.",
      };
    }

    // 2. 상품 활성화 및 재고 확인
    const product = cartItem.product as any;
    if (!product?.is_active) {
      console.log("Product is not active");
      console.groupEnd();
      return {
        success: false,
        message: "판매 중단된 상품입니다.",
      };
    }

    if (quantity > product.stock_quantity) {
      console.log("Insufficient stock");
      console.groupEnd();
      return {
        success: false,
        message: `재고가 부족합니다. (현재 재고: ${product.stock_quantity}개)`,
      };
    }

    // 3. 수량 업데이트
    const { data: updatedItem, error: updateError } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", cartItemId)
      .eq("clerk_id", userId)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating cart item:", updateError);
      console.groupEnd();
      return {
        success: false,
        message: "수량 업데이트 중 오류가 발생했습니다.",
      };
    }

    console.log("Cart item updated:", updatedItem);
    console.groupEnd();

    return {
      success: true,
      message: "수량이 변경되었습니다.",
      cartItem: updatedItem as CartItem,
    };
  } catch (error) {
    console.error("Error in updateCartItemQuantity:", error);
    console.groupEnd();
    return {
      success: false,
      message: "예기치 않은 오류가 발생했습니다.",
    };
  }
}

/**
 * 장바구니 아이템 삭제 결과
 */
export interface RemoveCartItemResult {
  success: boolean;
  message: string;
}

/**
 * 장바구니 아이템 개별 삭제
 * @param cartItemId - 장바구니 아이템 ID
 * @returns 삭제 결과
 */
export async function removeCartItem(
  cartItemId: string
): Promise<RemoveCartItemResult> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        message: "로그인이 필요합니다.",
      };
    }

    console.group("removeCartItem");
    console.log("User ID:", userId);
    console.log("Cart Item ID:", cartItemId);

    const supabase = createClerkSupabaseClient();

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartItemId)
      .eq("clerk_id", userId);

    if (error) {
      console.error("Error removing cart item:", error);
      console.groupEnd();
      return {
        success: false,
        message: "장바구니 삭제 중 오류가 발생했습니다.",
      };
    }

    console.log("Cart item removed");
    console.groupEnd();

    return {
      success: true,
      message: "장바구니에서 삭제되었습니다.",
    };
  } catch (error) {
    console.error("Error in removeCartItem:", error);
    console.groupEnd();
    return {
      success: false,
      message: "예기치 않은 오류가 발생했습니다.",
    };
  }
}

/**
 * 장바구니 아이템 일괄 삭제 결과
 */
export interface RemoveCartItemsResult {
  success: boolean;
  message: string;
  deletedCount: number;
}

/**
 * 장바구니 아이템 일괄 삭제
 * @param cartItemIds - 장바구니 아이템 ID 배열
 * @returns 삭제 결과
 */
export async function removeCartItems(
  cartItemIds: string[]
): Promise<RemoveCartItemsResult> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        message: "로그인이 필요합니다.",
        deletedCount: 0,
      };
    }

    console.group("removeCartItems");
    console.log("User ID:", userId);
    console.log("Cart Item IDs:", cartItemIds);

    if (cartItemIds.length === 0) {
      console.log("No items to delete");
      console.groupEnd();
      return {
        success: true,
        message: "삭제할 아이템이 없습니다.",
        deletedCount: 0,
      };
    }

    const supabase = createClerkSupabaseClient();

    const { error, count } = await supabase
      .from("cart_items")
      .delete({ count: "exact" })
      .in("id", cartItemIds)
      .eq("clerk_id", userId);

    if (error) {
      console.error("Error removing cart items:", error);
      console.groupEnd();
      return {
        success: false,
        message: "장바구니 삭제 중 오류가 발생했습니다.",
        deletedCount: 0,
      };
    }

    const deletedCount = count || 0;
    console.log("Cart items removed:", deletedCount);
    console.groupEnd();

    return {
      success: true,
      message: `${deletedCount}개의 상품이 삭제되었습니다.`,
      deletedCount,
    };
  } catch (error) {
    console.error("Error in removeCartItems:", error);
    console.groupEnd();
    return {
      success: false,
      message: "예기치 않은 오류가 발생했습니다.",
      deletedCount: 0,
    };
  }
}

/**
 * 장바구니 전체 비우기 결과
 */
export interface ClearCartResult {
  success: boolean;
  message: string;
}

/**
 * 장바구니 전체 비우기
 * @returns 비우기 결과
 */
export async function clearCart(): Promise<ClearCartResult> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        message: "로그인이 필요합니다.",
      };
    }

    console.group("clearCart");
    console.log("User ID:", userId);

    const supabase = createClerkSupabaseClient();

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("clerk_id", userId);

    if (error) {
      console.error("Error clearing cart:", error);
      console.groupEnd();
      return {
        success: false,
        message: "장바구니 비우기 중 오류가 발생했습니다.",
      };
    }

    console.log("Cart cleared");
    console.groupEnd();

    return {
      success: true,
      message: "장바구니가 비워졌습니다.",
    };
  } catch (error) {
    console.error("Error in clearCart:", error);
    console.groupEnd();
    return {
      success: false,
      message: "예기치 않은 오류가 발생했습니다.",
    };
  }
}

