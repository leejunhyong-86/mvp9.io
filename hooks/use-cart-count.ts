/**
 * @file hooks/use-cart-count.ts
 * @description 장바구니 아이템 개수 조회 Custom Hook
 *
 * React Query를 사용하여 장바구니 개수를 실시간으로 조회합니다.
 *
 * 주요 기능:
 * 1. 장바구니 아이템 총 개수 조회
 * 2. 자동 리프레시 (1분마다)
 * 3. 수동 리프레시 기능 제공
 *
 * @dependencies
 * - @tanstack/react-query: useQuery
 * - @/actions/cart: getCartCount
 * - @clerk/nextjs: useUser
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { getCartCount } from "@/actions/cart";

/**
 * 장바구니 아이템 개수 조회 Hook
 * @returns 장바구니 개수, 로딩 상태, 에러, 리프레시 함수
 */
export function useCartCount() {
  const { isSignedIn } = useUser();

  const query = useQuery({
    queryKey: ["cart", "count"],
    queryFn: async () => {
      if (!isSignedIn) {
        return 0;
      }
      return await getCartCount();
    },
    // 1분마다 자동 리프레시
    refetchInterval: 60000,
    // 윈도우 포커스 시 리프레시
    refetchOnWindowFocus: true,
    // 초기 데이터
    initialData: 0,
    // 로그인하지 않았을 때도 쿼리 실행 (0 반환)
    enabled: true,
  });

  return {
    count: query.data ?? 0,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

