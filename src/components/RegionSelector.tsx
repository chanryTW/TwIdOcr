import React, { useEffect, useRef, useState } from 'react';
import { Region, CardType } from '../types/ocr';
import { CARD_REGIONS, REFERENCE_SIZES } from '../constants/cardRegions';

interface Props {
  imageUrl: string;
  onImageLoad: (regions: Region[]) => void;
  cardType: CardType;
}

const RegionSelector: React.FC<Props> = ({ imageUrl, onImageLoad, cardType }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image] = useState(new Image());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    image.onload = () => {
      // 設定 canvas 尺寸
      canvas.width = image.width;
      canvas.height = image.height;

      // 繪製圖片
      ctx.drawImage(image, 0, 0);

      // 計算縮放比例
      const scaleX = image.width / REFERENCE_SIZES[cardType].width;
      const scaleY = image.height / REFERENCE_SIZES[cardType].height;

      // 根據縮放比例調整區域位置
      const regions = Object.entries(CARD_REGIONS[cardType]).map(([field, region]) => ({
        field,
        x: Math.round(region.x * scaleX),
        y: Math.round(region.y * scaleY),
        width: Math.round(region.width * scaleX),
        height: Math.round(region.height * scaleY)
      }));

      // 繪製區域框
      regions.forEach(region => {
        ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(region.x, region.y, region.width, region.height);

        // 添加標籤
        ctx.fillStyle = 'rgba(0, 0, 255, 1)';
        ctx.font = '14px sans-serif';
        ctx.fillText(region.field, region.x + 2, region.y + 12);
      });

      onImageLoad(regions);
    };

    image.src = imageUrl;
  }, [image, imageUrl, cardType, onImageLoad]);

  return (
    <div className="relative w-full overflow-auto">
      <canvas
        ref={canvasRef}
        className="max-w-full"
      />
    </div>
  );
};

export default RegionSelector; 