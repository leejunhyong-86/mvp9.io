# 결제 통합 설정 가이드

이 문서는 Toss Payments v1 API 통합을 위한 설정 가이드입니다.

## 환경 변수 설정

`.env.local` 파일에 다음 환경 변수를 추가하세요:

```bash
# Toss Payments
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq
TOSS_SECRET_KEY=test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R
```

**주의**: 위의 키는 Toss Payments에서 제공하는 **테스트용 키**입니다. 실제 운영 환경에서는 Toss Payments 개발자센터에서 발급받은 실제 키를 사용해야 합니다.

### 키 설명

- `NEXT_PUBLIC_TOSS_CLIENT_KEY`: 클라이언트에서 Toss Payments SDK를 초기화할 때 사용하는 공개 키
- `TOSS_SECRET_KEY`: 서버에서 결제 승인 API를 호출할 때 사용하는 비밀 키 (절대 클라이언트에 노출되어서는 안 됨)

## Toss Payments 개발자센터 설정

실제 운영 키를 발급받으려면:

1. [Toss Payments 개발자센터](https://developers.tosspayments.com/)에 회원가입
2. 새 프로젝트 생성
3. API 키 발급
4. `.env.local`에 발급받은 키 입력

## 테스트 카드 정보

테스트 환경에서 사용할 수 있는 카드 정보:

- **카드 번호**: 아무 카드 번호 (실제 카드 번호를 입력해도 결제되지 않음)
- **유효기간**: 미래 날짜
- **CVC**: 임의의 3자리 숫자
- **생년월일**: 임의의 6자리 숫자
- **카드 비밀번호 앞 2자리**: 임의의 2자리 숫자

## 결제 플로우

### 1. 장바구니 → 주문 페이지

사용자가 장바구니에서 상품을 선택하고 "주문하기" 버튼을 클릭하면 `/checkout` 페이지로 이동합니다.

```
/cart?items=item1,item2,item3 → /checkout?items=item1,item2,item3
```

### 2. 주문 페이지 (Checkout)

- 배송 정보 입력 (수신자 이름, 전화번호, 주소 등)
- 주문 요약 (상품 목록, 배송비, 총 금액)
- "결제하기" 버튼 클릭

#### 내부 동작

1. **주문 생성** (status='pending')
   - `createOrder` Server Action 호출
   - 주문 데이터베이스에 저장 (아직 결제되지 않은 상태)

2. **Toss Payments SDK 초기화**
   - `window.TossPayments(clientKey)` 호출

3. **결제창 열기**
   - `requestPayment('카드', {...})` 호출
   - 사용자가 카드 정보 입력
   - 결제 승인/실패

### 3. 결제 성공 시 (`/payment/success`)

Toss Payments가 자동으로 리디렉션하며, URL 쿼리 파라미터로 결제 정보를 전달합니다:

```
/payment/success?paymentKey=xxx&orderId=xxx&amount=xxx
```

#### 내부 동작

1. **결제 승인 API 호출** (`approvePayment`)
   - Toss Payments API에 결제 승인 요청
   - 주문 정보 및 금액 검증
   - 주문 상태 업데이트 (pending → confirmed)

2. **장바구니 비우기**
   - `clearCart` 호출

3. **결제 완료 정보 표시**
   - 주문 번호
   - 결제 금액
   - 결제 일시
   - 결제 방법
   - 배송 정보
   - 주문 상품 목록
   - 영수증 링크

### 4. 결제 실패 시 (`/payment/fail`)

Toss Payments가 자동으로 리디렉션하며, URL 쿼리 파라미터로 오류 정보를 전달합니다:

```
/payment/fail?code=xxx&message=xxx&orderId=xxx
```

#### 내부 동작

1. **오류 정보 표시**
   - 에러 코드
   - 에러 메시지 (사용자 친화적으로 변환)

2. **액션 버튼**
   - 재결제 버튼 (checkout 페이지로 이동)
   - 장바구니로 돌아가기
   - 홈으로 돌아가기

## 주요 파일 구조

```
├── types/
│   └── payment.ts                    # Toss Payments 타입 정의
├── constants/
│   └── payment.ts                    # 결제 관련 상수
├── lib/
│   └── toss-payments.ts              # Toss Payments 유틸리티
├── actions/
│   └── payments.ts                   # 결제 Server Actions
├── app/
│   ├── checkout/
│   │   └── page.tsx                  # 주문 페이지 (SDK 통합)
│   └── payment/
│       ├── success/
│       │   ├── page.tsx              # 결제 성공 페이지
│       │   └── loading.tsx           # 로딩 UI
│       └── fail/
│           └── page.tsx              # 결제 실패 페이지
└── docs/
    └── PAYMENT_SETUP.md              # 이 문서
```

## 보안 고려사항

### 환경 변수 관리

- `NEXT_PUBLIC_*` 접두사가 붙은 변수는 클라이언트에 노출됩니다.
- `TOSS_SECRET_KEY`는 **절대로** `NEXT_PUBLIC_` 접두사를 붙이지 마세요.
- `.env.local` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.
- 운영 환경에서는 Vercel/AWS 등의 환경 변수 관리 기능을 사용하세요.

### 금액 검증

결제 승인 API 호출 시 서버에서 주문 금액을 검증합니다:

```typescript
// actions/payments.ts
if (order.total_amount !== params.amount) {
  return {
    success: false,
    message: "결제 금액이 일치하지 않습니다.",
  };
}
```

이를 통해 클라이언트에서 금액을 조작하는 것을 방지합니다.

### 주문 상태 관리

주문은 다음 상태를 거칩니다:

1. **pending**: 주문 생성 직후 (결제 전)
2. **confirmed**: 결제 승인 완료
3. **cancelled**: 주문 취소 (Phase 5에서 구현)
4. **delivered**: 배송 완료 (Phase 5에서 구현)

결제 승인 시에만 `pending → confirmed`로 변경되므로, 미결제 주문은 자동으로 필터링됩니다.

## 트러블슈팅

### 결제창이 열리지 않아요

1. Toss Payments SDK가 로드되었는지 확인
   - 개발자 도구 콘솔에서 `window.TossPayments` 확인
2. `NEXT_PUBLIC_TOSS_CLIENT_KEY` 환경 변수 확인
3. 브라우저 콘솔에서 에러 메시지 확인

### 결제 승인이 실패해요

1. `TOSS_SECRET_KEY` 환경 변수 확인
2. 서버 콘솔/로그에서 에러 메시지 확인
3. Toss Payments 개발자센터에서 API 호출 로그 확인

### 주문 상태가 업데이트되지 않아요

1. 결제 승인 API가 성공했는지 확인 (콘솔 로그)
2. Supabase 데이터베이스에서 주문 상태 확인
3. RLS 정책이 올바른지 확인

## 다음 단계

Phase 5에서는 다음 기능을 추가할 예정입니다:

- 주문 내역 페이지 (`/orders`)
- 주문 상세 페이지 (`/orders/[id]`)
- 주문 취소 기능
- 주문 상태 변경 (배송 중, 배송 완료)
- 관리자 페이지 (주문 관리)

## 참고 자료

- [Toss Payments v1 API 문서](https://docs.tosspayments.com/guides/v1/payment-widget)
- [Toss Payments 개발자센터](https://developers.tosspayments.com/)
- [테스트 카드 정보](https://docs.tosspayments.com/reference/test-card)

