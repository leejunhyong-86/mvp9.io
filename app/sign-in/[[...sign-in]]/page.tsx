/**
 * @file app/sign-in/[[...sign-in]]/page.tsx
 * @description 로그인 페이지
 *
 * Clerk SignIn 컴포넌트를 사용한 전용 로그인 페이지입니다.
 * returnUrl 쿼리 파라미터를 지원하여 로그인 후 원래 페이지로 돌아갑니다.
 */

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <SignIn />
      </div>
    </div>
  );
}

