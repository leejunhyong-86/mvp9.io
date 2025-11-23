/**
 * @file lib/toss-payments.ts
 * @description Toss Payments v1 API 유틸리티 함수
 * 
 * 결제 승인, 인증 헤더 생성 등 Toss Payments API 관련 유틸리티를 제공합니다.
 */

import { PAYMENT_CONFIRM_ENDPOINT } from "@/constants/payment";
import type {
  PaymentApprovalRequest,
  TossPaymentResponse,
} from "@/types/payment";

/**
 * 시크릿 키를 Base64로 인코딩하여 Basic 인증 헤더 값 생성
 * 
 * @param secretKey - Toss Payments 시크릿 키
 * @returns Base64 인코딩된 인증 문자열
 * 
 * @example
 * const authHeader = encodeSecretKey('test_sk_...');
 * // Returns: 'Basic dGVzdF9za18uLi46'
 */
export function encodeSecretKey(secretKey: string): string {
  // 시크릿 키 뒤에 ':' 추가 (Toss Payments 요구사항)
  const encoded = Buffer.from(`${secretKey}:`).toString("base64");
  return `Basic ${encoded}`;
}

/**
 * Toss Payments 결제 승인 API 호출
 * 
 * @param params - 결제 승인 요청 파라미터
 * @param secretKey - Toss Payments 시크릿 키
 * @returns 결제 승인 응답 객체
 * @throws Error - API 호출 실패 시
 * 
 * @example
 * const payment = await confirmPayment({
 *   paymentKey: 'paymentKey123',
 *   orderId: 'order123',
 *   amount: 15000
 * }, process.env.TOSS_SECRET_KEY!);
 */
export async function confirmPayment(
  params: PaymentApprovalRequest,
  secretKey: string
): Promise<TossPaymentResponse> {
  console.group("confirmPayment");
  console.log("Request params:", {
    orderId: params.orderId,
    amount: params.amount,
    paymentKey: params.paymentKey.substring(0, 20) + "...",
  });

  try {
    const response = await fetch(PAYMENT_CONFIRM_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: encodeSecretKey(secretKey),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Payment confirmation failed:", {
        status: response.status,
        error: data,
      });
      throw new Error(data.message || "결제 승인에 실패했습니다.");
    }

    console.log("Payment confirmed successfully:", {
      orderId: data.orderId,
      status: data.status,
      method: data.method,
    });
    console.groupEnd();

    return data as TossPaymentResponse;
  } catch (error) {
    console.error("Error in confirmPayment:", error);
    console.groupEnd();
    throw error;
  }
}

/**
 * 결제 금액 포맷팅 (한국 원화)
 * 
 * @param amount - 금액 (숫자)
 * @returns 포맷팅된 금액 문자열
 * 
 * @example
 * formatPaymentAmount(15000) // "15,000원"
 */
export function formatPaymentAmount(amount: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount);
}

/**
 * 결제 방법 한글 변환
 * 
 * @param method - 결제 방법 코드
 * @returns 한글 결제 방법명
 */
export function getPaymentMethodName(method: string): string {
  const methodMap: Record<string, string> = {
    CARD: "카드",
    카드: "카드",
    VIRTUAL_ACCOUNT: "가상계좌",
    가상계좌: "가상계좌",
    TRANSFER: "계좌이체",
    계좌이체: "계좌이체",
    MOBILE_PHONE: "휴대폰",
    휴대폰: "휴대폰",
    GIFT_CERTIFICATE: "상품권",
    상품권: "상품권",
    EASY_PAY: "간편결제",
    간편결제: "간편결제",
  };

  return methodMap[method] || method;
}

/**
 * 카드 번호 마스킹 처리 (이미 마스킹된 경우 그대로 반환)
 * 
 * @param cardNumber - 카드 번호
 * @returns 마스킹된 카드 번호
 * 
 * @example
 * maskCardNumber("1234567812345678") // "1234-****-****-5678"
 */
export function maskCardNumber(cardNumber: string): string {
  // 이미 마스킹된 경우 그대로 반환
  if (cardNumber.includes("*")) {
    return cardNumber;
  }

  // 숫자만 추출
  const numbers = cardNumber.replace(/\D/g, "");

  if (numbers.length < 8) {
    return cardNumber;
  }

  // 앞 4자리와 뒤 4자리만 표시
  const first = numbers.substring(0, 4);
  const last = numbers.substring(numbers.length - 4);

  return `${first}-****-****-${last}`;
}

