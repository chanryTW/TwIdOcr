import { createWorker, PSM } from 'tesseract.js';
import { Region, FieldOcrResult } from '../types/ocr';

export async function performOcr(
  imageFile: File,
  regions?: Region[]
): Promise<FieldOcrResult> {
  const worker = await createWorker('chi_tra+eng');
  
  try {
    // 設定基本參數
    await worker.setParameters({
      tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
      tessedit_ocr_engine_mode: 3,
      preserve_interword_spaces: '1',
      tessjs_create_pdf: '0',
      tessjs_create_hocr: '0',
    });

    if (!regions || regions.length === 0) {
      const { data: { text, confidence } } = await worker.recognize(imageFile);
      await worker.terminate();
      return {
        text: { text, confidence }
      };
    }

    // 建立 canvas 來處理圖片區域
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('無法建立 canvas context');

    // 載入圖片
    await new Promise((resolve) => {
      img.onload = resolve;
      img.src = URL.createObjectURL(imageFile);
    });

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // 對每個區域進行辨識
    const results: FieldOcrResult = {};
    for (const region of regions) {
      // 取得區域圖片資料
      const imageData = ctx.getImageData(
        region.x,
        region.y,
        region.width,
        region.height
      );
      
      // 建立新的 canvas 來存放區域圖片
      const regionCanvas = document.createElement('canvas');
      regionCanvas.width = region.width;
      regionCanvas.height = region.height;
      const regionCtx = regionCanvas.getContext('2d');
      if (!regionCtx) continue;

      // 將區域圖片繪製到新的 canvas
      regionCtx.putImageData(imageData, 0, 0);

      // 將 canvas 轉換為 blob
      const blob = await new Promise<Blob>((resolve) => 
        regionCanvas.toBlob(blob => resolve(blob!), 'image/png')
      );

      // 根據不同欄位設定不同的辨識參數
      if (region.field === 'id') {
        await worker.setParameters({
          tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
          tessedit_pageseg_mode: PSM.SINGLE_LINE,
        });
      } else {
        await worker.setParameters({
          tessedit_char_whitelist: '',
          tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
        });
      }

      // 辨識區域
      const { data: { text, confidence } } = await worker.recognize(blob);
      results[region.field] = { 
        text: region.field === 'id' ? text.replace(/\s+/g, '') : text, 
        confidence 
      };
    }

    await worker.terminate();
    return results;
  } catch (error) {
    await worker.terminate();
    throw error;
  }
} 