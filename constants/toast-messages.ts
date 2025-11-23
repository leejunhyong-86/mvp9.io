/**
 * @file constants/toast-messages.ts
 * @description 토스트 알림 메시지 상수
 *
 * 애플리케이션 전체에서 사용되는 토스트 메시지를 중앙에서 관리합니다.
 *
 * 주요 카테고리:
 * 1. CART: 장바구니 관련 메시지
 * 2. ORDER: 주문 관련 메시지
 * 3. PAYMENT: 결제 관련 메시지
 * 4. COMMON: 공통 메시지
 */

export const TOAST_MESSAGES = {
  /**
   * 장바구니 관련 메시지
   */
  CART: {
    ADDED: "장바구니에 추가되었습니다",
    REMOVED: "장바구니에서 제거되었습니다",
    UPDATED: "수량이 변경되었습니다",
    CLEARED: "장바구니가 비워졌습니다",
    OUT_OF_STOCK: "재고가 부족합니다",
    MAX_QUANTITY: "최대 수량을 초과했습니다",
    ERROR: "장바구니 처리 중 오류가 발생했습니다",
  },

  /**
   * 주문 관련 메시지
   */
  ORDER: {
    CREATED: "주문이 완료되었습니다",
    UPDATED: "주문 정보가 업데이트되었습니다",
    CANCELLED: "주문이 취소되었습니다",
    CONFIRM_CANCEL: "주문을 취소하시겠습니까?",
    ERROR: "주문 처리 중 오류가 발생했습니다",
    NOT_FOUND: "주문을 찾을 수 없습니다",
    EMPTY_CART: "장바구니가 비어있습니다",
    SELECT_ITEMS: "주문할 상품을 선택해주세요",
  },

  /**
   * 결제 관련 메시지
   */
  PAYMENT: {
    SUCCESS: "결제가 완료되었습니다",
    FAILED: "결제에 실패했습니다",
    CANCELLED: "결제가 취소되었습니다",
    PROCESSING: "결제를 처리하고 있습니다...",
    ERROR: "결제 처리 중 오류가 발생했습니다",
    AMOUNT_MISMATCH: "결제 금액이 일치하지 않습니다",
  },

  /**
   * 폼 검증 관련 메시지
   */
  FORM: {
    INVALID_NAME: "이름을 입력해주세요",
    INVALID_PHONE: "올바른 전화번호를 입력해주세요",
    INVALID_ADDRESS: "주소를 입력해주세요",
    INVALID_POSTAL_CODE: "우편번호를 입력해주세요",
    VALIDATION_ERROR: "입력 정보를 확인해주세요",
  },

  /**
   * 이미지 업로드 관련 메시지
   */
  IMAGE: {
    UPLOADED: "이미지가 업로드되었습니다",
    DELETED: "이미지가 삭제되었습니다",
    SIZE_ERROR: "파일 크기가 너무 큽니다 (최대 5MB)",
    TYPE_ERROR: "지원하지 않는 파일 형식입니다",
    ERROR: "이미지 처리 중 오류가 발생했습니다",
  },

  /**
   * 공통 메시지
   */
  COMMON: {
    SUCCESS: "성공적으로 처리되었습니다",
    ERROR: "오류가 발생했습니다",
    LOADING: "처리 중입니다...",
    NETWORK_ERROR: "네트워크 오류가 발생했습니다",
    UNAUTHORIZED: "로그인이 필요합니다",
    FORBIDDEN: "권한이 없습니다",
    NOT_FOUND: "요청하신 정보를 찾을 수 없습니다",
    SERVER_ERROR: "서버 오류가 발생했습니다",
    TRY_AGAIN: "다시 시도해주세요",
  },
} as const;

/**
 * 토스트 메시지 타입
 */
export type ToastMessageCategory = keyof typeof TOAST_MESSAGES;
export type ToastMessage<T extends ToastMessageCategory> =
  (typeof TOAST_MESSAGES)[T][keyof (typeof TOAST_MESSAGES)[T]];

