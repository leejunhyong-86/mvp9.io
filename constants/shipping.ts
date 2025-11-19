/**
 * @file constants/shipping.ts
 * @description 배송 관련 상수
 */

/**
 * 무료 배송 기준 금액 (원)
 */
export const FREE_SHIPPING_THRESHOLD = 50000;

/**
 * 배송비 (원)
 */
export const SHIPPING_FEE = 3000;

/**
 * 배송비 계산
 * @param totalPrice 총 상품 금액
 * @returns 배송비
 */
export function calculateShippingFee(totalPrice: number): number {
  return totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}

/**
 * 무료 배송까지 남은 금액 계산
 * @param totalPrice 총 상품 금액
 * @returns 무료 배송까지 남은 금액 (이미 무료 배송이면 0)
 */
export function getRemainingForFreeShipping(totalPrice: number): number {
  if (totalPrice >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }
  return FREE_SHIPPING_THRESHOLD - totalPrice;
}

