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
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  hasNoImages,
  getImageSizes,
  getPlaceholderEmoji,
} from "@/lib/image-utils";

interface ProductImageGalleryProps {
  /**
   * 이미지 URL 배열
   */
  images?: string[] | null;
  /**
   * 상품명 (alt 텍스트용)
   */
  productName: string;
  className?: string;
}

export function ProductImageGallery({
  images,
  productName,
  className,
}: ProductImageGalleryProps) {
  // 선택된 이미지 인덱스
  const [selectedIndex, setSelectedIndex] = useState(0);

  const noImages = hasNoImages(images);
  const imageList = images || [];
  const selectedImageUrl = imageList[selectedIndex];

  // 개발용: 이미지가 없을 때 플레이스홀더 썸네일 표시
  const placeholderThumbnails = ["📦", "📷", "🖼️", "🎨"];

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* 메인 이미지 영역 */}
      <div className="aspect-square w-full overflow-hidden rounded-lg border bg-muted">
        {noImages ? (
          // 플레이스홀더 - 선택된 이모지 표시
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <span className="text-8xl text-muted-foreground/50">
              {placeholderThumbnails[selectedIndex] || getPlaceholderEmoji()}
            </span>
          </div>
        ) : (
          // Next.js Image로 최적화된 이미지
          <Image
            src={selectedImageUrl}
            alt={`${productName} - 이미지 ${selectedIndex + 1}`}
            width={800}
            height={800}
            sizes={getImageSizes("gallery")}
            className="h-full w-full object-cover"
            priority={selectedIndex === 0}
          />
        )}
      </div>

      {/* 썸네일 갤러리 */}
      {noImages ? (
        // 이미지가 없을 때: 플레이스홀더 썸네일 표시
        <div className="flex gap-2 overflow-x-auto pb-2">
          {placeholderThumbnails.map((emoji, index) => (
            <button
              key={`placeholder-${index}`}
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
              aria-label={`플레이스홀더 이미지 ${index + 1} 선택`}
            >
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                <span className="text-2xl text-muted-foreground/50">
                  {emoji}
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        // 이미지가 있을 때: 실제 이미지 썸네일 표시 (2개 이상일 때만)
        imageList.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {imageList.map((imageUrl, index) => (
              <button
                key={`${imageUrl}-${index}`}
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
                <Image
                  src={imageUrl}
                  alt={`${productName} - 썸네일 ${index + 1}`}
                  width={80}
                  height={80}
                  sizes={getImageSizes("thumbnail")}
                  className="h-full w-full object-cover"
                  priority={false}
                />
              </button>
            ))}
          </div>
        )
      )}
    </div>
  );
}

