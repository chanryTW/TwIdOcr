import React, { useRef, useEffect } from 'react';
import { Region } from '../types/ocr';
import { DEFAULT_REGIONS, ID_CARD_REFERENCE } from '../constants/idCardRegions';

interface Props {
  imageUrl: string;
  onImageLoad?: (regions: Region[]) => void;
}

const FIELD_LABELS: Record<string, string> = {
  name: '姓名',
  id: '身分證字號',
  birth: '出生年月日',
  address: '住址',
  issueDate: '發證日期'
};

const RegionSelector: React.FC<Props> = ({ imageUrl, onImageLoad }) => {
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
      const scaleX = image.width / ID_CARD_REFERENCE.width;
      const scaleY = image.height / ID_CARD_REFERENCE.height;

      // 產生實際區域
      const scaledRegions: Region[] = DEFAULT_REGIONS.map(region => ({
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
  }, [imageUrl, onImageLoad]);

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