/**
 * @file components/cart-summary.tsx
 * @description 장바구니 주문 요약 섹션 컴포넌트
 *
 * 장바구니 페이지에서 주문 요약 정보를 표시하는 컴포넌트입니다.
 *
 * 주요 기능:
 * 1. 총 상품 금액 표시
 * 2. 배송비 계산 및 표시
 * 3. 무료 배송 조건 안내
 * 4. 최종 결제 금액 표시
 * 5. 주문하기 버튼
 *
 * @dependencies
 * - @/components/ui/button: Button
 * - @/constants/shipping: 배송비 관련 상수
 * - next/navigation: useRouter
 */

"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Truck } from "lucide-react";
import {
  FREE_SHIPPING_THRESHOLD,
  calculateShippingFee,
  getRemainingForFreeShipping,
} from "@/constants/shipping";
import type { CartItem } from "@/actions/cart";

interface CartSummaryProps {
  items: CartItem[];
  selectedItemIds: string[];
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

export function CartSummary({
  items,
  selectedItemIds,
  className,
}: CartSummaryProps) {
  const router = useRouter();

  // 선택된 아이템만 필터링
  const selectedItems = items.filter((item) =>
    selectedItemIds.includes(item.id)
  );

  // 품절 상품 확인
  const hasOutOfStockItems = selectedItems.some((item) => {
    const product = item.product as any;
    return !product?.is_active || product?.stock_quantity <= 0;
  });

  // 재고 부족 상품 확인
  const hasInsufficientStockItems = selectedItems.some((item) => {
    const product = item.product as any;
    return product?.stock_quantity < item.quantity;
  });

  // 총 상품 금액 계산
  const totalProductPrice = selectedItems.reduce((sum, item) => {
    const product = item.product as any;
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  // 배송비 계산
  const shippingFee = calculateShippingFee(totalProductPrice);

  // 무료 배송까지 남은 금액
  const remainingForFreeShipping = getRemainingForFreeShipping(totalProductPrice);

  // 최종 결제 금액
  const finalPrice = totalProductPrice + shippingFee;

  // 주문하기
  const handleCheckout = () => {
    // 선택된 아이템 확인
    if (selectedItems.length === 0) {
      alert("주문할 상품을 선택해주세요.");
      return;
    }

    // 품절 상품 확인
    if (hasOutOfStockItems) {
      alert("품절된 상품이 포함되어 있습니다. 해당 상품을 삭제해주세요.");
      return;
    }

    // 재고 부족 상품 확인
    if (hasInsufficientStockItems) {
      alert("재고가 부족한 상품이 있습니다. 수량을 조정해주세요.");
      return;
    }

    // 주문 페이지로 이동
    router.push("/checkout");
  };

  return (
    <div className={className}>
      <div className="space-y-4 rounded-lg border bg-card p-6">
        <h2 className="text-lg font-bold">주문 요약</h2>

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

        {/* 주문하기 버튼 */}
        <Button
          onClick={handleCheckout}
          disabled={selectedItems.length === 0}
          className="w-full"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          주문하기 ({selectedItems.length}개)
        </Button>

        {/* 안내 메시지 */}
        {selectedItems.length === 0 && (
          <p className="text-center text-xs text-muted-foreground">
            주문할 상품을 선택해주세요
          </p>
        )}
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

