import React, { useState } from 'react';
import IdCardUploader from './components/IdCardUploader';

function App() {
  const [result, setResult] = useState<string>('');

  const handleUpload = (file: File) => {
    // TODO: 實作 OCR 處理邏輯
    console.log('處理上傳的檔案:', file);
    setResult('正在處理圖片...');
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
              {result || '尚未有辨識結果'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
