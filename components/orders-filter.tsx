/**
 * @file components/orders-filter.tsx
 * @description 주문 필터 컴포넌트
 * 
 * 상태별 필터 탭과 정렬 Select를 제공합니다.
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { STATUS_FILTERS, SORT_OPTIONS } from "@/constants/orders";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrdersFilterProps {
  statusCounts?: Record<string, number>;
}

export function OrdersFilter({ statusCounts = {} }: OrdersFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") || "all";
  const currentSort = searchParams.get("sort") || "latest";

  // URL 업데이트 헬퍼 함수
  const updateURL = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    // 필터나 정렬 변경 시 1페이지로 이동
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      {/* 상태별 필터 탭 */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => {
          const isActive = currentStatus === filter.value;
          const count = statusCounts[filter.value] || 0;

          return (
            <button
              key={filter.value}
              onClick={() => updateURL("status", filter.value)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "border bg-card hover:bg-accent"
              }`}
            >
              {filter.label}
              {count > 0 && (
                <span className="ml-1.5 text-xs">({count})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* 정렬 옵션 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">정렬:</span>
        <Select value={currentSort} onValueChange={(value) => updateURL("sort", value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="정렬 선택" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

