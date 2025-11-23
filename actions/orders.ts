/**
 * @file actions/orders.ts
 * @description 주문 관련 Server Actions
 *
 * 이 파일은 주문 생성, 조회, 상태 업데이트 기능을 제공합니다.
 *
 * 주요 기능:
 * 1. 주문 생성 (선택된 장바구니 아이템 기반)
 * 2. 주문 조회
 * 3. 주문 상태 업데이트
 *
 * 핵심 구현 로직:
 * - Clerk 인증 사용 (createClerkSupabaseClient)
 * - clerk_id로 사용자 필터링
 * - 재고 확인 및 검증
 * - 주문 시점 상품명/가격 스냅샷 저장
 *
 * @dependencies
 * - @/lib/supabase/server: createClerkSupabaseClient
 * - @clerk/nextjs/server: auth
 * - @/types/order: ShippingAddress, Order, OrderItem
 * - @/constants/shipping: calculateShippingFee
 */

"use server";

import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import type { ShippingAddress, Order, OrderItem, OrderListItem, OrderSortOption, OrderStatus } from "@/types/order";
import { calculateShippingFee } from "@/constants/shipping";
import { ORDERS_PER_PAGE } from "@/constants/orders";

/**
 * 주문 생성 결과
 */
export interface CreateOrderResult {
  success: boolean;
  orderId?: string;
  message: string;
}

/**
 * 주문 생성
 * @param selectedCartItemIds - 선택된 장바구니 아이템 ID 배열
 * @param shippingAddress - 배송 정보
 * @param orderNote - 주문 메모 (선택)
 * @returns 주문 생성 결과
 */
export async function createOrder(
  selectedCartItemIds: string[],
  shippingAddress: ShippingAddress,
  orderNote?: string
): Promise<CreateOrderResult> {
  try {
    // 1. 인증 확인
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        message: "로그인이 필요합니다.",
      };
    }

    console.group("createOrder");
    console.log("User ID:", userId);
    console.log("Selected Cart Item IDs:", selectedCartItemIds);
    console.log("Shipping Address:", shippingAddress);
    console.log("Order Note:", orderNote);

    if (selectedCartItemIds.length === 0) {
      console.log("No items selected");
      console.groupEnd();
      return {
        success: false,
        message: "주문할 상품을 선택해주세요.",
      };
    }

    const supabase = createClerkSupabaseClient();

    // 2. 선택된 장바구니 아이템 조회 (상품 정보 포함)
    const { data: cartItems, error: cartError } = await supabase
      .from("cart_items")
      .select(
        `
        *,
        product:products (
          id,
          name,
          price,
          stock_quantity,
          is_active
        )
      `
      )
      .eq("clerk_id", userId)
      .in("id", selectedCartItemIds);

    if (cartError) {
      console.error("Error fetching cart items:", cartError);
      console.groupEnd();
      return {
        success: false,
        message: "장바구니 조회 중 오류가 발생했습니다.",
      };
    }

    if (!cartItems || cartItems.length === 0) {
      console.log("No cart items found");
      console.groupEnd();
      return {
        success: false,
        message: "선택한 상품을 찾을 수 없습니다.",
      };
    }

    console.log("Cart items fetched:", cartItems.length);

    // 3. 상품 검증 (활성화 상태, 재고 확인)
    for (const item of cartItems) {
      const product = item.product as any;

      if (!product) {
        console.error("Product not found for cart item:", item.id);
        console.groupEnd();
        return {
          success: false,
          message: "상품 정보를 찾을 수 없습니다.",
        };
      }

      if (!product.is_active) {
        console.log("Product is not active:", product.name);
        console.groupEnd();
        return {
          success: false,
          message: `${product.name}은(는) 현재 판매 중단된 상품입니다.`,
        };
      }

      if (product.stock_quantity < item.quantity) {
        console.log("Insufficient stock:", product.name);
        console.groupEnd();
        return {
          success: false,
          message: `${product.name}의 재고가 부족합니다. (현재 재고: ${product.stock_quantity}개)`,
        };
      }
    }

    console.log("All products validated");

    // 4. 총 상품 금액 계산
    const totalProductPrice = cartItems.reduce((sum, item) => {
      const product = item.product as any;
      return sum + product.price * item.quantity;
    }, 0);

    console.log("Total product price:", totalProductPrice);

    // 5. 배송비 계산
    const shippingFee = calculateShippingFee(totalProductPrice);
    console.log("Shipping fee:", shippingFee);

    // 6. 최종 금액 계산
    const totalAmount = totalProductPrice + shippingFee;
    console.log("Total amount:", totalAmount);

    // 7. 주문 생성 (orders 테이블에 INSERT)
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        clerk_id: userId,
        total_amount: totalAmount,
        status: "pending",
        shipping_address: shippingAddress,
        order_note: orderNote || null,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Error creating order:", orderError);
      console.groupEnd();
      return {
        success: false,
        message: "주문 생성 중 오류가 발생했습니다.",
      };
    }

    console.log("Order created:", order.id);

    // 8. 주문 상품 생성 (order_items 테이블에 INSERT)
    const orderItemsData = cartItems.map((item) => {
      const product = item.product as any;
      return {
        order_id: order.id,
        product_id: product.id,
        product_name: product.name, // 주문 시점 상품명 스냅샷
        quantity: item.quantity,
        price: product.price, // 주문 시점 가격 스냅샷
      };
    });

    const { error: orderItemsError } = await supabase
      .from("order_items")
      .insert(orderItemsData);

    if (orderItemsError) {
      console.error("Error creating order items:", orderItemsError);
      // 주문은 생성되었지만 주문 상품 생성 실패
      // 실제 프로덕션에서는 트랜잭션으로 처리하거나 주문 삭제 필요
      console.groupEnd();
      return {
        success: false,
        message: "주문 상품 등록 중 오류가 발생했습니다.",
      };
    }

    console.log("Order items created:", orderItemsData.length);
    console.groupEnd();

    return {
      success: true,
      orderId: order.id,
      message: "주문이 성공적으로 생성되었습니다.",
    };
  } catch (error) {
    console.error("Error in createOrder:", error);
    console.groupEnd();
    return {
      success: false,
      message: "예기치 않은 오류가 발생했습니다.",
    };
  }
}

/**
 * 주문 조회 결과
 */
export interface GetOrderResult {
  success: boolean;
  order?: Order;
  items?: OrderItem[];
  message?: string;
}

/**
 * 주문 상세 조회
 * @param orderId - 주문 ID
 * @returns 주문 정보 및 주문 상품 목록
 */
export async function getOrder(orderId: string): Promise<GetOrderResult> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        message: "로그인이 필요합니다.",
      };
    }

    console.group("getOrder");
    console.log("User ID:", userId);
    console.log("Order ID:", orderId);

    const supabase = createClerkSupabaseClient();

    // 주문 조회
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("clerk_id", userId)
      .single();

    if (orderError || !order) {
      console.error("Error fetching order:", orderError);
      console.groupEnd();
      return {
        success: false,
        message: "주문을 찾을 수 없습니다.",
      };
    }

    // 주문 상품 조회
    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: true });

    if (itemsError) {
      console.error("Error fetching order items:", itemsError);
      console.groupEnd();
      return {
        success: false,
        message: "주문 상품 조회 중 오류가 발생했습니다.",
      };
    }

    console.log("Order fetched:", order.id);
    console.log("Order items fetched:", items?.length || 0);
    console.groupEnd();

    return {
      success: true,
      order: order as Order,
      items: (items || []) as OrderItem[],
    };
  } catch (error) {
    console.error("Error in getOrder:", error);
    console.groupEnd();
    return {
      success: false,
      message: "예기치 않은 오류가 발생했습니다.",
    };
  }
}

/**
 * 주문 상세 정보 조회 (주문 + 주문 아이템)
 * 
 * 결제 성공 페이지에서 주문 상세 정보를 표시하기 위해 사용합니다.
 * 
 * @param orderId - 주문 ID
 * @returns 주문 정보 및 주문 아이템 목록
 */
export interface GetOrderWithItemsResult {
  success: boolean;
  message?: string;
  order?: Order & {
    items: OrderItem[];
  };
}

export async function getOrderWithItems(
  orderId: string
): Promise<GetOrderWithItemsResult> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        message: "로그인이 필요합니다.",
      };
    }

    console.group("getOrderWithItems");
    console.log("Order ID:", orderId);
    console.log("User ID:", userId);

    const supabase = createClerkSupabaseClient();

    // 주문 정보 조회
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("clerk_id", userId)
      .single();

    if (orderError || !order) {
      console.error("Order not found:", orderError);
      console.groupEnd();
      return {
        success: false,
        message: "주문 정보를 찾을 수 없습니다.",
      };
    }

    // 주문 아이템 조회
    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: true });

    if (itemsError) {
      console.error("Failed to fetch order items:", itemsError);
      console.groupEnd();
      return {
        success: false,
        message: "주문 상품 정보를 불러오는 데 실패했습니다.",
      };
    }

    console.log("Order fetched successfully:", {
      orderId: order.id,
      status: order.status,
      itemCount: orderItems?.length || 0,
    });
    console.groupEnd();

    return {
      success: true,
      order: {
        ...order,
        items: orderItems || [],
      } as Order & { items: OrderItem[] },
    };
  } catch (error) {
    console.error("Error in getOrderWithItems:", error);
    console.groupEnd();
    return {
      success: false,
      message: "예기치 않은 오류가 발생했습니다.",
    };
  }
}

/**
 * 사용자 주문 목록 조회 결과
 */
export interface GetUserOrdersResult {
  success: boolean;
  message?: string;
  orders?: OrderListItem[];
  totalCount?: number;
}

/**
 * 사용자 주문 목록 조회
 * 
 * @param options - 필터 및 정렬 옵션
 * @returns 주문 목록 및 총 개수
 */
export async function getUserOrders(options: {
  status?: OrderStatus | 'all';
  sort?: OrderSortOption;
  page?: number;
}): Promise<GetUserOrdersResult> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        message: "로그인이 필요합니다.",
      };
    }

    const {
      status = 'all',
      sort = 'latest',
      page = 1,
    } = options;

    console.group("getUserOrders");
    console.log("User ID:", userId);
    console.log("Options:", options);

    const supabase = createClerkSupabaseClient();
    const from = (page - 1) * ORDERS_PER_PAGE;
    const to = from + ORDERS_PER_PAGE - 1;

    // 기본 쿼리: 사용자의 주문 조회
    let query = supabase
      .from("orders")
      .select("*", { count: "exact" })
      .eq("clerk_id", userId);

    // 상태별 필터 적용
    if (status !== 'all') {
      query = query.eq("status", status);
    }

    // 정렬 옵션 적용
    switch (sort) {
      case 'latest':
        query = query.order("created_at", { ascending: false });
        break;
      case 'oldest':
        query = query.order("created_at", { ascending: true });
        break;
      case 'price_high':
        query = query.order("total_amount", { ascending: false });
        break;
      case 'price_low':
        query = query.order("total_amount", { ascending: true });
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }

    // 페이지네이션 적용
    query = query.range(from, to);

    const { data: orders, error: ordersError, count } = await query;

    if (ordersError) {
      console.error("Error fetching orders:", ordersError);
      console.groupEnd();
      return {
        success: false,
        message: "주문 목록 조회 중 오류가 발생했습니다.",
      };
    }

    console.log("Orders fetched:", orders?.length || 0);
    console.log("Total count:", count || 0);

    // 주문이 없는 경우
    if (!orders || orders.length === 0) {
      console.groupEnd();
      return {
        success: true,
        orders: [],
        totalCount: 0,
      };
    }

    // 각 주문에 대한 order_items 조회
    const orderIds = orders.map(order => order.id);
    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .in("order_id", orderIds);

    if (itemsError) {
      console.error("Error fetching order items:", itemsError);
      console.groupEnd();
      return {
        success: false,
        message: "주문 상품 조회 중 오류가 발생했습니다.",
      };
    }

    console.log("Order items fetched:", orderItems?.length || 0);

    // 주문별로 order_items 그룹핑
    const itemsByOrderId = (orderItems || []).reduce((acc, item) => {
      if (!acc[item.order_id]) {
        acc[item.order_id] = [];
      }
      acc[item.order_id].push(item);
      return acc;
    }, {} as Record<string, typeof orderItems>);

    // OrderListItem 생성
    const orderListItems: OrderListItem[] = orders.map((order) => {
      const items = itemsByOrderId[order.id] || [];
      const firstItem = items[0];
      const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...order,
        firstProductName: firstItem?.product_name || "상품",
        totalProductCount: items.length,
        totalQuantity,
      } as OrderListItem;
    });

    console.log("Order list items created:", orderListItems.length);
    console.groupEnd();

    return {
      success: true,
      orders: orderListItems,
      totalCount: count || 0,
    };
  } catch (error) {
    console.error("Error in getUserOrders:", error);
    console.groupEnd();
    return {
      success: false,
      message: "예기치 않은 오류가 발생했습니다.",
    };
  }
}
