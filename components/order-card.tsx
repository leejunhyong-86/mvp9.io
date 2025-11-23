/**
 * @file components/order-card.tsx
 * @description 주문 카드 컴포넌트
 * 
 * 주문 목록에서 각 주문을 카드 형태로 표시합니다.
 */

"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import type { OrderListItem } from "@/types/order";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/constants/orders";

interface OrderCardProps {
  order: OrderListItem;
}

export function OrderCard({ order }: OrderCardProps) {
  // 날짜 포맷팅 (YYYY년 MM월 DD일)
  const orderDate = new Date(order.created_at);
  const formattedDate = orderDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // 금액 포맷팅 (한국 원화)
  const formattedAmount = order.total_amount.toLocaleString("ko-KR", {
    style: "currency",
    currency: "KRW",
  });

  // 상품 요약 텍스트 생성
  const productSummary =
    order.totalProductCount > 1
      ? `${order.firstProductName} 외 ${order.totalProductCount - 1}개`
      : order.firstProductName;

  return (
    <Link
      href={`/mypage/orders/${order.id}`}
      className="block rounded-lg border bg-card p-6 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">
            주문번호: {order.id.substring(0, 8)}...
          </p>
          <p className="text-sm text-muted-foreground">{formattedDate}</p>
        </div>
        <Badge
          variant="outline"
          className={ORDER_STATUS_COLORS[order.status]}
        >
          {ORDER_STATUS_LABELS[order.status]}
        </Badge>
      </div>

      <div className="space-y-3">
        <div>
          <p className="font-medium">{productSummary}</p>
          <p className="text-sm text-muted-foreground">
            총 {order.totalQuantity}개
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <span className="text-sm text-muted-foreground">결제 금액</span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{formattedAmount}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </Link>
  );
}

