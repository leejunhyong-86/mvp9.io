/**
 * @file constants/payment.ts
 * @description Toss Payments 결제 관련 상수 정의
 * 
 * API URL, 테스트 데이터, 결제 상태 코드 등을 정의합니다.
 */

/**
 * Toss Payments API Base URL
 */
export const TOSS_PAYMENTS_API_URL = "https://api.tosspayments.com/v1";

/**
 * 결제 승인 API 엔드포인트
 */
export const PAYMENT_CONFIRM_ENDPOINT = `${TOSS_PAYMENTS_API_URL}/payments/confirm`;

/**
 * Toss Payments 결제 상태
 */
export const PAYMENT_STATUS = {
  READY: "결제 준비",
  IN_PROGRESS: "결제 진행 중",
  WAITING_FOR_DEPOSIT: "입금 대기",
  DONE: "결제 완료",
  CANCELED: "결제 취소",
  PARTIAL_CANCELED: "부분 취소",
  ABORTED: "결제 중단",
  EXPIRED: "결제 만료",
} as const;

/**
 * 테스트용 카드 정보
 * @see https://docs.tosspayments.com/reference/test-card
 */
export const TEST_CARD_INFO = {
  cardNumber: "5570**********00", // 개발자센터에서 제공하는 테스트 카드
  expiryMonth: "12",
  expiryYear: "30",
  customerIdentityNumber: "000000",
  cardPassword: "00",
  note: "테스트 환경에서는 실제 카드 정보를 입력해도 결제되지 않습니다.",
} as const;

/**
 * 결제 수단 코드
 */
export const PAYMENT_METHOD = {
  CARD: "카드",
  VIRTUAL_ACCOUNT: "가상계좌",
  TRANSFER: "계좌이체",
  MOBILE_PHONE: "휴대폰",
  GIFT_CERTIFICATE: "상품권",
  EASY_PAY: "간편결제",
} as const;

/**
 * 결제 타입
 */
export const PAYMENT_TYPE = {
  NORMAL: "일반결제",
  BILLING: "자동결제",
  BRANDPAY: "브랜드페이",
} as const;

/**
 * 결제 에러 코드 (주요 에러만 정의)
 */
export const PAYMENT_ERROR_CODE = {
  // 인증 관련
  UNAUTHORIZED_KEY: "인증되지 않은 API 키",
  FORBIDDEN_REQUEST: "API 키 또는 주문번호 불일치",
  
  // 결제 관련
  NOT_FOUND_PAYMENT: "결제 정보를 찾을 수 없음",
  NOT_FOUND_PAYMENT_SESSION: "결제 세션을 찾을 수 없음 (10분 초과)",
  ALREADY_PROCESSED_PAYMENT: "이미 처리된 결제",
  PROVIDER_ERROR: "결제 제공자 오류",
  EXCEED_MAX_CARD_INSTALLMENT_PLAN: "카드 할부 개월 수 초과",
  
  // 주문 관련
  NOT_ALLOWED_POINT_USE: "포인트 사용 불가",
  INVALID_REJECT_CARD: "거부된 카드",
  BELOW_MINIMUM_AMOUNT: "최소 결제 금액 미만",
  INVALID_CARD_EXPIRATION: "유효하지 않은 카드 유효기간",
  INVALID_STOPPED_CARD: "정지된 카드",
  
  // 취소 관련
  NOT_CANCELABLE_AMOUNT: "취소 가능 금액 초과",
  NOT_CANCELABLE_PAYMENT: "취소 불가능한 결제",
  CANCELABLE_AMOUNT_EXCEEDED: "취소 가능 금액 초과",
  
  // 기타
  FAILED_INTERNAL_SYSTEM_PROCESSING: "내부 시스템 처리 실패",
  FAILED_METHOD_HANDLING: "결제 수단 처리 실패",
  FAILED_PAYMENT_INTERNAL_SYSTEM_PROCESSING: "결제 시스템 내부 오류",
} as const;

/**
 * 결제 타임아웃 (밀리초)
 */
export const PAYMENT_TIMEOUT = {
  APPROVAL: 10 * 60 * 1000, // 10분 (결제창 열린 후 승인까지)
  API_REQUEST: 30 * 1000, // 30초 (API 요청 타임아웃)
} as const;

/**
 * 결제 금액 제한
 */
export const PAYMENT_AMOUNT_LIMITS = {
  CARD: {
    MIN: 100, // 100원
    MAX: 50_000_000, // 5천만원 (카드사별 상이)
  },
  VIRTUAL_ACCOUNT: {
    MIN: 1, // 1원
    MAX: 999_999_999, // 약 10억원
  },
  TRANSFER: {
    MIN: 200, // 200원
    MAX: 10_000_000, // 1천만원
  },
  MOBILE_PHONE: {
    MIN: 300, // 300원
    MAX: 300_000, // 30만원 (통신사별 상이)
  },
} as const;

