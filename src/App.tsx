import React, { useState } from 'react';
import IdCardUploader from './components/IdCardUploader';
import { performOcr } from './services/ocr';
import { Region, FieldOcrResult, CardType } from './types/ocr';
import { FIELD_LABELS, CARD_LABELS } from './constants/cardRegions';

interface OcrState {
  results: FieldOcrResult | null;
  isProcessing: boolean;
  error?: string;
  cardType?: CardType;
}

function App() {
  const [ocrState, setOcrState] = useState<OcrState>({
    results: null,
    isProcessing: false
  });

  const handleUpload = async (file: File, regions: Region[], cardType: CardType) => {
    setOcrState(prev => ({ 
      ...prev, 
      isProcessing: true, 
      error: undefined,
      cardType 
    }));
    
    try {
      const results = await performOcr(file, regions);
      setOcrState({
        results,
        isProcessing: false,
        cardType
      });
    } catch {
      setOcrState(prev => ({
        ...prev,
        isProcessing: false,
        error: '處理圖片時發生錯誤，請重試'
      }));
    }
  };

  return (
    <div className="w-screen min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">證件 OCR Demo</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <IdCardUploader onUpload={handleUpload} />

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">
              辨識結果
              {ocrState.cardType && (
                <span className="ml-2 text-gray-500">
                  ({CARD_LABELS[ocrState.cardType]})
                </span>
              )}
            </h2>
            <div className="p-4 bg-gray-50 rounded min-h-[100px]">
              {ocrState.isProcessing ? (
                <div className="text-center text-gray-600">
                  正在處理圖片...
                </div>
              ) : ocrState.error ? (
                <div className="text-center text-red-500">
                  {ocrState.error}
                </div>
              ) : ocrState.results ? (
                <div className="space-y-4">
                  {Object.entries(ocrState.results).map(([field, result]) => (
                    <div key={field} className="flex items-start">
                      <div className="w-24 flex-shrink-0 font-semibold">
                        {FIELD_LABELS[field]}：
                      </div>
                      <div className="flex-1">
                        <div className="whitespace-pre-wrap">{result.text}</div>
                        <div className="mt-1 text-sm text-gray-500">
                          辨識信心度：{(result.confidence * 100).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-600">
                  尚未有辨識結果
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
