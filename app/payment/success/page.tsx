/**
 * @file app/payment/success/page.tsx
 * @description 결제 성공 페이지
 * 
 * Toss Payments 결제가 성공했을 때 리디렉션되는 페이지입니다.
 * 
 * 주요 기능:
 * 1. URL 쿼리 파라미터에서 paymentKey, orderId, amount 추출
 * 2. 결제 승인 API 호출 (approvePayment)
 * 3. 주문 상세 정보 조회
 * 4. 결제 완료 정보 표시 (주문 번호, 결제 금액, 배송 정보, 상품 목록)
 * 5. 영수증 링크 제공
 * 
 * @dependencies
 * - @/actions/payments: approvePayment
 * - @/actions/orders: getOrderWithItems
 * - next/navigation: useRouter, useSearchParams
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { approvePayment } from "@/actions/payments";
import { getOrderWithItems, type GetOrderWithItemsResult } from "@/actions/orders";
import type { TossPaymentResponse } from "@/types/payment";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText, Home, Package } from "lucide-react";
import Link from "next/link";
import { formatPaymentAmount, getPaymentMethodName } from "@/lib/toss-payments";

export default function PaymentSuccessPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isProcessing, setIsProcessing] = useState(true);
  const [payment, setPayment] = useState<TossPaymentResponse | null>(null);
  const [orderData, setOrderData] = useState<GetOrderWithItemsResult["order"] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 로그인 확인
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  // 결제 승인 처리
  useEffect(() => {
    if (!isSignedIn) return;

    const processPayment = async () => {
      console.group("Payment Success - processPayment");

      try {
        // URL 쿼리 파라미터 추출
        const paymentKey = searchParams.get("paymentKey");
        const orderId = searchParams.get("orderId");
        const amount = searchParams.get("amount");

        console.log("Query params:", { paymentKey, orderId, amount });

        if (!paymentKey || !orderId || !amount) {
          setError("결제 정보가 올바르지 않습니다.");
          console.error("Missing required query parameters");
          console.groupEnd();
          setIsProcessing(false);
          return;
        }

        // 결제 승인 API 호출
        console.log("Calling approvePayment...");
        const approvalResult = await approvePayment({
          paymentKey,
          orderId,
          amount: parseInt(amount, 10),
        });

        console.log("Approval result:", approvalResult);

        if (!approvalResult.success) {
          setError(approvalResult.message);
          console.error("Payment approval failed:", approvalResult.message);
          console.groupEnd();
          setIsProcessing(false);
          return;
        }

        // 결제 정보 저장
        if (approvalResult.payment) {
          setPayment(approvalResult.payment);
        }

        // 주문 상세 정보 조회
        console.log("Fetching order details...");
        const orderResult = await getOrderWithItems(orderId);

        console.log("Order result:", orderResult);

        if (orderResult.success && orderResult.order) {
          setOrderData(orderResult.order);
        } else {
          console.warn("Failed to fetch order details:", orderResult.message);
          // 주문 조회 실패는 결제 성공에 영향 없음
        }

        console.groupEnd();
      } catch (err) {
        console.error("Error processing payment:", err);
        setError("결제 처리 중 오류가 발생했습니다.");
        console.groupEnd();
      } finally {
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [isSignedIn, searchParams]);

  // 로딩 중
  if (isProcessing) {
    return (
      <main className="min-h-[calc(100vh-80px)] px-4 py-8 sm:px-8 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-primary" />
            <h2 className="mb-2 text-xl font-semibold">결제 승인 처리 중...</h2>
            <p className="text-muted-foreground">잠시만 기다려주세요.</p>
          </div>
        </div>
      </main>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <main className="min-h-[calc(100vh-80px)] px-4 py-8 sm:px-8 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <FileText className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">결제 처리 실패</h2>
            <p className="mb-6 text-center text-muted-foreground">{error}</p>
            <Link href="/">
              <Button>
                <Home className="mr-2 h-4 w-4" />
                홈으로 돌아가기
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // 결제 성공
  return (
    <main className="min-h-[calc(100vh-80px)] px-4 py-8 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-3xl">
        {/* 성공 메시지 */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
            결제가 완료되었습니다
          </h1>
          <p className="text-muted-foreground">
            주문이 성공적으로 접수되었습니다.
          </p>
        </div>

        <div className="space-y-6">
          {/* 주문 정보 */}
          {orderData && (
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-lg font-bold">주문 정보</h2>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">주문 번호</dt>
                  <dd className="font-mono text-sm">{orderData.id.substring(0, 8)}...</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">결제 금액</dt>
                  <dd className="text-lg font-bold text-primary">
                    {formatPaymentAmount(orderData.total_amount)}
                  </dd>
                </div>
                {payment && (
                  <>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">결제 일시</dt>
                      <dd>
                        {new Date(payment.approvedAt).toLocaleString("ko-KR")}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">결제 방법</dt>
                      <dd>{getPaymentMethodName(payment.method)}</dd>
                    </div>
                  </>
                )}
              </dl>
            </div>
          )}

          {/* 주문 상품 목록 */}
          {orderData && orderData.items && orderData.items.length > 0 && (
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-lg font-bold">
                주문 상품 ({orderData.items.length}개)
              </h2>
              <div className="space-y-3">
                {orderData.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity}개
                      </p>
                    </div>
                    <p className="font-medium">
                      {formatPaymentAmount(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 배송 정보 */}
          {orderData && orderData.shipping_address && (
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-lg font-bold">배송 정보</h2>
              <dl className="space-y-3">
                <div>
                  <dt className="mb-1 text-sm text-muted-foreground">수신자</dt>
                  <dd>
                    {(orderData.shipping_address as any).recipientName}
                  </dd>
                </div>
                <div>
                  <dt className="mb-1 text-sm text-muted-foreground">
                    연락처
                  </dt>
                  <dd>{(orderData.shipping_address as any).phone}</dd>
                </div>
                <div>
                  <dt className="mb-1 text-sm text-muted-foreground">
                    배송 주소
                  </dt>
                  <dd>
                    [{(orderData.shipping_address as any).postalCode}]{" "}
                    {(orderData.shipping_address as any).address}{" "}
                    {(orderData.shipping_address as any).addressDetail}
                  </dd>
                </div>
                {orderData.order_note && (
                  <div>
                    <dt className="mb-1 text-sm text-muted-foreground">
                      배송 메모
                    </dt>
                    <dd className="text-sm">{orderData.order_note}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* 결제 정보 */}
          {payment && payment.card && (
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-lg font-bold">결제 정보</h2>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">카드 번호</dt>
                  <dd className="font-mono text-sm">{payment.card.number}</dd>
                </div>
                {payment.receipt && payment.receipt.url && (
                  <div className="pt-3">
                    <a
                      href={payment.receipt.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-primary hover:underline"
                    >
                      <FileText className="mr-1 h-4 w-4" />
                      영수증 확인
                    </a>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full" size="lg">
                <Home className="mr-2 h-4 w-4" />
                쇼핑 계속하기
              </Button>
            </Link>
            <Link href="/mypage/orders" className="flex-1">
              <Button variant="default" className="w-full" size="lg">
                <Package className="mr-2 h-4 w-4" />
                주문 내역 보기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

