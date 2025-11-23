/**
 * @file components/checkout-summary.tsx
 * @description 주문 요약 컴포넌트
 *
 * 주문 페이지에서 선택된 상품 목록과 결제 금액을 표시하는 컴포넌트입니다.
 *
 * 주요 기능:
 * 1. 선택된 상품 목록 표시 (읽기 전용)
 * 2. 총 상품 금액, 배송비, 최종 금액 계산 및 표시
 * 3. 결제하기 버튼 (외부 폼 제출 트리거)
 * 4. 품절/재고 부족 상품 확인 및 안내
 *
 * @dependencies
 * - @/components/ui/button: Button
 * - @/constants/shipping: 배송비 관련 상수
 * - @/actions/cart: CartItem
 */

"use client";

import { Button } from "@/components/ui/button";
import { CreditCard, Package, Truck } from "lucide-react";
import {
  calculateShippingFee,
  getRemainingForFreeShipping,
} from "@/constants/shipping";
import type { CartItem } from "@/actions/cart";

interface CheckoutSummaryProps {
  items: CartItem[];
  onCheckout: () => void;
  isLoading?: boolean;
  className?: string;
}

/**
 * 가격을 한국 원화 형식으로 포맷팅
 */
function formatPrice(price: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(price);
}

export function CheckoutSummary({
  items,
  onCheckout,
  isLoading = false,
  className,
}: CheckoutSummaryProps) {
  // 품절 상품 확인
  const hasOutOfStockItems = items.some((item) => {
    const product = item.product as any;
    return !product?.is_active || product?.stock_quantity <= 0;
  });

  // 재고 부족 상품 확인
  const hasInsufficientStockItems = items.some((item) => {
    const product = item.product as any;
    return product?.stock_quantity < item.quantity;
  });

  // 총 상품 금액 계산
  const totalProductPrice = items.reduce((sum, item) => {
    const product = item.product as any;
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  // 배송비 계산
  const shippingFee = calculateShippingFee(totalProductPrice);

  // 무료 배송까지 남은 금액
  const remainingForFreeShipping =
    getRemainingForFreeShipping(totalProductPrice);

  // 최종 결제 금액
  const finalPrice = totalProductPrice + shippingFee;

  return (
    <div className={className}>
      <div className="space-y-6 rounded-lg border bg-card p-6">
        <h2 className="text-lg font-bold">주문 요약</h2>

        {/* 주문 상품 목록 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Package className="h-4 w-4" />
            <span>주문 상품 ({items.length}개)</span>
          </div>

          <div className="space-y-3">
            {items.map((item) => {
              const product = item.product as any;
              const subtotal = (product?.price || 0) * item.quantity;

              return (
                <div
                  key={item.id}
                  className="flex items-start justify-between text-sm"
                >
                  <div className="flex-1">
                    <p className="font-medium">{product?.name}</p>
                    <p className="text-muted-foreground">
                      {formatPrice(product?.price || 0)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">{formatPrice(subtotal)}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="space-y-3">
            {/* 총 상품 금액 */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">총 상품 금액</span>
              <span className="font-medium">{formatPrice(totalProductPrice)}</span>
            </div>

            {/* 배송비 */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">배송비</span>
              <span className="font-medium">
                {shippingFee === 0 ? (
                  <span className="text-green-600">무료</span>
                ) : (
                  formatPrice(shippingFee)
                )}
              </span>
            </div>

            {/* 무료 배송 안내 */}
            {remainingForFreeShipping > 0 && (
              <div className="rounded-md bg-muted p-3">
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Truck className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>
                    {formatPrice(remainingForFreeShipping)} 더 담으면 무료 배송
                  </span>
                </div>
              </div>
            )}

            <div className="border-t pt-3">
              {/* 최종 결제 금액 */}
              <div className="flex items-center justify-between">
                <span className="text-base font-bold">최종 결제 금액</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(finalPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 결제하기 버튼 */}
        <Button
          onClick={onCheckout}
          disabled={isLoading || hasOutOfStockItems || hasInsufficientStockItems}
          className="w-full"
          size="lg"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          {isLoading ? "처리 중..." : `${formatPrice(finalPrice)} 결제하기`}
        </Button>

        {/* 안내 메시지 */}
        {hasOutOfStockItems && (
          <p className="text-center text-xs text-red-500">
            품절된 상품이 포함되어 있습니다
          </p>
        )}
        {hasInsufficientStockItems && (
          <p className="text-center text-xs text-orange-500">
            재고가 부족한 상품이 있습니다
          </p>
        )}
      </div>
    </div>
  );
}

