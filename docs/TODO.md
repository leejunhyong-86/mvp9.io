# 쇼핑몰 MVP 개발 TODO

## Phase 1: 기본 인프라 (1주)

- [ ] 프로젝트 초기 설정
  - [x] Next.js 프로젝트 셋업
  - [x] pnpm 설정
  - [x] TypeScript 설정
  - [x] ESLint 설정
  - [x] Tailwind CSS 설정
  - [x] shadcn/ui 설정

- [ ] Supabase 설정
  - [x] Supabase 프로젝트 생성
  - [x] 데이터베이스 스키마 작성 (products, cart_items, orders, order_items)
  - [x] 샘플 데이터 추가
  - [ ] Supabase 클라이언트 유틸리티 확인

- [ ] Clerk 인증 연동
  - [x] Clerk 프로젝트 생성
  - [x] Clerk Provider 설정
  - [x] 로그인/회원가입 페이지
  - [x] 미들웨어 설정
  - [x] 사용자 동기화 로직

- [ ] 기본 레이아웃
  - [x] `app/layout.tsx` RootLayout
  - [x] `components/Navbar.tsx` 네비게이션 바
  - [ ] `app/page.tsx` 홈페이지 (기본 구조만)
  - [ ] `app/not-found.tsx` 404 페이지
  - [ ] Footer 컴포넌트

## Phase 2: 상품 기능 (1주)

- [ ] 홈페이지
  - [ ] `app/page.tsx` 완성
    - [ ] 추천 상품 섹션
    - [ ] 신상품 섹션
    - [ ] 카테고리별 상품 미리보기
    - [ ] 히어로 배너 (선택)

- [ ] 상품 목록 페이지
  - [ ] `app/products/page.tsx` 생성
    - [ ] 상품 목록 조회 (Supabase)
    - [ ] 그리드 레이아웃
    - [ ] 페이지네이션
    - [ ] 카테고리 필터링 UI
    - [ ] 가격 필터링
    - [ ] 정렬 기능 (최신순, 가격순)
  - [ ] `components/product-card.tsx` 상품 카드 컴포넌트
  - [ ] `components/product-filters.tsx` 필터 컴포넌트

- [ ] 상품 상세 페이지
  - [ ] `app/products/[id]/page.tsx` 생성
    - [ ] 상품 정보 조회 (Supabase)
    - [ ] 상품 이미지 (임시 이미지 사용)
    - [ ] 상품 설명
    - [ ] 가격 표시
    - [ ] 재고 표시
    - [ ] 수량 선택 UI
    - [ ] 장바구니 추가 버튼
    - [ ] 바로 구매 버튼 (선택)

- [ ] Server Actions
  - [ ] `actions/products.ts` 생성
    - [ ] 상품 목록 조회
    - [ ] 상품 상세 조회
    - [ ] 카테고리별 조회

## Phase 3: 장바구니 & 주문 (1주)

- [ ] 장바구니 기능
  - [ ] `app/cart/page.tsx` 장바구니 페이지
    - [ ] 장바구니 목록 조회
    - [ ] 상품 수량 변경
    - [ ] 상품 삭제
    - [ ] 총 금액 계산
    - [ ] 주문하기 버튼
  - [ ] `components/cart-item.tsx` 장바구니 아이템 컴포넌트
  - [ ] `actions/cart.ts` Server Actions
    - [ ] 장바구니 추가
    - [ ] 장바구니 조회
    - [ ] 장바구니 수량 업데이트
    - [ ] 장바구니 삭제
  - [ ] Navbar에 장바구니 아이콘 & 개수 표시

- [ ] 주문 프로세스
  - [ ] `app/checkout/page.tsx` 주문 페이지
    - [ ] 주문 상품 목록 표시
    - [ ] 배송 정보 입력 폼
    - [ ] 주문 메모 입력
    - [ ] 총 금액 표시
    - [ ] 결제하기 버튼
  - [ ] `actions/orders.ts` Server Actions
    - [ ] 주문 생성
    - [ ] 주문 조회
    - [ ] 주문 상태 업데이트

## Phase 4: 결제 통합 (1주)

- [ ] Toss Payments MCP 연동
  - [ ] `.cursor/mcp.json` Toss Payments MCP 설정
  - [ ] `lib/toss-payments.ts` 유틸리티 생성
  - [ ] 테스트 API 키 설정 (.env)

- [ ] 결제 프로세스
  - [ ] `app/checkout/page.tsx` 결제 버튼 연동
  - [ ] `app/payment/success/page.tsx` 결제 성공 페이지
  - [ ] `app/payment/fail/page.tsx` 결제 실패 페이지
  - [ ] `actions/payments.ts` Server Actions
    - [ ] 결제 요청
    - [ ] 결제 승인
    - [ ] 결제 실패 처리

- [ ] 결제 완료 후 처리
  - [ ] 주문 상태 업데이트
  - [ ] 장바구니 비우기
  - [ ] 재고 차감 (선택)
  - [ ] 주문 완료 페이지로 리디렉션

## Phase 5: 마이페이지 (0.5주)

- [ ] 마이페이지 레이아웃
  - [ ] `app/mypage/layout.tsx` 레이아웃
  - [ ] 사이드바 네비게이션

- [ ] 주문 내역
  - [ ] `app/mypage/orders/page.tsx` 주문 목록 페이지
    - [ ] 주문 목록 조회
    - [ ] 주문 상태별 필터
    - [ ] 주문 날짜 정렬
  - [ ] `app/mypage/orders/[id]/page.tsx` 주문 상세 페이지
    - [ ] 주문 정보 표시
    - [ ] 주문 상품 목록
    - [ ] 배송 정보
    - [ ] 결제 정보
  - [ ] `components/order-card.tsx` 주문 카드 컴포넌트

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

- [ ] Vercel 배포
  - [ ] Vercel 프로젝트 생성
  - [ ] 환경 변수 설정
  - [ ] 도메인 연결 (선택)
  - [ ] 배포 및 동작 확인

## 추가 개선 사항 (MVP 이후)

- [ ] UI/UX 개선
  - [ ] 로딩 상태 개선
  - [ ] 에러 처리 UI
  - [ ] 스켈레톤 로더
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
