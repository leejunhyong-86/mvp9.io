/**
 * @file types/order.ts
 * @description 주문 관련 타입 정의
 */

/**
 * 배송 정보
 */
export interface ShippingAddress {
  recipientName: string;
  phone: string;
  postalCode: string;
  address: string;
  addressDetail: string;
}

/**
 * 주문 폼 데이터 (배송 정보 + 주문 메모)
 * zod 스키마와 동일한 구조를 가져야 함
 */
export interface OrderFormData extends ShippingAddress {
  orderNote?: string;
}

/**
 * 주문 상태
 */
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

/**
 * 주문 정보 (DB 스키마와 매칭)
 */
export interface Order {
  id: string;
  clerk_id: string;
  total_amount: number;
  status: OrderStatus;
  shipping_address: ShippingAddress;
  order_note: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * 주문 상품 정보 (DB 스키마와 매칭)
 */
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  created_at: string;
}

/**
 * 주문 상세 정보 (주문 + 주문 상품 목록)
 */
export interface OrderWithItems extends Order {
  items: OrderItem[];
}

