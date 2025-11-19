/**
 * @file components/add-to-cart-dialog.tsx
 * @description 장바구니 추가 후 확인 Dialog 컴포넌트
 *
 * 상품을 장바구니에 추가한 후 표시되는 Dialog입니다.
 *
 * 주요 기능:
 * 1. 장바구니 추가 성공 메시지
 * 2. 추가된 상품 정보 표시
 * 3. 현재 장바구니 총 개수 표시
 * 4. "계속 쇼핑하기" / "장바구니로 이동" 액션
 *
 * @dependencies
 * - @/components/ui/dialog: Dialog 컴포넌트
 * - @/components/ui/button: Button 컴포넌트
 * - lucide-react: 아이콘
 */

"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart, CheckCircle } from "lucide-react";

interface AddToCartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  quantity: number;
  price: number;
  totalCartCount: number;
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

export function AddToCartDialog({
  open,
  onOpenChange,
  productName,
  quantity,
  price,
  totalCartCount,
}: AddToCartDialogProps) {
  const router = useRouter();

  const handleContinueShopping = () => {
    onOpenChange(false);
  };

  const handleGoToCart = () => {
    onOpenChange(false);
    router.push("/cart");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <DialogTitle>장바구니에 추가되었습니다</DialogTitle>
          </div>
          <DialogDescription>
            상품이 장바구니에 성공적으로 추가되었습니다.
          </DialogDescription>
        </DialogHeader>

        {/* 추가된 상품 정보 */}
        <div className="space-y-4 py-4">
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="space-y-2">
              <p className="font-medium">{productName}</p>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>수량: {quantity}개</span>
                <span className="font-medium text-foreground">
                  {formatPrice(price * quantity)}
                </span>
              </div>
            </div>
          </div>

          {/* 장바구니 총 개수 */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <ShoppingCart className="h-4 w-4" />
            <span>장바구니에 총 {totalCartCount}개의 상품이 있습니다</span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleContinueShopping}
          >
            계속 쇼핑하기
          </Button>
          <Button type="button" onClick={handleGoToCart}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            장바구니로 이동
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

