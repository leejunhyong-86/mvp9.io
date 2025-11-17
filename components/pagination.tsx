/**
 * @file components/pagination.tsx
 * @description 페이지네이션 컴포넌트
 *
 * 이 컴포넌트는 상품 목록의 페이지네이션을 제공합니다.
 *
 * 주요 기능:
 * 1. 이전/다음 페이지 버튼
 * 2. 페이지 번호 버튼 (현재 페이지 ±2 범위)
 * 3. 첫 페이지/마지막 페이지 버튼
 * 4. URL 쿼리 파라미터 동기화
 *
 * 핵심 구현 로직:
 * - useRouter와 useSearchParams를 사용한 URL 업데이트
 * - 현재 페이지 하이라이트
 * - 비활성화 상태 처리
 *
 * @dependencies
 * - next/navigation: useRouter, useSearchParams
 * - @/components/ui/button: Button 컴포넌트
 * - lucide-react: 아이콘
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  /**
   * 페이지 변경 함수
   */
  const handlePageChange = (page: number) => {
    console.log("Pagination: Changing to page", page);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    
    // useTransition으로 래핑하여 로딩 상태 관리
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  /**
   * 페이지 번호 배열 생성 (현재 페이지 ±2)
   */
  const getPageNumbers = () => {
    const pages: number[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  // 페이지가 1개 이하면 페이지네이션을 표시하지 않음
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2">
      {/* 첫 페이지 버튼 */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1 || isPending}
        aria-label="첫 페이지"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>

      {/* 이전 페이지 버튼 */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || isPending}
        aria-label="이전 페이지"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* 페이지 번호 버튼들 */}
      {pageNumbers.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          size="icon"
          onClick={() => handlePageChange(page)}
          disabled={isPending}
          aria-label={`${page}페이지`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </Button>
      ))}

      {/* 다음 페이지 버튼 */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isPending}
        aria-label="다음 페이지"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* 마지막 페이지 버튼 */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages || isPending}
        aria-label="마지막 페이지"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

