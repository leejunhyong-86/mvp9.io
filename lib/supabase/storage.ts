/**
 * @file lib/supabase/storage.ts
 * @description Supabase Storage 이미지 관리 유틸리티
 *
 * 이 파일은 Supabase Storage와의 상호작용을 위한 함수들을 제공합니다.
 *
 * 주요 기능:
 * 1. 상품 이미지 업로드 (UUID 파일명)
 * 2. 이미지 공개 URL 생성
 * 3. 이미지 삭제
 *
 * @dependencies
 * - @supabase/supabase-js: Supabase 클라이언트
 */

import { getServiceRoleClient } from "@/lib/supabase/service-role";

// 환경 변수에서 버킷 이름 가져오기
const STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_STORAGE_BUCKET || "product-images";

/**
 * 파일 확장자 추출
 */
function getFileExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1] : "";
}

/**
 * UUID v4 생성 (간단한 구현)
 */
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 허용된 이미지 MIME 타입
 */
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

/**
 * 최대 파일 크기 (5MB)
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * 파일 검증
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // MIME 타입 확인
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "지원하지 않는 이미지 형식입니다. (jpg, png, webp만 허용)",
    };
  }

  // 파일 크기 확인
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: "파일 크기가 너무 큽니다. (최대 5MB)",
    };
  }

  return { valid: true };
}

/**
 * 상품 이미지 업로드
 *
 * @param file - 업로드할 이미지 파일
 * @returns 업로드 결과 (성공 시 파일 경로)
 *
 * @example
 * ```ts
 * const file = input.files[0];
 * const result = await uploadProductImage(file);
 * if (result.success) {
 *   console.log('Uploaded path:', result.path);
 * }
 * ```
 */
export async function uploadProductImage(file: File): Promise<{
  success: boolean;
  path?: string;
  error?: string;
}> {
  try {
    // 파일 검증
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    // Service Role 클라이언트 사용 (RLS 우회)
    const supabase = getServiceRoleClient();

    // UUID로 고유한 파일명 생성
    const ext = getFileExtension(file.name);
    const filename = `${generateUUID()}.${ext}`;

    // 파일 업로드
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filename, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      path: data.path,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "업로드 중 오류 발생",
    };
  }
}

/**
 * 이미지 공개 URL 생성
 *
 * @param path - Storage 파일 경로
 * @returns 공개 URL
 *
 * @example
 * ```ts
 * const url = getProductImageUrl('abc-123.jpg');
 * // https://[project].supabase.co/storage/v1/object/public/product-images/abc-123.jpg
 * ```
 */
export function getProductImageUrl(path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`;
}

/**
 * 이미지 삭제
 *
 * @param path - Storage 파일 경로
 * @returns 삭제 결과
 *
 * @example
 * ```ts
 * const result = await deleteProductImage('abc-123.jpg');
 * if (result.success) {
 *   console.log('Image deleted');
 * }
 * ```
 */
export async function deleteProductImage(path: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Service Role 클라이언트 사용 (RLS 우회)
    const supabase = getServiceRoleClient();

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([path]);

    if (error) {
      console.error("Delete error:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "삭제 중 오류 발생",
    };
  }
}

/**
 * 여러 이미지 일괄 삭제
 *
 * @param paths - Storage 파일 경로 배열
 * @returns 삭제 결과
 */
export async function deleteProductImages(paths: string[]): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    if (paths.length === 0) {
      return { success: true };
    }

    // Service Role 클라이언트 사용 (RLS 우회)
    const supabase = getServiceRoleClient();

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove(paths);

    if (error) {
      console.error("Delete error:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "삭제 중 오류 발생",
    };
  }
}

/**
 * Storage URL에서 파일 경로 추출
 *
 * @param url - 전체 Storage URL
 * @returns 파일 경로
 *
 * @example
 * ```ts
 * const url = 'https://[project].supabase.co/storage/v1/object/public/product-images/abc-123.jpg';
 * const path = extractPathFromUrl(url);
 * // 'abc-123.jpg'
 * ```
 */
export function extractPathFromUrl(url: string): string | null {
  try {
    const pattern = new RegExp(
      `${STORAGE_BUCKET}/(.+)$`
    );
    const match = url.match(pattern);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

