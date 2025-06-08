import React, { useRef, useEffect } from 'react';
import { Region, CardType } from '../types/ocr';
import { CARD_REGIONS, FIELD_LABELS, REFERENCE_SIZES } from '../constants/cardRegions';

interface Props {
  imageUrl: string;
  cardType: CardType;
  onImageLoad?: (regions: Region[]) => void;
}

const RegionSelector: React.FC<Props> = ({ imageUrl, cardType, onImageLoad }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // 設定 canvas 大小
      canvas.width = image.width;
      canvas.height = image.height;

      // 計算縮放比例
      const scaleX = image.width / REFERENCE_SIZES[cardType].width;
      const scaleY = image.height / REFERENCE_SIZES[cardType].height;

      // 產生實際區域
      const scaledRegions: Region[] = CARD_REGIONS[cardType].map(region => ({
        ...region,
        id: Date.now().toString() + Math.random(),
        x: region.x * scaleX,
        y: region.y * scaleY,
        width: region.width * scaleX,
        height: region.height * scaleY
      }));

      // 通知父組件
      onImageLoad?.(scaledRegions);

      drawCanvas(image, scaledRegions);
    };
  }, [imageUrl, cardType, onImageLoad]);

  const drawCanvas = (image: HTMLImageElement, regions: Region[]) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // 清除畫布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 繪製圖片
    ctx.drawImage(image, 0, 0);

    // 繪製區域
    regions.forEach(region => {
      ctx.strokeStyle = '#0000ff75';
      ctx.lineWidth = 2;
      ctx.strokeRect(region.x, region.y, region.width, region.height);
      
      // 繪製標籤
      ctx.fillStyle = '#0000ff';
      ctx.font = '14px Arial';
      ctx.fillText(FIELD_LABELS[region.field], region.x, region.y + 12);
    });
  };

  return (
    <div className="relative border rounded">
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto"
      />
    </div>
  );
};

export default RegionSelector; 