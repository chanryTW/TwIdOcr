import { Region } from '../types/ocr';

// 身分證影像大小參考值（基於標準身分證比例）
export const ID_CARD_REFERENCE = {
  width: 1000,  // 參考寬度
  height: 650   // 參考高度
};

// 預設區域位置（基於參考大小的百分比）
export const DEFAULT_REGIONS: Array<Omit<Region, 'id'>> = [
  {
    field: 'name',
    x: 160,      // 姓名位置
    y: 295,      
    width: 480,  
    height: 100   
  },
  {
    field: 'id',
    x: 640,      // 身分證字號位置（右上角）
    y: 520,      
    width: 320,  
    height: 80   
  },
  {
    field: 'birth',
    x: 160,      // 出生年月日位置
    y: 410,      
    width: 480,  
    height: 90   
  },
  {
    field: 'issueDate',
    x: 160,      // 發證日期位置
    y: 520,      
    width: 480,  
    height: 80   
  }
]; 