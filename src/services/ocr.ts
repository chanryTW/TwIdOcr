import { createWorker, PSM } from 'tesseract.js';

export interface OcrResult {
  text: string;
  confidence: number;
}

export async function performOcr(imageFile: File): Promise<OcrResult> {
  const worker = await createWorker('chi_tra');
  
  try {
    // 設定辨識參數
    await worker.setParameters({
      tessedit_pageseg_mode: PSM.SINGLE_BLOCK, // 假設統一的文字區塊
      tessedit_ocr_engine_mode: 3, // 使用 LSTM OCR Engine
      preserve_interword_spaces: '1', // 保留字間空格
      tessjs_create_pdf: '0', // 關閉 PDF 輸出以提升速度
      tessjs_create_hocr: '0', // 關閉 HOCR 輸出以提升速度
    });

    const { data: { text, confidence } } = await worker.recognize(imageFile);
    
    await worker.terminate();
    
    return {
      text,
      confidence
    };
  } catch (error) {
    await worker.terminate();
    throw error;
  }
} 