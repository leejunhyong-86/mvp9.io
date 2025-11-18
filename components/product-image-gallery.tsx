/**
 * @file components/product-image-gallery.tsx
 * @description 상품 이미지 갤러리 컴포넌트
 *
 * 상품 상세 페이지에서 사용되는 이미지 갤러리입니다.
 *
 * 주요 기능:
 * 1. 대형 메인 이미지 표시
 * 2. 하단 썸네일 갤러리 (3-4개)
 * 3. 클릭 시 메인 이미지 변경
 *
 * 핵심 구현 로직:
 * - Client Component (useState로 선택된 이미지 관리)
 * - 현재는 플레이스홀더만 사용 (추후 실제 이미지 지원 예정)
 * - 썸네일 클릭 시 메인 이미지 변경
 *
 * @dependencies
 * - react: useState
 */

"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * 이미지 데이터 타입 (현재는 플레이스홀더만)
 */
interface ImageData {
  id: string;
  url?: string; // 추후 실제 이미지 URL
  placeholder: string; // 현재는 이모지 사용
}

interface ProductImageGalleryProps {
  /**
   * 이미지 목록 (현재는 플레이스홀더만 사용)
   * 기본값: 4개의 플레이스홀더 이미지
   */
  images?: ImageData[];
  className?: string;
}

/**
 * 기본 플레이스홀더 이미지 생성
 */
function generatePlaceholderImages(count: number = 4): ImageData[] {
  const placeholders = ["📦", "📷", "🖼️", "🎨"];
  return Array.from({ length: count }, (_, i) => ({
    id: `placeholder-${i}`,
    placeholder: placeholders[i] || "📦",
  }));
}

export function ProductImageGallery({
  images,
  className,
}: ProductImageGalleryProps) {
  // 기본 이미지 목록 (플레이스홀더)
  const defaultImages = generatePlaceholderImages(4);
  const imageList = images || defaultImages;

  // 선택된 이미지 인덱스
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedImage = imageList[selectedIndex] || imageList[0];

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* 메인 이미지 영역 */}
      <div className="aspect-square w-full overflow-hidden rounded-lg border bg-muted">
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
          <span className="text-8xl text-muted-foreground/50">
            {selectedImage.placeholder}
          </span>
        </div>
      </div>

      {/* 썸네일 갤러리 */}
      {imageList.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {imageList.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "flex-shrink-0 rounded-lg border-2 transition-all",
                "aspect-square w-20 overflow-hidden bg-muted",
                "hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                selectedIndex === index
                  ? "border-primary"
                  : "border-transparent"
              )}
              aria-label={`이미지 ${index + 1} 선택`}
            >
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                <span className="text-2xl text-muted-foreground/50">
                  {image.placeholder}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

