/**
 * @file actions/payments.ts
 * @description Toss Payments 결제 관련 Server Actions
 * 
 * 결제 승인, 취소 등 Toss Payments API와 연동하는 서버 액션을 제공합니다.
 * 
 * 주요 기능:
 * - 결제 승인 (approvePayment): Toss Payments API 호출 및 주문 상태 업데이트
 * - 금액 검증: 클라이언트 조작 방지
 * - 장바구니 비우기: 결제 완료 시 자동 처리
 * 
 * @dependencies
 * - @clerk/nextjs/server: 사용자 인증
 * - @/lib/supabase/server: Supabase 클라이언트
 * - @/lib/toss-payments: Toss Payments 유틸리티
 */

"use server";

import { auth } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { confirmPayment } from "@/lib/toss-payments";
import { clearCart } from "./cart";
import type {
  PaymentApprovalRequest,
  PaymentApprovalResult,
  TossPaymentResponse,
} from "@/types/payment";

/**
 * 결제 승인 처리
 * 
 * 1. 사용자 인증 확인
 * 2. 주문 정보 조회 및 검증
 * 3. 금액 검증 (클라이언트 조작 방지)
 * 4. Toss Payments 결제 승인 API 호출
 * 5. 주문 상태 업데이트 (pending → confirmed)
 * 6. 장바구니 비우기
 * 
 * @param params - 결제 승인 요청 파라미터 (paymentKey, orderId, amount)
 * @returns 결제 승인 결과 및 Payment 객체
 * 
 * @example
 * const result = await approvePayment({
 *   paymentKey: 'paymentKey123',
 *   orderId: 'order-uuid',
 *   amount: 15000
 * });
 * 
 * if (result.success) {
 *   console.log('결제 성공:', result.payment);
 * }
 */
export async function approvePayment(
  params: PaymentApprovalRequest
): Promise<PaymentApprovalResult> {
  try {
    console.group("approvePayment Server Action");
    console.log("Params:", {
      orderId: params.orderId,
      amount: params.amount,
      paymentKey: params.paymentKey.substring(0, 20) + "...",
    });

    // 1. 사용자 인증 확인
    const { userId } = await auth();

    if (!userId) {
      console.log("Unauthorized: No user ID");
      console.groupEnd();
      return {
        success: false,
        message: "로그인이 필요합니다.",
      };
    }

    // 2. 주문 정보 조회
    const supabase = createClerkSupabaseClient();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", params.orderId)
      .eq("clerk_id", userId)
      .single();

    if (orderError || !order) {
      console.error("Order not found:", orderError);
      console.groupEnd();
      return {
        success: false,
        message: "주문 정보를 찾을 수 없습니다.",
      };
    }

    // 3. 주문 상태 검증
    if (order.status !== "pending") {
      console.log("Order already processed:", order.status);
      console.groupEnd();
      return {
        success: false,
        message: "이미 처리된 주문입니다.",
      };
    }

    // 4. 금액 검증 (클라이언트 조작 방지)
    if (order.total_amount !== params.amount) {
      console.error("Amount mismatch:", {
        orderAmount: order.total_amount,
        requestAmount: params.amount,
      });
      console.groupEnd();
      return {
        success: false,
        message: "결제 금액이 일치하지 않습니다.",
      };
    }

    // 5. Toss Payments 결제 승인 API 호출
    const secretKey = process.env.TOSS_SECRET_KEY;

    if (!secretKey) {
      console.error("Missing TOSS_SECRET_KEY");
      console.groupEnd();
      return {
        success: false,
        message: "결제 설정이 올바르지 않습니다.",
      };
    }

    let payment: TossPaymentResponse;

    try {
      payment = await confirmPayment(params, secretKey);
    } catch (error) {
      console.error("Payment confirmation failed:", error);
      console.groupEnd();
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "결제 승인에 실패했습니다.",
      };
    }

    // 6. 결제 승인 상태 확인
    if (payment.status !== "DONE") {
      console.warn("Payment not completed:", payment.status);
      console.groupEnd();
      return {
        success: false,
        message: `결제 상태가 올바르지 않습니다: ${payment.status}`,
      };
    }

    // 7. 주문 상태 업데이트 (pending → confirmed)
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "confirmed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.orderId)
      .eq("clerk_id", userId);

    if (updateError) {
      console.error("Failed to update order status:", updateError);
      // 결제는 완료되었으나 DB 업데이트 실패
      // 실제 운영에서는 수동 처리 또는 재시도 로직 필요
      console.groupEnd();
      return {
        success: true, // 결제 자체는 성공
        message: "결제는 완료되었으나 주문 상태 업데이트에 실패했습니다.",
        payment,
      };
    }

    // 8. 장바구니 비우기
    try {
      await clearCart();
      console.log("Cart cleared successfully");
    } catch (cartError) {
      console.warn("Failed to clear cart:", cartError);
      // 장바구니 비우기 실패는 결제 성공에 영향 없음
    }

    console.log("Payment approval completed successfully");
    console.groupEnd();

    return {
      success: true,
      message: "결제가 완료되었습니다.",
      payment,
    };
  } catch (error) {
    console.error("Unexpected error in approvePayment:", error);
    console.groupEnd();
    return {
      success: false,
      message: "예기치 않은 오류가 발생했습니다.",
    };
  }
}

