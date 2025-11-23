# Phase 3: 주문 프로세스 구현 완료

## 구현 개요

장바구니에서 선택한 아이템을 기반으로 주문을 생성하는 체크아웃 프로세스를 완료했습니다.

## 생성된 파일

### 1. 타입 정의
- **`types/order.ts`**: 주문 관련 타입 정의
  - `ShippingAddress`: 배송 정보
  - `OrderFormData`: 폼 입력 데이터
  - `OrderStatus`: 주문 상태 타입
  - `Order`: 주문 정보
  - `OrderItem`: 주문 상품 정보
  - `OrderWithItems`: 주문 + 상품 목록

### 2. 검증 상수
- **`constants/validation.ts`**: 배송 정보 검증 규칙
  - 정규식: 전화번호, 우편번호
  - 길이 제한: 이름, 주소, 메모
  - 에러 메시지 정의

### 3. Server Actions
- **`actions/orders.ts`**: 주문 관련 Server Actions
  - `createOrder()`: 주문 생성
    - 장바구니 아이템 검증
    - 상품 활성화 상태 및 재고 확인
    - 총 금액 계산 (상품 금액 + 배송비)
    - `orders` 테이블 INSERT
    - `order_items` 테이블 INSERT (상품명/가격 스냅샷)
  - `getOrder()`: 주문 상세 조회

### 4. 컴포넌트
- **`components/checkout-form.tsx`**: 배송 정보 입력 폼
  - react-hook-form + zod 검증
  - forwardRef로 외부 제출 트리거 지원
  - 6개 입력 필드 (이름, 전화번호, 우편번호, 주소, 상세주소, 메모)

- **`components/checkout-summary.tsx`**: 주문 요약
  - 선택된 상품 목록 (읽기 전용)
  - 금액 계산 (상품 금액 + 배송비)
  - 결제하기 버튼
  - 품절/재고 부족 상품 안내

- **`components/cart-summary.tsx`**: 장바구니 요약 업데이트
  - 선택된 아이템 ID를 쿼리 파라미터로 전달 (`/checkout?items=id1,id2,id3`)

### 5. 페이지
- **`app/checkout/page.tsx`**: 주문 페이지
  - URL 쿼리 파라미터에서 선택된 아이템 ID 추출
  - 장바구니 아이템 조회 및 필터링
  - 2열 그리드 레이아웃 (폼 | 요약)
  - 주문 생성 및 홈 리디렉션 (임시)

- **`app/checkout/loading.tsx`**: 로딩 스켈레톤 UI

### 6. 문서
- **`docs/CHECKOUT_TEST.md`**: 통합 테스트 가이드
- **`docs/CHECKOUT_IMPLEMENTATION.md`**: 구현 요약 (이 파일)

## 주요 기능

### 1. 장바구니 → 주문 플로우
```
장바구니 선택 → 주문하기 클릭 → /checkout?items=... → 배송 정보 입력 → 결제하기 → 주문 생성
```

### 2. 배송 정보 검증
- **수신자 이름**: 2-50자
- **전화번호**: `010-0000-0000` 또는 `010-000-0000` 형식
- **우편번호**: 5자리 숫자
- **기본 주소**: 5-200자
- **상세 주소**: 2-200자
- **배송 메모**: 선택, 최대 200자

### 3. 주문 생성 프로세스
1. Clerk 인증 확인
2. 선택된 장바구니 아이템 조회
3. 상품 검증 (활성화, 재고)
4. 총 금액 계산 (상품 + 배송비)
5. `orders` 테이블 INSERT (status='pending')
6. `order_items` 테이블 INSERT (상품명/가격 스냅샷)
7. 성공 시 orderId 반환

### 4. 금액 계산
- **총 상품 금액**: Σ(상품 가격 × 수량)
- **배송비**: 5만원 이상 무료, 미만 3,000원
- **최종 결제 금액**: 총 상품 금액 + 배송비

## 데이터베이스 스키마 활용

### orders 테이블
```sql
- id: UUID (PK)
- clerk_id: TEXT (사용자 ID)
- total_amount: DECIMAL(10,2) (최종 금액)
- status: TEXT ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')
- shipping_address: JSONB (배송 정보)
- order_note: TEXT (주문 메모)
- created_at, updated_at: TIMESTAMPTZ
```

### order_items 테이블
```sql
- id: UUID (PK)
- order_id: UUID (FK → orders)
- product_id: UUID (FK → products)
- product_name: TEXT (주문 시점 스냅샷)
- quantity: INTEGER
- price: DECIMAL(10,2) (주문 시점 스냅샷)
- created_at: TIMESTAMPTZ
```

## 로깅 및 디버깅

모든 주요 단계에 `console.group` 및 `console.log` 추가:

### 클라이언트
- `fetchCartItems`: 장바구니 조회
- `handleFormSubmit`: 폼 제출

### 서버
- `createOrder`: 주문 생성
  - User ID
  - Selected Cart Item IDs
  - Shipping Address
  - Order Note
  - Cart items fetched: N
  - All products validated
  - Total product price: XXX
  - Shipping fee: XXX
  - Total amount: XXX
  - Order created: {orderId}
  - Order items created: N

## 에러 처리

### 검증 에러
- ✅ 로그인 필요 → `/sign-in?returnUrl=/checkout`
- ✅ 선택된 상품 없음 → 안내 메시지
- ✅ 상품 비활성화 → "판매 중단된 상품입니다"
- ✅ 재고 부족 → "재고가 부족합니다 (현재 재고: N개)"
- ✅ 폼 검증 실패 → 각 필드별 에러 메시지

### 시스템 에러
- ✅ 장바구니 조회 실패
- ✅ 주문 생성 실패
- ✅ 주문 상품 등록 실패

## 빌드 결과

```
✓ Compiled successfully
✓ Generating static pages (11/11)

Route (app)                    Size  First Load JS
├ ○ /checkout               30.3 kB         173 kB
```

**빌드 성공**: 모든 TypeScript 오류 해결 ✅

## 다음 단계 (Phase 4: 결제 통합)

1. Toss Payments MCP 연동
2. 결제 버튼 연동
3. 결제 성공/실패 페이지 구현
4. 결제 완료 후 처리:
   - 주문 상태 업데이트 (pending → confirmed)
   - 장바구니 비우기
   - 재고 차감 (선택)
   - 주문 완료 페이지로 리디렉션

## 테스트 방법

상세한 테스트 가이드는 `docs/CHECKOUT_TEST.md` 참조.

### 빠른 테스트
1. `pnpm dev` 실행
2. 로그인
3. 상품을 장바구니에 담기
4. 장바구니에서 상품 선택 후 "주문하기" 클릭
5. 배송 정보 입력
6. "결제하기" 클릭
7. Supabase Dashboard에서 `orders`, `order_items` 테이블 확인

## 주요 고려사항

- ✅ 쿼리 파라미터로 선택된 아이템 전달
- ✅ 주문 시점 상품명/가격 스냅샷 저장
- ✅ 재고 확인은 주문 생성 시점에 수행
- ✅ 장바구니 비우기는 결제 완료 후 수행 (Phase 4)
- ✅ console.log로 디버깅 용이

## 프로젝트 구조

```
nextjs-supabase-boilerplate-main/
├── types/
│   └── order.ts                    ← 주문 타입
├── constants/
│   └── validation.ts               ← 검증 규칙
├── actions/
│   └── orders.ts                   ← 주문 Server Actions
├── components/
│   ├── checkout-form.tsx           ← 배송 정보 폼
│   ├── checkout-summary.tsx        ← 주문 요약
│   └── cart-summary.tsx            ← 업데이트됨
├── app/
│   └── checkout/
│       ├── page.tsx                ← 주문 페이지
│       └── loading.tsx             ← 로딩 UI
└── docs/
    ├── CHECKOUT_TEST.md            ← 테스트 가이드
    └── CHECKOUT_IMPLEMENTATION.md  ← 구현 요약
```

## 성능

- 주문 페이지 크기: 30.3 kB
- First Load JS: 173 kB
- 빌드 시간: ~5초
- 정적 페이지 생성: 성공

## 완료 체크리스트

- [x] 타입 정의 (`types/order.ts`, `constants/validation.ts`)
- [x] Server Action (`actions/orders.ts`)
- [x] Cart Summary 업데이트
- [x] 배송 정보 폼 (`components/checkout-form.tsx`)
- [x] 주문 요약 (`components/checkout-summary.tsx`)
- [x] 주문 페이지 (`app/checkout/page.tsx`, `loading.tsx`)
- [x] 통합 테스트 가이드 작성
- [x] 빌드 검증
- [x] 구현 문서 작성

