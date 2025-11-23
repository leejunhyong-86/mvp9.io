/**
 * @file lib/image-utils.ts
 * @description 이미지 관련 헬퍼 유틸리티
 *
 * Next.js Image 컴포넌트와 함께 사용하기 위한 헬퍼 함수들
 *
 * 주요 기능:
 * 1. 이미지 URL 또는 플레이스홀더 반환
 * 2. Blur placeholder 생성 (선택적)
 */

/**
 * 플레이스홀더 이미지 이모지
 */
const PLACEHOLDER_EMOJI = "📦";

/**
 * 이미지 URL 가져오기
 * 이미지가 없으면 null 반환
 *
 * @param images - 이미지 URL 배열
 * @param index - 가져올 이미지 인덱스 (기본값: 0)
 * @returns 이미지 URL 또는 null
 */
export function getImageUrl(
  images: string[] | null | undefined,
  index: number = 0
): string | null {
  if (!images || images.length === 0) {
    return null;
  }
  return images[index] || null;
}

/**
 * 첫 번째 이미지 URL 가져오기 또는 플레이스홀더
 *
 * @param images - 이미지 URL 배열
 * @returns 이미지 URL 또는 null (플레이스홀더 표시용)
 */
export function getFirstImageOrNull(
  images: string[] | null | undefined
): string | null {
  return getImageUrl(images, 0);
}

/**
 * 이미지 배열이 비어있는지 확인
 *
 * @param images - 이미지 URL 배열
 * @returns 비어있으면 true
 */
export function hasNoImages(images: string[] | null | undefined): boolean {
  return !images || images.length === 0;
}

/**
 * 이미지 개수 반환
 *
 * @param images - 이미지 URL 배열
 * @returns 이미지 개수
 */
export function getImageCount(images: string[] | null | undefined): number {
  return images?.length || 0;
}

/**
 * 플레이스홀더 이모지 가져오기
 */
export function getPlaceholderEmoji(): string {
  return PLACEHOLDER_EMOJI;
}

/**
 * Simple blur data URL 생성 (선택적)
 * Next.js Image의 placeholder="blur"와 함께 사용
 *
 * @returns Base64 인코딩된 blur placeholder
 */
export function generateBlurDataUrl(): string {
  // 단순한 그레이 blur placeholder
  return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg==";
}

/**
 * 이미지 크기별 sizes 속성 생성
 * Next.js Image의 sizes 속성에 사용
 *
 * @param type - 이미지 타입 (card, gallery, detail)
 * @returns sizes 속성 문자열
 */
export function getImageSizes(
  type: "card" | "gallery" | "thumbnail" = "card"
): string {
  switch (type) {
    case "card":
      // 상품 카드: 모바일 50vw, 태블릿 33vw, 데스크톱 25vw
      return "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw";
    case "gallery":
      // 상세 페이지 메인 이미지: 모바일 100vw, 데스크톱 60vw
      return "(max-width: 1024px) 100vw, 60vw";
    case "thumbnail":
      // 썸네일: 고정 80px
      return "80px";
    default:
      return "100vw";
  }
}

