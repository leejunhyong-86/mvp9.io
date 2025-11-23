/**
 * @file components/checkout-form.tsx
 * @description 배송 정보 입력 폼 컴포넌트
 *
 * 주문 페이지에서 배송 정보를 입력받는 폼 컴포넌트입니다.
 *
 * 주요 기능:
 * 1. react-hook-form + zod 스키마 검증
 * 2. 배송 정보 입력 필드 (수신자 이름, 전화번호, 우편번호, 주소, 상세주소, 주문 메모)
 * 3. 유효성 검증 및 에러 메시지 표시
 * 4. 외부에서 제출 트리거 (forwardRef)
 *
 * @dependencies
 * - react-hook-form: useForm
 * - zod: z
 * - @hookform/resolvers/zod: zodResolver
 * - @/components/ui/form: Form, FormField, FormItem, FormLabel, FormControl, FormMessage
 * - @/components/ui/input: Input
 * - @/components/ui/textarea: Textarea
 * - @/types/order: OrderFormData
 * - @/constants/validation: 검증 규칙 및 메시지
 */

"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { OrderFormData } from "@/types/order";
import {
  PHONE_REGEX,
  POSTAL_CODE_REGEX,
  RECIPIENT_NAME_MIN_LENGTH,
  RECIPIENT_NAME_MAX_LENGTH,
  ADDRESS_MIN_LENGTH,
  ADDRESS_MAX_LENGTH,
  ADDRESS_DETAIL_MIN_LENGTH,
  ADDRESS_DETAIL_MAX_LENGTH,
  ORDER_NOTE_MAX_LENGTH,
  VALIDATION_MESSAGES,
} from "@/constants/validation";

/**
 * 배송 정보 폼 스키마
 */
const checkoutFormSchema = z.object({
  recipientName: z
    .string()
    .min(RECIPIENT_NAME_MIN_LENGTH, VALIDATION_MESSAGES.recipientName.minLength)
    .max(RECIPIENT_NAME_MAX_LENGTH, VALIDATION_MESSAGES.recipientName.maxLength),
  phone: z
    .string()
    .regex(PHONE_REGEX, VALIDATION_MESSAGES.phone.pattern),
  postalCode: z
    .string()
    .regex(POSTAL_CODE_REGEX, VALIDATION_MESSAGES.postalCode.pattern),
  address: z
    .string()
    .min(ADDRESS_MIN_LENGTH, VALIDATION_MESSAGES.address.minLength)
    .max(ADDRESS_MAX_LENGTH, VALIDATION_MESSAGES.address.maxLength),
  addressDetail: z
    .string()
    .min(ADDRESS_DETAIL_MIN_LENGTH, VALIDATION_MESSAGES.addressDetail.minLength)
    .max(ADDRESS_DETAIL_MAX_LENGTH, VALIDATION_MESSAGES.addressDetail.maxLength),
  orderNote: z
    .string()
    .max(ORDER_NOTE_MAX_LENGTH, VALIDATION_MESSAGES.orderNote.maxLength)
    .optional(),
});

/**
 * 폼 데이터 타입 (zod 스키마에서 추론)
 */
type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

/**
 * CheckoutForm Props
 */
interface CheckoutFormProps {
  onSubmit: (data: OrderFormData) => void | Promise<void>;
  isLoading?: boolean;
}

/**
 * CheckoutForm Ref (외부에서 제출 트리거용)
 */
export interface CheckoutFormRef {
  submit: () => void;
}

/**
 * 배송 정보 입력 폼 컴포넌트
 */
export const CheckoutForm = forwardRef<CheckoutFormRef, CheckoutFormProps>(
  ({ onSubmit, isLoading = false }, ref) => {
    const form = useForm<CheckoutFormData>({
      resolver: zodResolver(checkoutFormSchema),
      defaultValues: {
        recipientName: "",
        phone: "",
        postalCode: "",
        address: "",
        addressDetail: "",
        orderNote: "",
      },
    });

    // 외부에서 제출할 수 있도록 ref 노출
    useImperativeHandle(ref, () => ({
      submit: () => {
        form.handleSubmit((data) => {
          // CheckoutFormData를 OrderFormData로 변환
          onSubmit(data as OrderFormData);
        })();
      },
    }));

    return (
      <div className="space-y-6 rounded-lg border bg-card p-6">
        <h2 className="text-lg font-bold">배송 정보</h2>

        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit((data) => {
              onSubmit(data as OrderFormData);
            })} 
            className="space-y-6"
          >
            {/* 수신자 이름 */}
            <FormField
              control={form.control}
              name="recipientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    수신자 이름 <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="홍길동"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 전화번호 */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    전화번호 <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="010-1234-5678"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 우편번호 */}
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    우편번호 <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="12345"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 기본 주소 */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    기본 주소 <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="서울특별시 강남구 테헤란로 123"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 상세 주소 */}
            <FormField
              control={form.control}
              name="addressDetail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    상세 주소 <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="101동 101호"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 배송 메모 */}
            <FormField
              control={form.control}
              name="orderNote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>배송 메모 (선택)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="배송 시 요청사항을 입력해주세요."
                      disabled={isLoading}
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    );
  }
);

CheckoutForm.displayName = "CheckoutForm";

