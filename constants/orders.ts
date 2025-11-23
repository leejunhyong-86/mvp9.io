/**
 * @file constants/orders.ts
 * @description 주문 관련 상수 정의
 */

import type { OrderStatus } from "@/types/order";

/**
 * 주문 상태별 한글 라벨
 */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "결제 대기",
  confirmed: "결제 완료",
  shipped: "배송중",
  delivered: "배송완료",
  cancelled: "취소됨",
};

/**
 * 주문 상태별 Badge variant (색상)
 */
export const ORDER_STATUS_VARIANTS: Record<
  OrderStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "secondary", // 회색
  confirmed: "default", // 파란색 (기본)
  shipped: "outline", // 주황색
  delivered: "outline", // 녹색
  cancelled: "destructive", // 빨간색
};

/**
 * 주문 상태별 색상 클래스 (Badge에 직접 적용)
 */
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-gray-100 text-gray-800 border-gray-300",
  confirmed: "bg-blue-100 text-blue-800 border-blue-300",
  shipped: "bg-orange-100 text-orange-800 border-orange-300",
  delivered: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

/**
 * 페이지당 주문 표시 개수
 */
export const ORDERS_PER_PAGE = 10;

/**
 * 정렬 옵션 라벨
 */
export const SORT_OPTIONS = [
  { value: "latest", label: "최신순" },
  { value: "oldest", label: "오래된순" },
  { value: "price_high", label: "금액 높은순" },
  { value: "price_low", label: "금액 낮은순" },
] as const;

/**
 * 상태 필터 옵션
 */
export const STATUS_FILTERS = [
  { value: "all", label: "전체" },
  { value: "confirmed", label: "결제완료" },
  { value: "shipped", label: "배송중" },
  { value: "delivered", label: "배송완료" },
  { value: "cancelled", label: "취소됨" },
] as const;

