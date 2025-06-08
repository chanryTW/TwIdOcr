import React, { useState } from 'react';
import IdCardUploader from './components/IdCardUploader';
import { performOcr } from './services/ocr';

interface OcrState {
  text: string;
  confidence: number;
  isProcessing: boolean;
  error?: string;
}

function App() {
  const [ocrState, setOcrState] = useState<OcrState>({
    text: '',
    confidence: 0,
    isProcessing: false
  });

  const handleUpload = async (file: File) => {
    setOcrState(prev => ({ ...prev, isProcessing: true, error: undefined }));
    
    try {
      const result = await performOcr(file);
      setOcrState({
        text: result.text,
        confidence: result.confidence,
        isProcessing: false
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
        <h1 className="text-3xl font-bold mb-8">台灣身分證 OCR Demo</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <IdCardUploader onUpload={handleUpload} />

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">辨識結果</h2>
            <div className="p-4 bg-gray-50 rounded min-h-[100px]">
              {ocrState.isProcessing ? (
                <div className="text-center text-gray-600">
                  正在處理圖片...
                </div>
              ) : ocrState.error ? (
                <div className="text-center text-red-500">
                  {ocrState.error}
                </div>
              ) : ocrState.text ? (
                <div>
                  <div className="whitespace-pre-wrap">{ocrState.text}</div>
                  <div className="mt-2 text-sm text-gray-500">
                    辨識信心度：{(ocrState.confidence * 100).toFixed(2)}%
                  </div>
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
