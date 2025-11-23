"use client";

import { SignedOut, SignInButton, SignedIn, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import { useCartCount } from "@/hooks/use-cart-count";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { count } = useCartCount();
  const { isSignedIn } = useUser();
  const router = useRouter();

  const handleCartClick = () => {
    if (!isSignedIn) {
      router.push("/sign-in?returnUrl=/cart");
      return;
    }
    router.push("/cart");
  };

  const handleMyPageClick = () => {
    if (!isSignedIn) {
      router.push("/sign-in?returnUrl=/mypage/orders");
      return;
    }
    router.push("/mypage/orders");
  };

  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16 max-w-7xl mx-auto">
      <Link href="/" className="text-2xl font-bold">
        SaaS Template
      </Link>
      <div className="flex gap-4 items-center">
        <Link href="/products">
          <Button variant="outline" className="gap-2">
            <ShoppingBag className="h-4 w-4" />
            상품 목록
          </Button>
        </Link>

        {/* 장바구니 아이콘 */}
        <Button
          variant="outline"
          size="icon"
          className="relative"
          onClick={handleCartClick}
          aria-label="장바구니"
        >
          <ShoppingCart className="h-4 w-4" />
          {/* 장바구니 개수 뱃지 */}
          {count > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
              {count > 99 ? "99+" : count}
            </span>
          )}
        </Button>

        {/* 마이페이지 버튼 (로그인 사용자만) */}
        <SignedIn>
          <Button
            variant="outline"
            onClick={handleMyPageClick}
            className="gap-2"
          >
            My page
          </Button>
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal">
            <Button>로그인</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
};

export default Navbar;
