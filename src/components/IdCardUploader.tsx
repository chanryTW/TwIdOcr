import React, { ChangeEvent, useState, DragEvent } from 'react';
import { Region, CardType } from '../types/ocr';
import { CARD_LABELS, CARD_REGIONS, REFERENCE_SIZES } from '../constants/cardRegions';
import RegionSelector from './RegionSelector';

interface Props {
  onUpload: (file: File, regions: Region[], cardType: CardType) => void;
}

const IdCardUploader: React.FC<Props> = ({ onUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedType, setSelectedType] = useState<CardType>('id');

  const handleFile = (file: File) => {
    // 建立圖片預覽
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    }
  };

  const handleImageLoad = (newRegions: Region[]) => {
    setRegions(newRegions);
  };

  const handleStartOcr = () => {
    const file = preview && dataUrlToFile(preview);
    if (file) {
      onUpload(file, regions, selectedType);
    }
  };

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value as CardType);
    setPreview(null);
    setRegions([]);
  };

  // 將 Data URL 轉換為 File 物件
  const dataUrlToFile = (dataUrl: string): File | null => {
    try {
      const arr = dataUrl.split(',');
      const mime = arr[0].match(/:(.*?);/)?.[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], 'image.jpg', { type: mime });
    } catch {
      return null;
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-xl font-semibold">上傳證件圖片</h2>
        <select
          value={selectedType}
          onChange={handleTypeChange}
          className="px-4 py-2 border rounded-lg bg-white"
        >
          {Object.entries(CARD_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div
        className={`flex flex-col gap-4 p-8 border-2 border-dashed rounded-lg transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!preview ? (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              將{CARD_LABELS[selectedType]}圖片拖曳至此處，或點擊下方按鈕選擇圖片
            </p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors"
            >
              選擇圖片
            </label>
          </div>
        ) : (
          <>
            <div className="relative">
              <RegionSelector
                imageUrl={preview}
                onImageLoad={handleImageLoad}
                cardType={selectedType}
              />
              <button
                onClick={() => {
                  setPreview(null);
                  setRegions([]);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="text-center mt-4">
              <button
                onClick={handleStartOcr}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                開始辨識
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default IdCardUploader; 