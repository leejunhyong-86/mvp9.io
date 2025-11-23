/**
 * @file components/cart-item.tsx
 * @description 장바구니 아이템 컴포넌트
 *
 * 장바구니 페이지에서 개별 아이템을 표시하는 컴포넌트입니다.
 *
 * 주요 기능:
 * 1. 체크박스 (선택 삭제용)
 * 2. 상품 이미지 플레이스홀더
 * 3. 상품 정보 (이름, 카테고리, 가격, 재고)
 * 4. 수량 조절 컨트롤
 * 5. 소계 계산
 * 6. 삭제 버튼
 *
 * @dependencies
 * - @/components/ui/button: Button
 * - @/components/ui/input: Input
 * - @/components/ui/badge: Badge
 * - @/actions/cart: updateCartItemQuantity, removeCartItem, CartItem
 * - lucide-react: 아이콘
 * - next/link: Link
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Trash2 } from "lucide-react";
import { updateCartItemQuantity, removeCartItem } from "@/actions/cart";
import type { CartItem } from "@/actions/cart";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/constants/toast-messages";

interface CartItemProps {
  item: CartItem;
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onUpdate: () => void;
}

/**
 * 카테고리 영문명 → 한글명 매핑
 */
const categoryMap: Record<string, string> = {
  electronics: "전자제품",
  clothing: "의류",
  books: "도서",
  food: "식품",
  sports: "스포츠",
  beauty: "뷰티",
  home: "생활/가정",
};

/**
 * 가격을 한국 원화 형식으로 포맷팅
 */
function formatPrice(price: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(price);
}

/**
 * 카테고리 한글명 반환
 */
function getCategoryName(category: string | null): string {
  if (!category) return "기타";
  return categoryMap[category] || category;
}

export function CartItem({
  item,
  isSelected,
  onSelect,
  onUpdate,
}: CartItemProps) {
  const product = item.product as any;
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 재고 상태
  const isInStock = product?.stock_quantity > 0;
  const isOutOfStock = !isInStock;
  const isLowStock = product?.stock_quantity > 0 && product?.stock_quantity < 10;

  // 소계 계산
  const subtotal = product ? product.price * quantity : 0;

  // quantity가 item.quantity와 다를 때 debounce로 업데이트
  useEffect(() => {
    if (quantity === item.quantity) return;

    const timer = setTimeout(async () => {
      if (quantity < 1 || quantity > product?.stock_quantity) {
        setQuantity(item.quantity);
        return;
      }

      await handleUpdateQuantity(quantity);
    }, 500);

    return () => clearTimeout(timer);
  }, [quantity]);

  // 수량 업데이트
  const handleUpdateQuantity = async (newQuantity: number) => {
    setIsUpdating(true);

    try {
      const result = await updateCartItemQuantity(item.id, newQuantity);

      if (result.success) {
        toast.success(TOAST_MESSAGES.CART.UPDATED);
        onUpdate();
      } else {
        toast.error(result.message);
        setQuantity(item.quantity); // 실패 시 원래 수량으로 복구
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error(TOAST_MESSAGES.CART.ERROR);
      setQuantity(item.quantity);
    } finally {
      setIsUpdating(false);
    }
  };

  // 수량 증가
  const handleIncrease = () => {
    if (quantity < product?.stock_quantity) {
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
    } else if (value > product?.stock_quantity) {
      setQuantity(product?.stock_quantity);
      toast.error(TOAST_MESSAGES.CART.MAX_QUANTITY);
    } else {
      setQuantity(value);
    }
  };

  // 삭제
  const handleDelete = async () => {
    if (isDeleting) return;

    const confirmed = window.confirm("이 상품을 장바구니에서 삭제하시겠습니까?");
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const result = await removeCartItem(item.id);

      if (result.success) {
        toast.success(TOAST_MESSAGES.CART.REMOVED);
        onUpdate();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error(TOAST_MESSAGES.CART.ERROR);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!product) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-lg border bg-card p-4 transition-opacity sm:flex-row sm:items-start",
        (isOutOfStock || isDeleting) && "opacity-50"
      )}
    >
      {/* 체크박스 */}
      <div className="flex items-start">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(item.id, e.target.checked)}
          disabled={isOutOfStock || isDeleting}
          className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={`${product.name} 선택`}
        />
      </div>

      {/* 상품 이미지 플레이스홀더 */}
      <Link
        href={`/products/${product.id}`}
        className="flex-shrink-0 overflow-hidden rounded-md border"
      >
        <div className="flex h-20 w-20 items-center justify-center bg-muted text-muted-foreground sm:h-24 sm:w-24">
          <span className="text-xs">이미지</span>
        </div>
      </Link>

      {/* 상품 정보 */}
      <div className="flex flex-1 flex-col gap-2">
        {/* 상품명 & 카테고리 */}
        <div>
          <Link
            href={`/products/${product.id}`}
            className="font-medium hover:underline"
          >
            {product.name}
          </Link>
          {product.category && (
            <div className="mt-1">
              <Badge variant="secondary" className="text-xs">
                {getCategoryName(product.category)}
              </Badge>
            </div>
          )}
        </div>

        {/* 가격 */}
        <p className="text-sm text-muted-foreground">
          개당 {formatPrice(product.price)}
        </p>

        {/* 재고 상태 */}
        {isOutOfStock && (
          <p className="text-sm font-medium text-red-500">품절</p>
        )}
        {isLowStock && !isOutOfStock && (
          <p className="text-sm font-medium text-orange-500">
            재고 {product.stock_quantity}개 남음
          </p>
        )}
      </div>

      {/* 수량 조절 & 소계 */}
      <div className="flex flex-col items-end gap-3 sm:w-48">
        {/* 수량 조절 */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleDecrease}
            disabled={quantity <= 1 || isUpdating || isOutOfStock || isDeleting}
            className="h-8 w-8"
            aria-label="수량 감소"
          >
            <Minus className="h-3 w-3" />
          </Button>

          <Input
            type="number"
            min={1}
            max={product.stock_quantity}
            value={quantity}
            onChange={handleQuantityChange}
            disabled={isUpdating || isOutOfStock || isDeleting}
            className="h-8 w-16 text-center text-sm"
            aria-label="수량"
          />

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleIncrease}
            disabled={
              quantity >= product.stock_quantity ||
              isUpdating ||
              isOutOfStock ||
              isDeleting
            }
            className="h-8 w-8"
            aria-label="수량 증가"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        {/* 소계 */}
        <div className="text-right">
          <p className="text-xs text-muted-foreground">소계</p>
          <p className="text-lg font-bold">{formatPrice(subtotal)}</p>
        </div>

        {/* 삭제 버튼 */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
        >
          <Trash2 className="mr-1 h-4 w-4" />
          {isDeleting ? "삭제 중..." : "삭제"}
        </Button>
      </div>
    </div>
  );
}

