/**
 * @file app/sign-up/[[...sign-up]]/page.tsx
 * @description 회원가입 페이지
 *
 * Clerk SignUp 컴포넌트를 사용한 전용 회원가입 페이지입니다.
 * 회원가입 후 자동으로 로그인되며 설정된 페이지로 이동합니다.
 */

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <SignUp />
      </div>
    </div>
  );
}

