/**
 * @file app/cart/page.tsx
 * @description 장바구니 페이지
 *
 * 사용자의 장바구니 아이템을 표시하고 관리하는 페이지입니다.
 *
 * 주요 기능:
 * 1. 장바구니 아이템 목록 표시
 * 2. 전체 선택/해제 체크박스
 * 3. 선택 삭제 기능
 * 4. 주문 요약 및 주문하기
 * 5. 빈 장바구니 상태 처리
 *
 * @dependencies
 * - @/actions/cart: getCartItems, removeCartItems
 * - @/components/cart-item: CartItem
 * - @/components/cart-summary: CartSummary
 * - @clerk/nextjs/server: auth
 * - next/navigation: redirect
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/components/cart-item";
import { CartSummary } from "@/components/cart-summary";
import { getCartItems, removeCartItems } from "@/actions/cart";
import type { CartItem as CartItemType } from "@/actions/cart";
import { ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCartCount } from "@/hooks/use-cart-count";

export default function CartPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const { refetch: refetchCartCount } = useCartCount();

  const [items, setItems] = useState<CartItemType[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // 로그인 확인
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?returnUrl=/cart");
    }
  }, [isLoaded, isSignedIn, router]);

  // 장바구니 아이템 조회
  useEffect(() => {
    if (!isSignedIn) return;

    const fetchCartItems = async () => {
      setIsLoading(true);
      try {
        const result = await getCartItems();
        if (result.success) {
          setItems(result.items);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, [isSignedIn]);

  // 전체 선택 상태
  const allSelected = items.length > 0 && selectedItemIds.length === items.length;
  const someSelected = selectedItemIds.length > 0 && selectedItemIds.length < items.length;

  // 전체 선택/해제
  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(items.map((item) => item.id));
    }
  };

  // 개별 선택
  const handleSelectItem = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedItemIds([...selectedItemIds, id]);
    } else {
      setSelectedItemIds(selectedItemIds.filter((itemId) => itemId !== id));
    }
  };

  // 아이템 업데이트 (수량 변경, 삭제 후)
  const handleItemUpdate = async () => {
    const result = await getCartItems();
    if (result.success) {
      setItems(result.items);
      // 삭제된 아이템은 선택 목록에서 제거
      setSelectedItemIds((prev) =>
        prev.filter((id) => result.items.some((item) => item.id === id))
      );
      // 장바구니 개수 리프레시
      refetchCartCount();
    }
  };

  // 선택 삭제
  const handleDeleteSelected = async () => {
    if (selectedItemIds.length === 0) return;

    const confirmed = window.confirm(
      `${selectedItemIds.length}개의 상품을 삭제하시겠습니까?`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const result = await removeCartItems(selectedItemIds);
      if (result.success) {
        await handleItemUpdate();
        setSelectedItemIds([]);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error deleting items:", error);
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  // 로딩 중
  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-80px)] px-4 py-8 sm:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold sm:text-3xl">장바구니</h1>
          </div>
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">로딩 중...</p>
          </div>
        </div>
      </main>
    );
  }

  // 빈 장바구니
  if (items.length === 0) {
    return (
      <main className="min-h-[calc(100vh-80px)] px-4 py-8 sm:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold sm:text-3xl">장바구니</h1>
          </div>

          <div className="flex flex-col items-center justify-center py-20">
            <ShoppingCart className="mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-semibold">장바구니가 비어있습니다</h2>
            <p className="mb-6 text-muted-foreground">원하는 상품을 담아보세요</p>
            <Link href="/products">
              <Button size="lg">쇼핑 계속하기</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-80px)] px-4 py-8 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        {/* 헤더 */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold sm:text-3xl">
            장바구니 ({items.length})
          </h1>
        </div>

        {/* 2열 그리드 레이아웃 */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]">
          {/* 왼쪽: 장바구니 아이템 목록 */}
          <div className="space-y-4">
            {/* 전체 선택 & 선택 삭제 */}
            <div className="flex items-center justify-between rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = someSelected;
                    }
                  }}
                  onChange={handleSelectAll}
                  className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                  aria-label="전체 선택"
                />
                <span className="text-sm font-medium">전체 선택</span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteSelected}
                disabled={selectedItemIds.length === 0 || isDeleting}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              >
                <Trash2 className="mr-1 h-4 w-4" />
                {isDeleting ? "삭제 중..." : "선택 삭제"}
              </Button>
            </div>

            {/* 장바구니 아이템 목록 */}
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  isSelected={selectedItemIds.includes(item.id)}
                  onSelect={handleSelectItem}
                  onUpdate={handleItemUpdate}
                />
              ))}
            </div>
          </div>

          {/* 오른쪽: 주문 요약 (데스크톱에서 sticky) */}
          <CartSummary
            items={items}
            selectedItemIds={selectedItemIds}
            className="lg:sticky lg:top-24 lg:self-start"
          />
        </div>

        {/* 모바일: 하단 고정 주문 요약 바 (추후 구현) */}
      </div>
    </main>
  );
}

