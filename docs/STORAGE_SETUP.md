# Supabase Storage 설정 가이드

## Product Images 버킷 생성

### 1. Supabase Dashboard 접속
- https://supabase.com/dashboard 접속
- 프로젝트 선택

### 2. Storage 섹션으로 이동
- 좌측 메뉴에서 "Storage" 클릭
- "Create a new bucket" 버튼 클릭

### 3. 버킷 설정

#### 기본 설정
- **Bucket name**: `product-images`
- **Public bucket**: ✅ 체크 (공개 접근 허용)
- **File size limit**: `5242880` (5MB)
- **Allowed MIME types**: 
  - `image/jpeg`
  - `image/jpg`
  - `image/png`
  - `image/webp`

#### 보안 설정 (선택사항)
현재 개발 단계에서는 RLS를 비활성화하여 사용합니다.
프로덕션 환경에서는 적절한 RLS 정책을 추가해야 합니다.

### 4. 마이그레이션 실행

#### SQL Editor에서 실행
1. 좌측 메뉴에서 "SQL Editor" 클릭
2. "New query" 버튼 클릭
3. `supabase/migrations/20251123150000_add_product_images.sql` 파일 내용 복사
4. SQL Editor에 붙여넣기
5. "Run" 버튼 클릭

#### 확인
```sql
-- products 테이블에 images 컬럼이 추가되었는지 확인
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'products' AND column_name = 'images';
```

### 5. 테스트 이미지 업로드 (선택)

#### Dashboard에서 수동 업로드
1. Storage > product-images 버킷 선택
2. "Upload file" 버튼 클릭
3. 테스트 이미지 업로드
4. 업로드된 이미지 URL 복사

#### 상품에 이미지 URL 추가
```sql
-- 예시: 첫 번째 상품에 이미지 URL 추가
UPDATE products
SET images = ARRAY[
  'https://[project-id].supabase.co/storage/v1/object/public/product-images/test-image-1.jpg',
  'https://[project-id].supabase.co/storage/v1/object/public/product-images/test-image-2.jpg'
]
WHERE id = '[product-id]';
```

### 6. 환경 변수 확인

`.env.local` 파일에 다음 환경 변수가 설정되어 있는지 확인:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
NEXT_PUBLIC_STORAGE_BUCKET=product-images
```

## 이미지 URL 구조

### 공개 버킷 URL 형식
```
https://[project-id].supabase.co/storage/v1/object/public/product-images/[filename]
```

### 예시
```
https://abcdefghij.supabase.co/storage/v1/object/public/product-images/product-001.jpg
```

## 주의사항

### 개발 단계
- 현재는 공개 버킷으로 설정하여 RLS 없이 사용
- 누구나 이미지 URL로 접근 가능
- 업로드는 애플리케이션 코드에서 제어

### 프로덕션 단계
- RLS 정책 추가 권장
- 업로드 권한: 인증된 사용자만
- 조회 권한: 모든 사용자 (공개 상품 이미지)
- 삭제 권한: 관리자만

### 파일 명명 규칙
- UUID v4 사용하여 고유한 파일명 생성
- 원본 파일 확장자 유지
- 예: `550e8400-e29b-41d4-a716-446655440000.jpg`

## 문제 해결

### 이미지 업로드 실패
1. 버킷 이름 확인 (`product-images`)
2. 파일 크기 확인 (5MB 이하)
3. MIME 타입 확인 (jpg, png, webp만 허용)
4. 네트워크 에러 확인

### 이미지 로딩 실패
1. URL 형식 확인
2. 버킷이 Public인지 확인
3. Next.js Image remotePatterns 설정 확인
4. CORS 설정 확인 (기본적으로 Supabase는 CORS 허용)

## 참고 문서
- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)

