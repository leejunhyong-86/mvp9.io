/**
 * @file app/payment/fail/page.tsx
 * @description 결제 실패 페이지
 * 
 * Toss Payments 결제가 실패했을 때 리디렉션되는 페이지입니다.
 * 
 * 주요 기능:
 * 1. URL 쿼리 파라미터에서 code, message 추출
 * 2. 실패 사유 표시
 * 3. 재결제 버튼 제공 (checkout 페이지로 이동)
 * 4. 장바구니로 돌아가기 버튼 제공
 * 
 * @dependencies
 * - next/navigation: useRouter, useSearchParams
 * - @clerk/nextjs: useUser
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, RotateCcw, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/constants/toast-messages";

export default function PaymentFailPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [errorCode, setErrorCode] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [orderId, setOrderId] = useState<string | null>(null);

  // 로그인 확인
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  // URL 쿼리 파라미터 추출
  useEffect(() => {
    const code = searchParams.get("code") || "UNKNOWN_ERROR";
    const message =
      searchParams.get("message") || "결제 처리 중 오류가 발생했습니다.";
    const order = searchParams.get("orderId");

    console.group("Payment Fail");
    console.log("Error code:", code);
    console.log("Error message:", message);
    console.log("Order ID:", order);
    console.groupEnd();

    setErrorCode(code);
    setErrorMessage(message);
    setOrderId(order);

    // 결제 실패 토스트 표시
    if (code === "PAY_PROCESS_CANCELED") {
      toast.error(TOAST_MESSAGES.PAYMENT.CANCELLED);
    } else {
      toast.error(TOAST_MESSAGES.PAYMENT.FAILED);
    }
  }, [searchParams]);

  // 사용자 친화적인 에러 메시지 생성
  const getFriendlyMessage = (code: string, message: string): string => {
    const errorMap: Record<string, string> = {
      PAY_PROCESS_CANCELED: "결제를 취소하셨습니다.",
      PAY_PROCESS_ABORTED: "결제가 중단되었습니다.",
      REJECT_CARD_PAYMENT: "카드 결제가 거부되었습니다. 카드 정보를 확인해주세요.",
      INVALID_CARD_EXPIRATION: "카드 유효기간이 올바르지 않습니다.",
      NOT_FOUND_PAYMENT_SESSION: "결제 시간이 초과되었습니다. (10분)",
      BELOW_MINIMUM_AMOUNT: "결제 금액이 최소 금액 미만입니다.",
      EXCEED_MAX_CARD_INSTALLMENT_PLAN: "카드 할부 개월 수를 초과했습니다.",
    };

    return errorMap[code] || message;
  };

  return (
    <main className="min-h-[calc(100vh-80px)] px-4 py-8 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-3xl">
        {/* 실패 메시지 */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
            결제에 실패했습니다
          </h1>
          <p className="text-muted-foreground">
            결제 처리 중 문제가 발생했습니다.
          </p>
        </div>

        {/* 에러 정보 */}
        <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="mb-2 text-lg font-bold text-red-900">실패 사유</h2>
          <p className="mb-2 text-red-800">
            {getFriendlyMessage(errorCode, errorMessage)}
          </p>
          {errorCode !== "UNKNOWN_ERROR" && (
            <p className="text-sm text-red-600">에러 코드: {errorCode}</p>
          )}
        </div>

        {/* 안내 메시지 */}
        <div className="mb-8 rounded-lg border bg-card p-6">
          <h2 className="mb-3 text-lg font-bold">결제 실패 시 확인 사항</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start">
              <span className="mr-2 text-primary">•</span>
              <span>카드 한도 또는 잔액이 충분한지 확인해주세요.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-primary">•</span>
              <span>카드 정보 (번호, 유효기간, CVC)가 정확한지 확인해주세요.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-primary">•</span>
              <span>해외 결제 차단 설정이 되어 있지 않은지 확인해주세요.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-primary">•</span>
              <span>문제가 지속되면 카드사에 문의해주세요.</span>
            </li>
          </ul>
        </div>

        {/* 액션 버튼 */}
        <div className="space-y-3">
          {/* 재결제 버튼 - 주문이 있는 경우에만 표시 */}
          {orderId && (
            <Button
              onClick={() => router.push(`/checkout?orderId=${orderId}`)}
              size="lg"
              className="w-full"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              다시 결제하기
            </Button>
          )}

          {/* 장바구니로 돌아가기 */}
          <Link href="/cart" className="block">
            <Button variant="outline" size="lg" className="w-full">
              <ShoppingCart className="mr-2 h-4 w-4" />
              장바구니로 돌아가기
            </Button>
          </Link>

          {/* 홈으로 돌아가기 */}
          <Link href="/" className="block">
            <Button variant="ghost" size="lg" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              홈으로 돌아가기
            </Button>
          </Link>
        </div>

        {/* 고객센터 안내 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            문제가 계속 발생하거나 도움이 필요하신 경우
            <br />
            <span className="font-medium text-foreground">
              고객센터 (1544-7772)
            </span>
            로 문의해주세요.
          </p>
        </div>
      </div>
    </main>
  );
}

