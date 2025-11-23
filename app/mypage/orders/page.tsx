/**
 * @file app/mypage/orders/page.tsx
 * @description 주문 목록 페이지
 * 
 * 사용자의 주문 목록을 조회하고 표시합니다.
 * 상태별 필터, 정렬, 페이지네이션을 지원합니다.
 */

import { getUserOrders } from "@/actions/orders";
import { OrderCard } from "@/components/order-card";
import { OrdersFilter } from "@/components/orders-filter";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import type { OrderStatus, OrderSortOption } from "@/types/order";

interface OrdersPageProps {
  searchParams: Promise<{
    status?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function OrdersPage(props: OrdersPageProps) {
  const searchParams = await props.searchParams;
  
  // 쿼리 파라미터 추출
  const status = (searchParams.status || 'all') as OrderStatus | 'all';
  const sort = (searchParams.sort || 'latest') as OrderSortOption;
  const page = parseInt(searchParams.page || '1', 10);

  console.group("OrdersPage");
  console.log("Query params:", { status, sort, page });

  // 주문 목록 조회
  const result = await getUserOrders({ status, sort, page });

  console.log("Result:", {
    success: result.success,
    ordersCount: result.orders?.length || 0,
    totalCount: result.totalCount || 0,
  });
  console.groupEnd();

  if (!result.success) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="mb-4 text-center text-muted-foreground">
          {result.message || "주문 목록을 불러오는 데 실패했습니다."}
        </p>
        <Link href="/">
          <Button>
            <ShoppingBag className="mr-2 h-4 w-4" />
            쇼핑 시작하기
          </Button>
        </Link>
      </div>
    );
  }

  const orders = result.orders || [];
  const totalCount = result.totalCount || 0;
  const ORDERS_PER_PAGE = 10;
  const totalPages = Math.ceil(totalCount / ORDERS_PER_PAGE);

  // 상태별 개수 계산 (간단히 현재 필터 결과만 표시)
  const statusCounts = {
    all: totalCount,
    [status]: status !== 'all' ? totalCount : 0,
  };

  // 빈 상태
  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold">주문 내역</h2>
        <div className="flex flex-col items-center justify-center py-20 rounded-lg border bg-card">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">주문 내역이 없습니다</h3>
          <p className="mb-6 text-center text-muted-foreground">
            아직 주문하신 상품이 없습니다.
          </p>
          <Link href="/products">
            <Button>
              <ShoppingBag className="mr-2 h-4 w-4" />
              쇼핑 시작하기
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">주문 내역</h2>
        <p className="text-sm text-muted-foreground">
          총 {totalCount}건
        </p>
      </div>

      {/* 필터 및 정렬 */}
      <OrdersFilter statusCounts={statusCounts} />

      {/* 주문 목록 */}
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  );
}

