/**
 * @file constants/validation.ts
 * @description 배송 정보 검증 관련 상수
 */

/**
 * 전화번호 정규식 (010-0000-0000 또는 010-000-0000 형식)
 */
export const PHONE_REGEX = /^010-\d{3,4}-\d{4}$/;

/**
 * 우편번호 정규식 (5자리 숫자)
 */
export const POSTAL_CODE_REGEX = /^\d{5}$/;

/**
 * 수신자 이름 최소 길이
 */
export const RECIPIENT_NAME_MIN_LENGTH = 2;

/**
 * 수신자 이름 최대 길이
 */
export const RECIPIENT_NAME_MAX_LENGTH = 50;

/**
 * 기본 주소 최소 길이
 */
export const ADDRESS_MIN_LENGTH = 5;

/**
 * 기본 주소 최대 길이
 */
export const ADDRESS_MAX_LENGTH = 200;

/**
 * 상세 주소 최소 길이
 */
export const ADDRESS_DETAIL_MIN_LENGTH = 2;

/**
 * 상세 주소 최대 길이
 */
export const ADDRESS_DETAIL_MAX_LENGTH = 200;

/**
 * 주문 메모 최대 길이
 */
export const ORDER_NOTE_MAX_LENGTH = 200;

/**
 * 에러 메시지
 */
export const VALIDATION_MESSAGES = {
  recipientName: {
    required: '수신자 이름을 입력해주세요.',
    minLength: `수신자 이름은 최소 ${RECIPIENT_NAME_MIN_LENGTH}자 이상이어야 합니다.`,
    maxLength: `수신자 이름은 최대 ${RECIPIENT_NAME_MAX_LENGTH}자까지 입력 가능합니다.`,
  },
  phone: {
    required: '전화번호를 입력해주세요.',
    pattern: '전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)',
  },
  postalCode: {
    required: '우편번호를 입력해주세요.',
    pattern: '우편번호는 5자리 숫자여야 합니다. (예: 12345)',
  },
  address: {
    required: '기본 주소를 입력해주세요.',
    minLength: `기본 주소는 최소 ${ADDRESS_MIN_LENGTH}자 이상이어야 합니다.`,
    maxLength: `기본 주소는 최대 ${ADDRESS_MAX_LENGTH}자까지 입력 가능합니다.`,
  },
  addressDetail: {
    required: '상세 주소를 입력해주세요.',
    minLength: `상세 주소는 최소 ${ADDRESS_DETAIL_MIN_LENGTH}자 이상이어야 합니다.`,
    maxLength: `상세 주소는 최대 ${ADDRESS_DETAIL_MAX_LENGTH}자까지 입력 가능합니다.`,
  },
  orderNote: {
    maxLength: `주문 메모는 최대 ${ORDER_NOTE_MAX_LENGTH}자까지 입력 가능합니다.`,
  },
};

