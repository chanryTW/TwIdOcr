import React, { useState, useEffect } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface Props {
  imageUrl: string;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<Props> = ({ imageUrl, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0
  });
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    // 取得原始圖片尺寸
    const img = new Image();
    img.onload = () => {
      setImageSize({
        width: img.width,
        height: img.height
      });
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const getCroppedImg = (image: HTMLImageElement, crop: Crop): string => {
    const canvas = document.createElement('canvas');
    
    // 如果沒有進行裁切（crop 維持原始值），使用完整圖片
    if (crop.width === 100 && crop.height === 100 && crop.x === 0 && crop.y === 0) {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('No 2d context');
      ctx.drawImage(image, 0, 0);
      return canvas.toDataURL('image/jpeg');
    }

    // 如果有進行裁切，計算實際的裁切區域
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    // 將百分比轉換為實際像素
    const pixelCrop = {
      x: (crop.x * image.width) / 100,
      y: (crop.y * image.height) / 100,
      width: (crop.width * image.width) / 100,
      height: (crop.height * image.height) / 100
    };

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    ctx.drawImage(
      image,
      pixelCrop.x * scaleX,
      pixelCrop.y * scaleY,
      pixelCrop.width * scaleX,
      pixelCrop.height * scaleY,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return canvas.toDataURL('image/jpeg');
  };

  const handleCropComplete = () => {
    const image = document.createElement('img');
    image.src = imageUrl;
    image.onload = () => {
      const croppedImageUrl = getCroppedImg(image, crop);
      onCropComplete(croppedImageUrl);
    };
  };

  return (
    <div className="relative">
      <ReactCrop
        crop={crop}
        onChange={(c) => setCrop(c)}
        aspect={undefined}
      >
        <img src={imageUrl} alt="待裁切圖片" />
      </ReactCrop>
      <div className="flex justify-end gap-4 mt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          取消
        </button>
        <button
          onClick={handleCropComplete}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          確認
        </button>
      </div>
    </div>
  );
};

export default ImageCropper; 