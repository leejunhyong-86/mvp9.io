/**
 * @file components/add-to-cart-section.tsx
 * @description 장바구니 추가 섹션 컴포넌트
 *
 * 상품 상세 페이지에서 사용되는 장바구니 추가 UI입니다.
 *
 * 주요 기능:
 * 1. 수량 선택 컨트롤 (-, 입력, +)
 * 2. 수량 범위 검증 (1 ~ 재고 수량)
 * 3. 총 금액 계산 표시
 * 4. 장바구니 담기 버튼
 * 5. 데스크톱: sticky 고정, 모바일: 플로팅 버튼
 *
 * 핵심 구현 로직:
 * - Client Component (useState로 수량 관리)
 * - Clerk useUser로 로그인 상태 확인
 * - 재고 부족 시 버튼 비활성화
 * - Server Action으로 장바구니 추가
 *
 * @dependencies
 * - @clerk/nextjs: useUser
 * - @/actions/cart: addToCart
 * - @/components/ui/button: Button
 * - @/components/ui/input: Input
 * - next/navigation: useRouter
 */

"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addToCart } from "@/actions/cart";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartCount } from "@/hooks/use-cart-count";
import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/constants/toast-messages";

interface AddToCartSectionProps {
  productId: string;
  productName: string;
  price: number;
  stockQuantity: number;
  className?: string;
}

/**
 * 가격을 천 단위 구분 기호로 포맷팅
 */
function formatPrice(price: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(price);
}

export function AddToCartSection({
  productId,
  productName,
  price,
  stockQuantity,
  className,
}: AddToCartSectionProps) {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const { count, refetch: refetchCartCount } = useCartCount();

  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // 재고 상태
  const isInStock = stockQuantity > 0;
  const isDisabled = !isInStock || isLoading || quantity < 1 || quantity > stockQuantity;

  // 총 금액 계산
  const totalPrice = price * quantity;

  // 수량 증가
  const handleIncrease = () => {
    if (quantity < stockQuantity) {
      setQuantity(quantity + 1);
    } else {
      toast.error(TOAST_MESSAGES.CART.MAX_QUANTITY);
    }
  };

  // 수량 감소
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // 수량 직접 입력
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) {
      setQuantity(1);
    } else if (value > stockQuantity) {
      setQuantity(stockQuantity);
      toast.error(TOAST_MESSAGES.CART.MAX_QUANTITY);
    } else {
      setQuantity(value);
    }
  };

  // 장바구니 추가
  const handleAddToCart = async () => {
    // 로그인 확인
    if (!isSignedIn) {
      toast.error(TOAST_MESSAGES.COMMON.UNAUTHORIZED);
      const currentPath = window.location.pathname;
      router.push(`/sign-in?returnUrl=${encodeURIComponent(currentPath)}`);
      return;
    }

    // 재고 확인
    if (!isInStock || quantity > stockQuantity) {
      toast.error(TOAST_MESSAGES.CART.OUT_OF_STOCK);
      return;
    }

    setIsLoading(true);

    try {
      const result = await addToCart(productId, quantity);

      if (result.success) {
        // 장바구니 개수 리프레시
        await refetchCartCount();
        // Toast 알림
        toast.success(TOAST_MESSAGES.CART.ADDED);
        // 성공 후 수량 초기화 (선택적)
        // setQuantity(1);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(TOAST_MESSAGES.CART.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* 수량 선택 */}
      <div className="space-y-2">
        <label className="text-sm font-medium">수량</label>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleDecrease}
            disabled={quantity <= 1 || isLoading}
            className="h-9 w-9"
            aria-label="수량 감소"
          >
            <Minus className="h-4 w-4" />
          </Button>

          <Input
            type="number"
            min={1}
            max={stockQuantity}
            value={quantity}
            onChange={handleQuantityChange}
            disabled={isLoading || !isInStock}
            className="h-9 w-20 text-center"
            aria-label="수량"
          />

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleIncrease}
            disabled={quantity >= stockQuantity || isLoading}
            className="h-9 w-9"
            aria-label="수량 증가"
          >
            <Plus className="h-4 w-4" />
          </Button>

          <span className="ml-auto text-sm text-muted-foreground">
            재고: {stockQuantity}개
          </span>
        </div>
      </div>

      {/* 총 금액 */}
      <div className="rounded-lg border bg-muted/50 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">총 금액</span>
          <span className="text-2xl font-bold text-primary">
            {formatPrice(totalPrice)}
          </span>
        </div>
      </div>

      {/* 장바구니 담기 버튼 */}
      <Button
        onClick={handleAddToCart}
        disabled={isDisabled}
        className="w-full"
        size="lg"
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        {isLoading ? "처리 중..." : "장바구니 담기"}
      </Button>

      {/* 재고 부족 안내 */}
      {!isInStock && (
        <p className="text-sm text-muted-foreground">
          현재 재고가 없습니다.
        </p>
      )}
    </div>
  );
}

