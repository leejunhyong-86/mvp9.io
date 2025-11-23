# 쇼핑몰 MVP 개발 TODO

## 📌 최근 완료 사항

### 2025-11-23: Unsplash 상품 이미지 통합 ✅
- **`supabase/migrations/20251123160000_update_product_images.sql`**: 마이그레이션 파일 생성
  - 20개 상품에 대한 Unsplash 고품질 이미지 URL 업데이트
  - 각 상품당 3-4개의 이미지 배열로 저장
  - 카테고리별 맞춤 이미지 (전자제품, 의류, 도서, 식품, 스포츠, 뷰티, 생활/가정)

- **`next.config.ts`**: 이미지 최적화 설정
  - Unsplash 이미지 호스트 추가 (`images.unsplash.com`)
  - Next.js Image 컴포넌트에서 Unsplash 이미지 로드 가능
  - 기존 Clerk, Supabase Storage 호스트와 함께 설정

- **이미지 데이터**:
  - 전자제품 (5개): 블루투스 이어폰, 스마트워치, 보조배터리, 무선 마우스, USB 허브
  - 의류 (4개): 티셔츠, 후드 자켓, 청바지, 레깅스
  - 도서 (3개): 클린 코드, 이펙티브 타입스크립트, HTTP 완벽 가이드
  - 식품 (3개): 원두 커피, 유기농 아몬드, 올리브 오일
  - 스포츠 (2개): 요가 매트, 덤벨 세트
  - 뷰티 (2개): 비타민C 세럼, 선크림
  - 생활/가정 (1개): 디퓨저 세트

**주요 기능:**
- ✅ Unsplash API를 통한 고품질 상품 이미지 수집 (80개 이상)
- ✅ 카테고리별 맞춤 이미지 선정
- ✅ Next.js Image 최적화 준비 완료
- ✅ 상품 상세 페이지 이미지 갤러리 지원
- ✅ 썸네일 갤러리 UI 정상 동작

**다음 단계:**
- ⚠️ Supabase Dashboard에서 마이그레이션 실행 필요
  - SQL Editor에서 `supabase/migrations/20251123160000_update_product_images.sql` 실행
  - 또는 터미널에서 `npx supabase db push` 실행

### 2025-11-23: Phase 5 마이페이지 구현 ✅
- **`types/order.ts`**: 타입 확장
  - OrderSortOption: 정렬 옵션 타입
  - OrderListItem: 주문 목록용 타입 (첫 번째 상품명, 총 상품 수 포함)

- **`constants/orders.ts`**: 주문 관련 상수 정의 (신규 생성)
  - ORDER_STATUS_LABELS: 상태별 한글 라벨
  - ORDER_STATUS_COLORS: 상태별 색상
  - ORDERS_PER_PAGE: 페이지당 주문 수 (10개)
  - SORT_OPTIONS: 정렬 옵션 목록
  - STATUS_FILTERS: 상태 필터 옵션

- **`actions/orders.ts`**: Server Actions 확장
  - getUserOrders(): 사용자 주문 목록 조회
    - 상태별 필터 (all, pending, confirmed, shipped, delivered, cancelled)
    - 정렬 옵션 (최신순, 오래된순, 금액 높은순, 금액 낮은순)
    - 페이지네이션 (10개씩)
    - order_items와 함께 조회하여 OrderListItem 생성

- **`app/mypage/layout.tsx`**: 마이페이지 레이아웃
  - 로그인 확인 (비로그인 시 리디렉션)
  - 2열 레이아웃 (데스크톱: 사이드바 + 콘텐츠)
  - 모바일: 상단 탭 메뉴
  - 사이드바 메뉴: 주문 내역, 회원 정보(비활성), 배송지 관리(비활성)

- **`components/order-card.tsx`**: 주문 카드 컴포넌트
  - 주문 번호 (앞 8자리)
  - 주문 날짜
  - 주문 상태 뱃지
  - 대표 상품명 + "외 N개"
  - 총 결제 금액
  - 클릭 시 상세 페이지로 이동

- **`components/orders-filter.tsx`**: 주문 필터 컴포넌트
  - 상태별 필터 탭 (개수 표시)
  - 정렬 Select
  - URL 동기화

- **`app/mypage/orders/page.tsx`**: 주문 목록 페이지
  - 주문 목록 조회 및 표시
  - 상태별 필터, 정렬, 페이지네이션
  - 빈 상태 처리

- **`app/mypage/orders/loading.tsx`**: 주문 목록 로딩 UI
  - 필터, 정렬, 카드 스켈레톤

- **`app/mypage/orders/[id]/page.tsx`**: 주문 상세 페이지
  - 주문 정보 섹션
  - 주문 상품 목록 (상품명, 수량, 가격)
  - 금액 요약 (상품 금액 + 배송비 = 최종 결제 금액)
  - 배송 정보 섹션
  - 404 처리

- **`app/mypage/orders/[id]/loading.tsx`**: 주문 상세 로딩 UI

- **`components/skeletons/order-card-skeleton.tsx`**: 주문 카드 스켈레톤 (신규 생성)

- **`components/Navbar.tsx`**: 마이페이지 버튼 추가
  - Package 아이콘
  - 로그인 사용자에게만 표시 (SignedIn)
  - 클릭 시 `/mypage/orders`로 이동
  - 비로그인 시 로그인 페이지로 리디렉션

- **`app/payment/success/page.tsx`**: 주문 내역 보기 버튼 활성화
  - disabled 제거
  - `/mypage/orders`로 링크 연결

**주요 기능:**
- ✅ 사용자별 주문 목록 조회
- ✅ 상태별 필터링 (전체, 결제완료, 배송중, 배송완료, 취소됨)
- ✅ 정렬 기능 (최신순, 오래된순, 금액순)
- ✅ 페이지네이션
- ✅ 주문 상세 정보 표시
- ✅ Navbar에서 마이페이지 접근
- ✅ 결제 성공 후 주문 내역으로 이동

### 2025-11-23: 배송정보 입력 개선 ✅
- **`constants/validation.ts`**: 전화번호 검증 규칙 개선
  - 전화번호 하이픈 선택사항으로 변경 (`010-1234-5678` 또는 `01012345678` 모두 허용)
  - 정규식: `/^010-?\d{3,4}-?\d{4}$/`
  - 에러 메시지 업데이트 (두 가지 형식 예시 표시)
  
- **`components/checkout-form.tsx`**: Daum 우편번호 서비스 통합
  - Daum Postcode API 스크립트 동적 로드
  - 주소 검색 버튼 추가 (우편번호 필드 옆에 배치)
  - 주소 검색 팝업 구현
  - 도로명/지번 주소 검색 지원
  - 주소 선택 시 우편번호 및 기본 주소 자동 입력
  - 상세 주소 입력 필드로 자동 포커스 이동
  - 우편번호/기본 주소 필드 readOnly 설정 (검색을 통해서만 입력)
  - Search 아이콘 추가 (lucide-react)

**주요 개선사항:**
- ✅ 전화번호 입력 유연성 향상 (하이픈 있음/없음 모두 허용)
- ✅ 주소 입력 편의성 대폭 향상 (수동 입력 → 검색 기반)
- ✅ 도로명 주소와 지번 주소 모두 검색 가능
- ✅ 입력 오류 감소 (자동 완성)

### 2025-01-23: Phase 3 주문 프로세스 구현 ✅
- **`types/order.ts`**: 주문 관련 타입 정의
  - ShippingAddress, OrderFormData, Order, OrderItem
  
- **`constants/validation.ts`**: 배송 정보 검증 규칙
  - 전화번호, 우편번호 정규식
  - 이름, 주소, 메모 길이 제한
  - 에러 메시지 정의
  
- **`actions/orders.ts`**: 주문 Server Actions
  - `createOrder()`: 주문 생성 (재고 검증, 금액 계산, 상품 스냅샷)
  - `getOrder()`: 주문 상세 조회
  
- **`components/checkout-form.tsx`**: 배송 정보 입력 폼
  - react-hook-form + zod 스키마 검증
  - 6개 필드 (이름, 전화번호, 우편번호, 주소, 상세주소, 메모)
  
- **`components/checkout-summary.tsx`**: 주문 요약 컴포넌트
  - 선택된 상품 목록 표시
  - 금액 계산 (상품 금액 + 배송비)
  - 결제하기 버튼
  
- **`app/checkout/page.tsx`**: 주문 페이지
  - URL 쿼리 파라미터로 선택된 아이템 전달
  - 2열 그리드 레이아웃 (배송 정보 폼 | 주문 요약)
  - 로그인 리디렉션 처리
  
- **`app/checkout/loading.tsx`**: 주문 페이지 로딩 UI
  
- **`components/cart-summary.tsx`**: 장바구니 요약 업데이트
  - 선택된 아이템 ID를 쿼리 파라미터로 전달

**주요 기능:**
- ✅ 장바구니에서 선택한 아이템만 주문 가능
- ✅ 배송 정보 입력 폼 (react-hook-form + zod)
- ✅ 주문 생성 시 상품명/가격 스냅샷 저장
- ✅ 재고 확인 및 검증
- ✅ 배송비 자동 계산 (5만원 이상 무료)
- ✅ 주문 상태 'pending'으로 저장

### 2025-01-19: 비회원 인증 플로우 개선 ✅
- **`app/sign-in/[[...sign-in]]/page.tsx`**: 전용 로그인 페이지 생성
  - Clerk `<SignIn />` 컴포넌트 사용
  - 중앙 정렬 레이아웃 with gradient 배경
  - returnUrl 쿼리 파라미터 지원
  - HTTP 431 오류 해결 (컴포넌트 설정 단순화)

- **`app/sign-up/[[...sign-up]]/page.tsx`**: 전용 회원가입 페이지 생성
  - Clerk `<SignUp />` 컴포넌트 사용
  - 로그인 페이지와 일관된 레이아웃

- **`components/navbar.tsx`**: 비로그인 사용자 처리 개선
  - 장바구니 아이콘 클릭 시 로그인 상태 확인
  - 비로그인 시 `/sign-in?returnUrl=/cart`로 리디렉션

- **`components/add-to-cart-section.tsx`**: returnUrl 지원 추가
  - 비로그인 시 현재 상품 페이지 경로 포함하여 로그인 페이지로 이동
  - 로그인 후 원래 페이지로 복귀

- **`app/cart/page.tsx`**: returnUrl 지원 추가
  - 비로그인 접근 시 `/sign-in?returnUrl=/cart`로 리디렉션

**개선된 사용자 경험:**
- ✅ 비로그인 상태에서 장바구니 관련 액션 시 404 대신 로그인 페이지로 안내
- ✅ 로그인 후 원래 하려던 페이지로 자동 복귀
- ✅ 깔끔한 Clerk UI로 통일된 인증 경험

### 2025-01-19: 장바구니 기능 완전 구현 ✅
- **`actions/cart.ts`**: 장바구니 Server Actions 확장
  - `getCartItems()`: 장바구니 전체 조회 (상품 정보 조인)
  - `getCartCount()`: 장바구니 아이템 총 개수
  - `updateCartItemQuantity()`: 수량 업데이트 (재고 검증)
  - `removeCartItem()`: 개별 삭제
  - `removeCartItems()`: 일괄 삭제
  - `clearCart()`: 전체 비우기

- **`hooks/use-cart-count.ts`**: 장바구니 개수 조회 Custom Hook
  - React Query 기반 실시간 조회
  - 1분마다 자동 리프레시
  - 윈도우 포커스 시 리프레시

- **`components/navbar.tsx`**: Navbar 장바구니 아이콘 추가
  - 장바구니 아이콘 (ShoppingCart)
  - 개수 뱃지 표시 (0개일 때 숨김, 99+ 표시)
  - 클릭 시 `/cart`로 이동

- **`components/add-to-cart-dialog.tsx`**: 장바구니 담기 Dialog
  - 성공 메시지 표시
  - 추가된 상품 정보 미리보기
  - 장바구니 총 개수 표시
  - "계속 쇼핑하기" / "장바구니로 이동" 버튼

- **`components/add-to-cart-section.tsx`**: 장바구니 담기 UI 업데이트
  - Dialog 연동
  - 장바구니 개수 실시간 업데이트
  - 에러 메시지만 inline 표시

- **`components/cart-item.tsx`**: 장바구니 아이템 컴포넌트
  - 체크박스 (선택 삭제용)
  - 상품 이미지 플레이스홀더
  - 상품 정보 (이름, 카테고리, 가격, 재고)
  - 수량 조절 (debounce 500ms)
  - 소계 계산
  - 삭제 버튼

- **`components/cart-summary.tsx`**: 주문 요약 섹션
  - 총 상품 금액
  - 배송비 계산 (5만원 이상 무료, 미만 3,000원)
  - 무료 배송까지 남은 금액 안내
  - 최종 결제 금액
  - 주문하기 버튼

- **`app/cart/page.tsx`**: 장바구니 페이지
  - 2열 레이아웃 (데스크톱: 아이템 목록 | 주문 요약)
  - 전체 선택/해제 체크박스 (indeterminate 상태 지원)
  - 선택 삭제 기능
  - 빈 장바구니 상태 처리
  - 로그인 리디렉션

- **`app/cart/loading.tsx`**: 장바구니 로딩 UI
  - 장바구니 페이지 스켈레톤

- **`components/skeletons/cart-item-skeleton.tsx`**: 장바구니 아이템 스켈레톤

- **`constants/shipping.ts`**: 배송비 관련 상수
  - 무료 배송 기준 금액: 50,000원
  - 배송비: 3,000원
  - 배송비 계산 유틸리티 함수

- **`components/providers/query-provider.tsx`**: React Query Provider
  - QueryClient 설정
  - 기본 옵션 설정 (staleTime: 1분)

- **`app/layout.tsx`**: QueryProvider 추가
  - React Query 전역 설정

- **패키지 설치**: `@tanstack/react-query` 추가

### 2025-01-18: 상품 상세 페이지 완전 구현 ✅
- **`components/product-image-gallery.tsx`**: 이미지 갤러리 컴포넌트
  - 대형 메인 이미지 영역 (플레이스홀더)
  - 하단 썸네일 갤러리 (4개, 수평 스크롤)
  - 클릭 시 메인 이미지 변경 인터랙션
  - Client Component (useState로 선택된 이미지 관리)
  
- **`components/add-to-cart-section.tsx`**: 장바구니 추가 UI 컴포넌트
  - 수량 선택 컨트롤 (-, 입력 필드, +)
  - 수량 범위 검증 (1 ~ 재고 수량)
  - 총 금액 계산 표시 (수량 × 가격)
  - "장바구니 담기" 버튼
  - 데스크톱: 우측 sticky 고정 (lg:sticky lg:top-24)
  - 로그인 상태 확인 (Clerk useUser)
  - 비로그인 시 로그인 페이지로 리디렉션
  - 재고 부족 시 버튼 비활성화 + 안내
  - 성공/실패 메시지 표시
  
- **`actions/cart.ts`**: 장바구니 추가 Server Action
  - Clerk 인증 사용 (createClerkSupabaseClient)
  - 재고 확인
  - 중복 상품 처리 (이미 있으면 수량 증가)
  - 에러 처리 및 로깅
  
- **`app/products/[id]/page.tsx`**: 상품 상세 페이지 완성
  - 2열 그리드 레이아웃 (데스크톱: 이미지 60% | 정보 40%)
  - 왼쪽: 이미지 갤러리 컴포넌트
  - 오른쪽: 상품 정보 + 장바구니 UI (sticky 고정)
  - 반응형 레이아웃 (모바일: 세로 스택)
  
- **`app/products/[id]/loading.tsx`**: 로딩 UI 업데이트
  - 이미지 갤러리 스켈레톤 (메인 + 썸네일)
  - 장바구니 UI 스켈레톤 (수량 선택, 총 금액, 버튼)
  - 2열 레이아웃 유지

### 2025-01-18: 전체 페이지 스켈레톤 로딩 UI 추가 ✅
- **`components/skeletons/`**: 재사용 가능한 스켈레톤 컴포넌트 생성
  - `ProductCardSkeleton`: 상품 카드 스켈레톤
  - `SectionHeaderSkeleton`: 섹션 헤더 스켈레톤
  - `ProductsGridSkeleton`: 상품 그리드 스켈레톤 (개수 조절 가능)
  - `FilterSkeleton`: 필터 섹션 스켈레톤
  - `PaginationSkeleton`: 페이지네이션 스켈레톤
  
- **`app/loading.tsx`**: 홈페이지 로딩 UI
  - 인기 상품 섹션 스켈레톤
  - 전체 상품 섹션 스켈레톤
  - 카테고리 필터 버튼 스켈레톤
  
- **`app/products/loading.tsx`**: 상품 목록 페이지 로딩 UI (리팩토링)
  - 재사용 컴포넌트로 전환하여 코드 간소화
  
- **`app/auth-test/loading.tsx`**: 인증 테스트 페이지 로딩 UI
- **`app/storage-test/loading.tsx`**: 스토리지 테스트 페이지 로딩 UI
- **`components/loading-template.tsx`**: 범용 로딩 템플릿
  - 다른 페이지에서 재사용 가능

- **버그 수정**: `actions/products.ts` TypeScript 빌드 에러 수정
  - `ProductFilters` 인터페이스의 `priceRange` 타입에 `"all"` 추가
  - Vercel 배포 실패 원인 해결

### 2025-01-17: 상품 목록 페이지 구현 ✅
- **`app/products/page.tsx`**: 상품 목록 페이지
  - URL 쿼리 파라미터 기반 서버 사이드 페이지네이션
  - 카테고리, 가격, 정렬 필터 적용
  - 총 상품 수 표시
  
- **`app/products/loading.tsx`**: 로딩 스켈레톤 UI
  - 페이지 헤더, 필터, 상품 그리드, 페이지네이션 스켈레톤
  - Next.js 15 loading.tsx 규칙 활용
  - Suspense boundary 자동 적용
  
- **`actions/products.ts`**: Server Actions 추가
  - `getProductsWithFilters()`: 필터 및 페이지네이션 조회
  - 페이지당 12개 상품 표시
  - Supabase 쿼리 빌더 활용
  
- **`components/products-filter.tsx`**: 필터 컴포넌트
  - 카테고리 필터 (8개)
  - 가격대 필터 (4개 프리셋)
  - 정렬 옵션 (Select 드롭다운)
  - URL 동기화
  
- **`components/products-grid.tsx`**: 상품 그리드 컴포넌트
  - 반응형 그리드 (1-4열)
  - 빈 상태 처리
  
- **`components/pagination.tsx`**: 페이지네이션 컴포넌트
  - 첫/마지막 페이지, 이전/다음 버튼
  - 페이지 번호 버튼 (±2 범위)
  
- **`constants/products.ts`**: 상품 관련 상수
  - 카테고리, 가격 범위, 정렬 옵션 정의
  
- **`components/navbar.tsx`**: 네비게이션 바 개선
  - "상품 목록" 버튼 추가 (우측 상단)

### 2025-01-17: 인기 상품 섹션 구현 ✅
- **`actions/products.ts`**: Server Actions 추가
  - `getPopularProducts()`: 인기 상품 조회 (최근 생성 상품 8개)
  
- **`components/popular-products-section.tsx`**: 인기 상품 섹션 컴포넌트
  - 제목 및 설명 포함
  - 반응형 그리드 레이아웃 (2-4열)
  - ProductCard 재사용
  
- **`app/page.tsx`**: 홈페이지 레이아웃 개선
  - 인기 상품 섹션 (상단)
  - 구분선
  - 전체 상품 섹션 (하단)
  - 병렬 데이터 조회 (Promise.all)

### 2025-01-17: 홈페이지 상품 기능 구현 ✅
- **`actions/products.ts`**: Server Actions 구현
  - `getProducts()`: 전체 활성 상품 조회
  - `getProductsByCategory()`: 카테고리별 상품 조회
  - 공개 클라이언트 사용 (인증 불필요)
  
- **`components/product-card.tsx`**: 상품 카드 컴포넌트
  - 상품 이미지 플레이스홀더
  - 상품명, 가격, 카테고리, 재고 표시
  - 가격 포맷팅 (한국 원화)
  - 상품 상세 페이지 링크 (`/products/[id]`)
  
- **`components/products-section.tsx`**: 상품 섹션 컴포넌트
  - 카테고리 필터 버튼 (전체, 전자제품, 의류, 도서, 식품, 스포츠, 뷰티, 생활/가정)
  - 클라이언트 사이드 필터링 (useState + useMemo)
  - 반응형 그리드 레이아웃 (1-4열)

### 🔴 다음 단계: 데이터베이스 마이그레이션 실행
Supabase Dashboard → SQL Editor에서 `supabase/migrations/update_shopping_mall.schema.sql` 실행 필요

---

## Phase 1: 기본 인프라 (1주)

- [ ] 프로젝트 초기 설정
  - [x] Next.js 프로젝트 셋업
  - [x] pnpm 설정
  - [x] TypeScript 설정
  - [x] ESLint 설정
  - [x] Tailwind CSS 설정
  - [x] shadcn/ui 설정

- [x] Supabase 설정
  - [x] Supabase 프로젝트 생성
  - [x] 데이터베이스 스키마 작성 (products, cart_items, orders, order_items)
  - [x] 샘플 데이터 추가
  - [x] Supabase 클라이언트 유틸리티 확인
  - ⚠️ **중요**: Supabase Dashboard에서 `supabase/migrations/update_shopping_mall.schema.sql` 실행 필요

- [x] Clerk 인증 연동
  - [x] Clerk 프로젝트 생성
  - [x] Clerk Provider 설정
  - [x] 로그인/회원가입 전용 페이지 (`app/sign-in`, `app/sign-up`)
  - [x] 미들웨어 설정
  - [x] 사용자 동기화 로직
  - [x] returnUrl 기반 리디렉션 지원

- [x] 기본 레이아웃
  - [x] `app/layout.tsx` RootLayout
  - [x] `components/Navbar.tsx` 네비게이션 바 (상품 목록 버튼 포함)
  - [x] `app/page.tsx` 홈페이지 (상품 목록 및 필터링 완성)
  - [ ] `app/not-found.tsx` 404 페이지
  
  - [ ] Footer 컴포넌트

## Phase 2: 상품 기능 (1주)

- [x] 홈페이지
  - [x] `app/page.tsx` 완성
    - [x] 전체 상품 섹션 (카테고리 필터링 포함)
    - [x] 인기 상품 섹션
    - [ ] 신상품 섹션 (선택)
    - [ ] 히어로 배너 (선택)

- [x] 상품 목록 페이지
  - [x] `app/products/page.tsx` 생성
    - [x] 상품 목록 조회 (Supabase)
    - [x] 그리드 레이아웃
    - [x] 페이지네이션
    - [x] 카테고리 필터링 UI
    - [x] 가격 필터링
    - [x] 정렬 기능 (최신순, 가격순)
  - [x] `app/products/loading.tsx` 로딩 스켈레톤 UI
  - [x] `components/product-card.tsx` 상품 카드 컴포넌트
  - [x] `components/products-section.tsx` 상품 섹션 컴포넌트 (필터 포함)
  - [x] `components/popular-products-section.tsx` 인기 상품 섹션 컴포넌트
  - [x] `components/products-grid.tsx` 상품 그리드 컴포넌트
  - [x] `components/products-filter.tsx` 필터 컴포넌트
  - [x] `components/pagination.tsx` 페이지네이션 컴포넌트
  - [x] `constants/products.ts` 상품 관련 상수

- [ ] 상품 상세 페이지
  - [x] `app/products/[id]/page.tsx` 생성 (상단 섹션만)
    - [x] 상품 정보 조회 (getProductById Server Action)
    - [x] 404 처리 (상품 없을 경우)
    - [x] 상품명, 가격, 재고 상태 표시
    - [ ] 동적 메타데이터 생성 (SEO)
    
  - [x] 레이아웃 구현
    - [x] 데스크톱 2단 레이아웃 (이미지 60% | 정보 40%)
    - [x] 모바일 세로 스택 레이아웃
    - [x] 반응형 브레이크포인트 (lg:1024px)
    
  - [x] 이미지 갤러리 컴포넌트 (`components/product-image-gallery.tsx`)
    - [x] 대형 메인 이미지 영역 (플레이스홀더)
    - [x] 썸네일 갤러리 (3-4개, 수평 스크롤)
    - [x] 클릭 시 메인 이미지 변경 인터랙션
    
  - [ ] 상품 정보 표시 (`components/product-detail-info.tsx`)
    - [x] 중단: 카테고리 뱃지, 상품 설명
    - [x] 하단: 등록일, 수정일 (작은 텍스트)
    
  - [x] 장바구니 UI (`components/add-to-cart-section.tsx`)
    - [x] 수량 선택 컨트롤 (-, 입력 필드, +)
    - [x] 수량 범위 검증 (1 ~ 재고 수량)
    - [x] 총 금액 계산 표시 (수량 × 가격)
    - [x] "장바구니 담기" 버튼
    - [x] 데스크톱: 우측 sticky 고정
    - [ ] 모바일: 하단 플로팅 버튼 (추후 구현)
    
  - [x] 장바구니 추가 기능
    - [x] 로그인 상태 확인 (Clerk)
    - [x] 비로그인 시 로그인 페이지로 리디렉션
    - [x] 재고 부족 시 버튼 비활성화 + 안내
    - [x] Server Action으로 장바구니 추가 (`actions/cart.ts`)
    - [x] 성공 시 메시지 표시
    
  - [x] 로딩 상태
    - [x] `app/products/[id]/loading.tsx` 스켈레톤 UI
    - [x] 상품명, 가격, 재고 영역 스켈레톤

- [x] Server Actions
  - [x] `actions/products.ts` 생성
    - [x] 상품 목록 조회 (getProducts)
    - [x] 인기 상품 조회 (getPopularProducts)
    - [x] 필터 및 페이지네이션 조회 (getProductsWithFilters)
    - [x] 상품 상세 조회 (getProductById)
    - [x] 카테고리별 조회 (getProductsByCategory)

## Phase 3: 장바구니 & 주문 (1주)

- [x] 장바구니 기능
  - [x] `app/cart/page.tsx` 장바구니 페이지
    - [x] 장바구니 목록 조회
    - [x] 상품 수량 변경
    - [x] 상품 삭제
    - [x] 총 금액 계산
    - [x] 주문하기 버튼
  - [x] `components/cart-item.tsx` 장바구니 아이템 컴포넌트
  - [x] `actions/cart.ts` Server Actions
    - [x] 장바구니 추가
    - [x] 장바구니 조회
    - [x] 장바구니 수량 업데이트
    - [x] 장바구니 삭제
  - [x] Navbar에 장바구니 아이콘 & 개수 표시
  - [x] `components/add-to-cart-dialog.tsx` 장바구니 담기 Dialog
  - [x] `components/cart-summary.tsx` 주문 요약 섹션
  - [x] `app/cart/loading.tsx` 장바구니 로딩 UI

- [x] 주문 프로세스
  - [x] `types/order.ts` 타입 정의
  - [x] `constants/validation.ts` 검증 규칙
  - [x] `app/checkout/page.tsx` 주문 페이지
    - [x] 주문 상품 목록 표시
    - [x] 배송 정보 입력 폼 (수신자 이름, 전화번호, 우편번호, 주소, 상세주소)
    - [x] 주문 메모 입력
    - [x] 총 금액 표시
    - [x] 결제하기 버튼
  - [x] `app/checkout/loading.tsx` 주문 페이지 로딩 UI
  - [x] `components/checkout-form.tsx` 배송 정보 입력 폼
  - [x] `components/checkout-summary.tsx` 주문 요약 컴포넌트
  - [x] `actions/orders.ts` Server Actions
    - [x] 주문 생성 (createOrder)
    - [x] 주문 조회 (getOrder)
    - [ ] 주문 상태 업데이트 (Phase 4에서 구현)
  - [x] 장바구니에서 선택한 아이템 쿼리 파라미터로 전달
  - [x] react-hook-form + zod 스키마 검증
  - [x] 주문 시점 상품명/가격 스냅샷 저장
  - [x] 통합 테스트 가이드 작성 (`docs/CHECKOUT_TEST.md`)
  - [x] 구현 문서 작성 (`docs/CHECKOUT_IMPLEMENTATION.md`)

## Phase 4: 결제 통합 (1주)

- [x] Toss Payments v1 API 연동
  - [x] `types/payment.ts` 타입 정의 생성
  - [x] `constants/payment.ts` 상수 정의 생성
  - [x] `lib/toss-payments.ts` 유틸리티 생성
  - [x] 테스트 API 키 설정 (.env.local)

- [x] 결제 프로세스
  - [x] `app/checkout/page.tsx` Toss Payments SDK 연동
    - [x] SDK 스크립트 로드
    - [x] 주문 생성 (status='pending')
    - [x] 결제창 열기 (requestPayment)
  - [x] `app/payment/success/page.tsx` 결제 성공 페이지
    - [x] 결제 승인 API 호출
    - [x] 주문 상세 정보 표시
    - [x] 배송 정보 표시
    - [x] 영수증 링크 제공
  - [x] `app/payment/success/loading.tsx` 결제 성공 로딩 UI
  - [x] `app/payment/fail/page.tsx` 결제 실패 페이지
    - [x] 실패 사유 표시
    - [x] 재결제 버튼
    - [x] 장바구니로 돌아가기 버튼
  - [x] `actions/payments.ts` Server Actions
    - [x] 결제 승인 (approvePayment)
    - [x] Toss Payments API 호출
    - [x] 금액 검증

- [x] 결제 완료 후 처리
  - [x] 주문 상태 업데이트 (pending → confirmed)
  - [x] 장바구니 비우기 (clearCart)
  - [x] `actions/orders.ts` getOrderWithItems 함수 추가
  - [ ] 재고 차감 (Phase 6에서 구현)

## Phase 5: 마이페이지 (0.5주)

- [x] 마이페이지 레이아웃
  - [x] `app/mypage/layout.tsx` 레이아웃
  - [x] 사이드바 네비게이션

- [x] 주문 내역
  - [x] `app/mypage/orders/page.tsx` 주문 목록 페이지
    - [x] 주문 목록 조회
    - [x] 주문 상태별 필터
    - [x] 주문 날짜 정렬
  - [x] `app/mypage/orders/[id]/page.tsx` 주문 상세 페이지
    - [x] 주문 정보 표시
    - [x] 주문 상품 목록
    - [x] 배송 정보
    - [x] 결제 정보
  - [x] `components/order-card.tsx` 주문 카드 컴포넌트

## Phase 6: 테스트 & 배포 (0.5주)

- [ ] 테스트
  - [ ] E2E 테스트 (Playwright - 선택)
    - [ ] 회원가입/로그인 플로우
    - [ ] 상품 검색 및 상세 조회
    - [ ] 장바구니 추가/수정/삭제
    - [ ] 주문 및 결제 플로우
  - [ ] 수동 테스트 체크리스트 작성
  - [ ] 전체 사용자 플로우 검증

- [ ] 버그 수정
  - [ ] 발견된 버그 목록 정리
  - [ ] 우선순위별 수정
  - [ ] 회귀 테스트

- [ ] 배포 준비
  - [ ] 환경 변수 설정 확인
  - [ ] 프로덕션 빌드 테스트
  - [ ] SEO 메타 태그 추가
  - [ ] `app/robots.ts` 생성
  - [ ] `app/sitemap.ts` 생성
  - [ ] `app/manifest.ts` 생성 (PWA - 선택)

- [x] Vercel 배포
  - [x] Vercel 프로젝트 생성
  - [x] 환경 변수 설정
  - [ ] 도메인 연결 (선택)
  - [x] 배포 및 동작 확인

## 추가 개선 사항 (MVP 이후)

- [ ] UI/UX 개선
  - [x] 로딩 상태 개선
  - [ ] 에러 처리 UI
  - [x] 스켈레톤 로더
  - [ ] 토스트 알림

- [ ] 성능 최적화
  - [ ] 이미지 최적화 (Next.js Image)
  - [ ] 코드 스플리팅
  - [ ] 캐싱 전략

- [ ] 분석 & 모니터링
  - [ ] Google Analytics 연동 (선택)
  - [ ] 에러 트래킹 (Sentry - 선택)

---

## 참고 사항

### 제약사항
- Supabase RLS는 사용하지 않음 (애플리케이션 레벨에서 clerk_id로 필터링)
- 어드민 기능은 MVP에 포함하지 않음 (Supabase 대시보드에서 직접 관리)
- 결제는 테스트 모드로만 운영
- 실제 배송 기능은 구현하지 않음
- 상품 리뷰, 찜하기, 쿠폰 등은 제외

### 기술 스택
- Package Manager: pnpm
- Frontend: Next.js 15 + React 19
- Database: Supabase (PostgreSQL)
- Authentication: Clerk
- Payment: Toss Payments MCP
- Styling: Tailwind CSS v4
- UI Components: shadcn/ui
