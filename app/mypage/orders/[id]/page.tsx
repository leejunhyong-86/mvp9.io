/**
 * @file app/mypage/orders/[id]/page.tsx
 * @description 주문 상세 페이지
 * 
 * 특정 주문의 상세 정보를 표시합니다.
 */

import { getOrderWithItems } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/constants/orders";

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailPage(props: OrderDetailPageProps) {
  const params = await props.params;
  const orderId = params.id;

  console.group("OrderDetailPage");
  console.log("Order ID:", orderId);

  // 주문 상세 조회
  const result = await getOrderWithItems(orderId);

  console.log("Result:", {
    success: result.success,
    hasOrder: !!result.order,
  });
  console.groupEnd();

  // 주문을 찾을 수 없거나 권한이 없는 경우
  if (!result.success || !result.order) {
    notFound();
  }

  const order = result.order;

  // 날짜 포맷팅
  const orderDate = new Date(order.created_at);
  const formattedDate = orderDate.toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // 금액 포맷팅
  const formatAmount = (amount: number) =>
    amount.toLocaleString("ko-KR", {
      style: "currency",
      currency: "KRW",
    });

  // 총 상품 금액 계산
  const totalProductAmount = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // 배송비 계산
  const shippingFee = order.total_amount - totalProductAmount;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Link href="/mypage/orders">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h2 className="text-xl font-bold">주문 상세</h2>
          <p className="text-sm text-muted-foreground">
            주문번호: {order.id.substring(0, 8)}...
          </p>
        </div>
        <Badge
          variant="outline"
          className={ORDER_STATUS_COLORS[order.status]}
        >
          {ORDER_STATUS_LABELS[order.status]}
        </Badge>
      </div>

      {/* 주문 정보 */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="mb-4 text-lg font-bold">주문 정보</h3>
        <dl className="space-y-3">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">주문 번호</dt>
            <dd className="font-mono text-sm">{order.id}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">주문 일시</dt>
            <dd>{formattedDate}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">주문 상태</dt>
            <dd>
              <Badge
                variant="outline"
                className={ORDER_STATUS_COLORS[order.status]}
              >
                {ORDER_STATUS_LABELS[order.status]}
              </Badge>
            </dd>
          </div>
        </dl>
      </div>

      {/* 주문 상품 목록 */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="mb-4 text-lg font-bold">
          주문 상품 ({order.items.length}개)
        </h3>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0"
            >
              <div className="flex-1">
                <p className="font-medium">{item.product_name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatAmount(item.price)} × {item.quantity}개
                </p>
              </div>
              <p className="font-medium">
                {formatAmount(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        {/* 금액 요약 */}
        <div className="mt-6 space-y-2 border-t pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">총 상품 금액</span>
            <span>{formatAmount(totalProductAmount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">배송비</span>
            <span>{formatAmount(shippingFee)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <span>최종 결제 금액</span>
            <span className="text-primary">{formatAmount(order.total_amount)}</span>
          </div>
        </div>
      </div>

      {/* 배송 정보 */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="mb-4 text-lg font-bold">배송 정보</h3>
        <dl className="space-y-3">
          <div>
            <dt className="mb-1 text-sm text-muted-foreground">수신자</dt>
            <dd>{order.shipping_address.recipientName}</dd>
          </div>
          <div>
            <dt className="mb-1 text-sm text-muted-foreground">연락처</dt>
            <dd>{order.shipping_address.phone}</dd>
          </div>
          <div>
            <dt className="mb-1 text-sm text-muted-foreground">배송 주소</dt>
            <dd>
              [{order.shipping_address.postalCode}]{" "}
              {order.shipping_address.address}{" "}
              {order.shipping_address.addressDetail}
            </dd>
          </div>
          {order.order_note && (
            <div>
              <dt className="mb-1 text-sm text-muted-foreground">배송 메모</dt>
              <dd className="text-sm">{order.order_note}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* 하단 버튼 */}
      <div className="flex gap-3">
        <Link href="/mypage/orders" className="flex-1">
          <Button variant="outline" className="w-full" size="lg">
            <Package className="mr-2 h-4 w-4" />
            주문 목록으로
          </Button>
        </Link>
        {/* 재주문 버튼은 Phase 6 이후 구현 */}
      </div>
    </div>
  );
}

