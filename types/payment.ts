/**
 * @file types/payment.ts
 * @description Toss Payments v1 API 관련 타입 정의
 * 
 * Toss Payments v1 결제창 API의 응답 객체와 요청 파라미터 타입을 정의합니다.
 * 
 * @see https://docs.tosspayments.com/reference#payment-객체
 */

/**
 * Toss Payments 결제 승인 응답 객체
 */
export interface TossPaymentResponse {
  mId: string;
  version: string;
  paymentKey: string;
  orderId: string;
  orderName: string;
  status: "READY" | "IN_PROGRESS" | "WAITING_FOR_DEPOSIT" | "DONE" | "CANCELED" | "PARTIAL_CANCELED" | "ABORTED" | "EXPIRED";
  requestedAt: string;
  approvedAt: string;
  useEscrow: boolean;
  cultureExpense: boolean;
  
  // 결제 수단별 정보
  card: TossCardInfo | null;
  virtualAccount: TossVirtualAccountInfo | null;
  transfer: TossTransferInfo | null;
  mobilePhone: TossMobilePhoneInfo | null;
  giftCertificate: TossGiftCertificateInfo | null;
  
  // 현금영수증 정보
  cashReceipt: TossCashReceiptInfo | null;
  cashReceipts: TossCashReceiptInfo[] | null;
  
  // 결제 금액 정보
  totalAmount: number;
  balanceAmount: number;
  suppliedAmount: number;
  vat: number;
  taxFreeAmount: number;
  taxExemptionAmount?: number;
  
  // 취소 정보
  cancels: TossCancelInfo[] | null;
  
  // 기타
  type: "NORMAL" | "BILLING" | "BRANDPAY";
  easyPay: string | null;
  country: string;
  failure: TossFailureInfo | null;
  isPartialCancelable: boolean;
  receipt: {
    url: string;
  };
  checkout: {
    url: string;
  };
  currency: string;
  method: string;
  discount: TossDiscountInfo | null;
  metadata: Record<string, string> | null;
  secret: string | null;
}

/**
 * 카드 결제 정보
 */
export interface TossCardInfo {
  issuerCode: string;
  acquirerCode: string;
  number: string; // 마스킹된 카드 번호 (예: "12345678****789*")
  installmentPlanMonths: number;
  isInterestFree: boolean;
  interestPayer: string | null;
  approveNo: string;
  useCardPoint: boolean;
  cardType: "CREDIT" | "DEBIT" | "GIFT";
  ownerType: "PERSONAL" | "CORPORATE";
  acquireStatus: "READY" | "REQUESTED" | "COMPLETED" | "CANCEL_REQUESTED" | "CANCELED";
  amount: number;
}

/**
 * 가상계좌 정보
 */
export interface TossVirtualAccountInfo {
  accountNumber: string;
  accountType: "일반" | "고정";
  bankCode: string;
  customerName: string;
  dueDate: string;
  refundStatus: "NONE" | "PENDING" | "FAILED" | "PARTIAL_FAILED" | "COMPLETED";
  expired: boolean;
  settlementStatus: "INCOMPLETE" | "COMPLETED";
  refundReceiveAccount: {
    bankCode: string;
    accountNumber: string;
    holderName: string;
  } | null;
}

/**
 * 계좌이체 정보
 */
export interface TossTransferInfo {
  bankCode: string;
  settlementStatus: "INCOMPLETE" | "COMPLETED";
}

/**
 * 휴대폰 결제 정보
 */
export interface TossMobilePhoneInfo {
  customerMobilePhone: string;
  settlementStatus: "INCOMPLETE" | "COMPLETED";
  receiptUrl: string;
}

/**
 * 상품권 결제 정보
 */
export interface TossGiftCertificateInfo {
  approveNo: string;
  settlementStatus: "INCOMPLETE" | "COMPLETED";
}

/**
 * 현금영수증 정보
 */
export interface TossCashReceiptInfo {
  type: "소득공제" | "지출증빙";
  receiptKey: string;
  issueNumber: string;
  receiptUrl: string;
  amount: number;
  taxFreeAmount: number;
}

/**
 * 취소 정보
 */
export interface TossCancelInfo {
  cancelAmount: number;
  cancelReason: string;
  taxFreeAmount: number;
  taxExemptionAmount: number;
  refundableAmount: number;
  easyPayDiscountAmount: number;
  canceledAt: string;
  transactionKey: string;
  receiptKey: string | null;
}

/**
 * 결제 실패 정보
 */
export interface TossFailureInfo {
  code: string;
  message: string;
}

/**
 * 할인 정보
 */
export interface TossDiscountInfo {
  amount: number;
}

/**
 * 결제 승인 요청 파라미터
 */
export interface PaymentApprovalRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
}

/**
 * 결제 승인 결과
 */
export interface PaymentApprovalResult {
  success: boolean;
  message: string;
  payment?: TossPaymentResponse;
}

/**
 * 결제창 요청 파라미터
 */
export interface TossPaymentRequestParams {
  amount: number;
  orderId: string;
  orderName: string;
  customerName?: string;
  customerEmail?: string;
  successUrl: string;
  failUrl: string;
}

