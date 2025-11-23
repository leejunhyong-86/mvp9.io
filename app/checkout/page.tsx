/**
 * @file app/checkout/page.tsx
 * @description 주문 페이지
 *
 * 장바구니에서 선택한 상품을 기반으로 배송 정보를 입력받고 주문을 생성하는 페이지입니다.
 *
 * 주요 기능:
 * 1. URL 쿼리 파라미터에서 선택된 아이템 ID 추출
 * 2. 장바구니 아이템 조회 및 검증
 * 3. 배송 정보 입력 폼 표시
 * 4. 주문 요약 표시
 * 5. Toss Payments SDK 통합 및 결제창 열기
 * 
 * 결제 플로우:
 * 1. 주문 생성 (status='pending')
 * 2. Toss Payments 결제창 열기
 * 3. 결제 성공 시 `/payment/success`로 리디렉션
 * 4. 결제 실패 시 `/payment/fail`로 리디렉션
 *
 * @dependencies
 * - @/components/checkout-form: CheckoutForm
 * - @/components/checkout-summary: CheckoutSummary
 * - @/actions/cart: getCartItems
 * - @/actions/orders: createOrder
 * - @/types/order: OrderFormData, ShippingAddress
 * - @clerk/nextjs: useUser
 * - next/navigation: useRouter, useSearchParams
 * - Toss Payments SDK: v1 (CDN)
 */

"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { CheckoutForm, type CheckoutFormRef } from "@/components/checkout-form";
import { CheckoutSummary } from "@/components/checkout-summary";
import { getCartItems } from "@/actions/cart";
import { createOrder } from "@/actions/orders";
import type { CartItem } from "@/actions/cart";
import type { OrderFormData, ShippingAddress } from "@/types/order";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { calculateShippingFee } from "@/constants/shipping";

// Toss Payments SDK 타입 정의
declare global {
  interface Window {
    TossPayments?: (clientKey: string) => {
      requestPayment: (method: string, params: {
        amount: number;
        orderId: string;
        orderName: string;
        customerName?: string;
        successUrl: string;
        failUrl: string;
      }) => Promise<void>;
    };
  }
}

export default function CheckoutPage() {
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const formRef = useRef<CheckoutFormRef>(null);

  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTossPaymentsLoaded, setIsTossPaymentsLoaded] = useState(false);

  // Toss Payments SDK 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.tosspayments.com/v1/payment";
    script.async = true;
    script.onload = () => {
      console.log("Toss Payments SDK loaded");
      setIsTossPaymentsLoaded(true);
    };
    script.onerror = () => {
      console.error("Failed to load Toss Payments SDK");
      alert("결제 시스템 로드에 실패했습니다. 페이지를 새로고침해주세요.");
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // 로그인 확인
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?returnUrl=/checkout");
    }
  }, [isLoaded, isSignedIn, router]);

  // URL 쿼리 파라미터에서 선택된 아이템 ID 추출
  useEffect(() => {
    const itemsParam = searchParams.get("items");
    if (itemsParam) {
      const ids = itemsParam.split(",").filter((id) => id.trim() !== "");
      setSelectedItemIds(ids);
      console.log("Selected item IDs from URL:", ids);
    } else {
      console.log("No items selected");
    }
  }, [searchParams]);

  // 장바구니 아이템 조회
  useEffect(() => {
    if (!isSignedIn || selectedItemIds.length === 0) return;

    const fetchCartItems = async () => {
      setIsLoading(true);
      try {
        console.group("fetchCartItems");
        console.log("Fetching cart items...");

        const result = await getCartItems();
        if (result.success) {
          // 선택된 아이템만 필터링
          const filteredItems = result.items.filter((item) =>
            selectedItemIds.includes(item.id)
          );
          setItems(filteredItems);
          console.log("Filtered items:", filteredItems.length);
        } else {
          console.error("Failed to fetch cart items:", result.message);
          alert(result.message);
        }
        console.groupEnd();
      } catch (error) {
        console.error("Error fetching cart items:", error);
        alert("장바구니 조회 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, [isSignedIn, selectedItemIds]);

  // 폼 제출 핸들러 (주문 생성 + 결제창 열기)
  const handleFormSubmit = async (data: OrderFormData) => {
    if (items.length === 0) {
      alert("주문할 상품이 없습니다.");
      return;
    }

    if (!isTossPaymentsLoaded || !window.TossPayments) {
      alert("결제 시스템이 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      console.group("handleFormSubmit");
      console.log("Form data:", data);

      // ShippingAddress 추출
      const shippingAddress: ShippingAddress = {
        recipientName: data.recipientName,
        phone: data.phone,
        postalCode: data.postalCode,
        address: data.address,
        addressDetail: data.addressDetail,
      };

      console.log("Creating order...");

      // 주문 생성 (status='pending')
      const result = await createOrder(
        selectedItemIds,
        shippingAddress,
        data.orderNote
      );

      console.log("Order creation result:", result);

      if (!result.success || !result.orderId) {
        alert(result.message);
        console.groupEnd();
        setIsSubmitting(false);
        return;
      }

      // 총 금액 계산
      const totalProductPrice = items.reduce((sum, item) => {
        const product = item.product as any;
        return sum + (product?.price || 0) * item.quantity;
      }, 0);
      const shippingFee = calculateShippingFee(totalProductPrice);
      const totalAmount = totalProductPrice + shippingFee;

      console.log("Opening Toss Payments window...", {
        orderId: result.orderId,
        totalAmount,
      });

      // Toss Payments SDK 초기화
      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
      if (!clientKey) {
        console.error("Missing NEXT_PUBLIC_TOSS_CLIENT_KEY");
        alert("결제 설정이 올바르지 않습니다.");
        console.groupEnd();
        setIsSubmitting(false);
        return;
      }

      const tossPayments = window.TossPayments(clientKey);

      // 주문명 생성 (첫 번째 상품명 + 나머지 개수)
      const firstProduct = items[0]?.product as any;
      const orderName =
        items.length > 1
          ? `${firstProduct?.name || "상품"} 외 ${items.length - 1}건`
          : firstProduct?.name || "상품";

      console.log("Requesting payment:", {
        amount: totalAmount,
        orderId: result.orderId,
        orderName,
        customerName: data.recipientName,
      });

      // 결제창 열기
      await tossPayments.requestPayment("카드", {
        amount: totalAmount,
        orderId: result.orderId,
        orderName,
        customerName: data.recipientName,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });

      console.groupEnd();
    } catch (error) {
      console.error("Error in handleFormSubmit:", error);
      console.groupEnd();
      alert(
        error instanceof Error
          ? error.message
          : "주문 처리 중 오류가 발생했습니다."
      );
      setIsSubmitting(false);
    }
  };

  // 결제하기 버튼 클릭 (CheckoutSummary에서 호출)
  const handleCheckout = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  // 로딩 중
  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-80px)] px-4 py-8 sm:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold sm:text-3xl">주문하기</h1>
          </div>
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">로딩 중...</p>
          </div>
        </div>
      </main>
    );
  }

  // 선택된 상품이 없을 경우
  if (selectedItemIds.length === 0 || items.length === 0) {
    return (
      <main className="min-h-[calc(100vh-80px)] px-4 py-8 sm:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold sm:text-3xl">주문하기</h1>
          </div>

          <div className="flex flex-col items-center justify-center py-20">
            <h2 className="mb-2 text-xl font-semibold">
              주문할 상품이 없습니다
            </h2>
            <p className="mb-6 text-muted-foreground">
              장바구니에서 상품을 선택해주세요
            </p>
            <Link href="/cart">
              <Button size="lg">
                <ArrowLeft className="mr-2 h-4 w-4" />
                장바구니로 돌아가기
              </Button>
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
        <div className="mb-8">
          <Link
            href="/cart"
            className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            장바구니로 돌아가기
          </Link>
          <h1 className="text-2xl font-bold sm:text-3xl">주문하기</h1>
        </div>

        {/* 2열 그리드 레이아웃 */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]">
          {/* 왼쪽: 배송 정보 입력 폼 */}
          <CheckoutForm
            ref={formRef}
            onSubmit={handleFormSubmit}
            isLoading={isSubmitting}
          />

          {/* 오른쪽: 주문 요약 (데스크톱에서 sticky) */}
          <CheckoutSummary
            items={items}
            onCheckout={handleCheckout}
            isLoading={isSubmitting}
            className="lg:sticky lg:top-24 lg:self-start"
          />
        </div>
      </div>
    </main>
  );
}

