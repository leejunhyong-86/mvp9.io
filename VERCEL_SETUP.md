# Vercel 배포 가이드

이 문서는 Next.js + Clerk + Supabase 프로젝트를 Vercel에 배포하는 방법을 설명합니다.

## 🚨 중요: 환경 변수 설정 필수

Vercel 배포 시 발생하는 "Application error: a server-side exception has occurred" 에러는 대부분 **환경 변수가 설정되지 않아서** 발생합니다.

## 📋 배포 전 체크리스트

배포하기 전에 다음 항목들이 준비되어 있는지 확인하세요:

- [ ] Supabase 프로젝트 생성 완료
- [ ] Clerk 프로젝트 생성 완료
- [ ] Clerk + Supabase 통합 설정 완료
- [ ] Supabase 데이터베이스 스키마 적용 완료
- [ ] Supabase Storage 버킷 생성 완료

## 🚀 Vercel 배포 단계

### 1단계: GitHub에 코드 푸시

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2단계: Vercel에서 프로젝트 임포트

1. [Vercel Dashboard](https://vercel.com/dashboard)에 로그인
2. **"Add New..."** → **"Project"** 클릭
3. GitHub 저장소 선택
4. **"Import"** 클릭

### 3단계: 환경 변수 설정 (가장 중요!)

프로젝트 설정 화면에서 **Environment Variables** 섹션을 찾아 다음 환경 변수들을 추가하세요:

#### Supabase 환경 변수

Supabase Dashboard → Settings → API에서 확인:

| 변수 이름 | 값 | 설명 |
|---------|-----|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | service_role secret key ⚠️ |
| `NEXT_PUBLIC_STORAGE_BUCKET` | `uploads` | Storage 버킷 이름 |

> ⚠️ **주의**: `SUPABASE_SERVICE_ROLE_KEY`는 모든 RLS를 우회하는 관리자 권한이므로 절대 공개하지 마세요!

#### Clerk 환경 변수

Clerk Dashboard → API Keys에서 확인:

| 변수 이름 | 값 | 설명 |
|---------|-----|------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_test_...` 또는 `pk_live_...` | Publishable Key |
| `CLERK_SECRET_KEY` | `sk_test_...` 또는 `sk_live_...` | Secret Key ⚠️ |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` | 로그인 페이지 URL |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | `/` | 로그인 후 리다이렉트 URL |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | `/` | 회원가입 후 리다이렉트 URL |

> ⚠️ **주의**: `CLERK_SECRET_KEY`는 절대 공개하지 마세요!

### 4단계: 배포 시작

환경 변수를 모두 입력한 후 **"Deploy"** 버튼을 클릭합니다.

배포가 완료되면 Vercel이 자동으로 생성한 URL로 접속할 수 있습니다.

## 🔧 배포 후 설정

### Clerk 도메인 설정

1. Clerk Dashboard → **Domains** 메뉴
2. **"Add domain"** 클릭
3. Vercel에서 생성된 도메인 입력 (예: `your-app.vercel.app`)
4. **"Add domain"** 클릭

### Supabase 허용 도메인 설정 (선택사항)

보안을 강화하려면 Supabase에서 허용할 도메인을 설정할 수 있습니다:

1. Supabase Dashboard → **Settings** → **API**
2. **"Site URL"** 섹션에서 Vercel 도메인 추가
3. **"Redirect URLs"** 섹션에서 허용할 URL 패턴 추가

## 🐛 배포 후 에러 해결

### "Application error: a server-side exception has occurred"

이 에러는 대부분 환경 변수가 누락되었거나 잘못 설정되었을 때 발생합니다.

**해결 방법:**

1. Vercel Dashboard → 프로젝트 선택 → **Settings** → **Environment Variables**
2. 위의 3단계에서 설명한 모든 환경 변수가 올바르게 설정되어 있는지 확인
3. 환경 변수를 수정한 경우, **Deployments** 탭에서 **"Redeploy"** 클릭

### Vercel 로그 확인

더 자세한 에러 정보를 확인하려면:

1. Vercel Dashboard → 프로젝트 선택 → **Deployments**
2. 실패한 배포 클릭
3. **"Runtime Logs"** 또는 **"Build Logs"** 확인

### 일반적인 에러 메시지

#### "Supabase 환경 변수가 설정되지 않았습니다"

- `NEXT_PUBLIC_SUPABASE_URL` 또는 `NEXT_PUBLIC_SUPABASE_ANON_KEY`가 누락됨
- Vercel 환경 변수에 추가 후 재배포

#### "Clerk is not configured"

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` 또는 `CLERK_SECRET_KEY`가 누락됨
- Vercel 환경 변수에 추가 후 재배포

## 🔄 환경 변수 업데이트

환경 변수를 추가하거나 수정한 후에는 반드시 **재배포**해야 합니다:

1. Vercel Dashboard → 프로젝트 선택 → **Deployments**
2. 최신 배포의 **"..."** 메뉴 클릭
3. **"Redeploy"** 선택
4. **"Redeploy"** 버튼 클릭

## 📚 추가 리소스

- [Vercel 환경 변수 문서](https://vercel.com/docs/environment-variables)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Clerk 배포 가이드](https://clerk.com/docs/deployments/overview)
- [Supabase 프로덕션 체크리스트](https://supabase.com/docs/guides/platform/going-into-prod)

## 💡 팁

### 환경별 환경 변수 설정

Vercel에서는 환경별로 다른 환경 변수를 설정할 수 있습니다:

- **Production**: 실제 사용자에게 제공되는 환경
- **Preview**: Pull Request 미리보기 환경
- **Development**: 로컬 개발 환경 (Vercel CLI 사용 시)

각 환경에 맞는 Clerk 키와 Supabase 프로젝트를 사용하는 것을 권장합니다.

### 환경 변수 복사

여러 환경에 동일한 환경 변수를 설정해야 하는 경우:

1. 환경 변수 입력 시 **Environment** 드롭다운에서 모든 환경 선택
2. 또는 각 환경 변수의 **"..."** 메뉴에서 **"Copy to other environments"** 선택

### 로컬 개발 시 Vercel 환경 변수 사용

Vercel CLI를 사용하면 배포된 환경 변수를 로컬에서도 사용할 수 있습니다:

```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 링크
vercel link

# 환경 변수 다운로드
vercel env pull .env.local
```

## ✅ 배포 완료 확인

배포가 성공적으로 완료되었는지 확인하려면:

1. Vercel에서 생성된 URL로 접속
2. 홈페이지가 정상적으로 로드되는지 확인
3. Clerk 로그인/회원가입 테스트
4. `/auth-test` 페이지에서 Supabase 연동 확인
5. `/storage-test` 페이지에서 파일 업로드 테스트

모든 기능이 정상 작동하면 배포 완료입니다! 🎉

