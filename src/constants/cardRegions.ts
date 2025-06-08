import { CardType, CardRegionsMap } from '../types/ocr';

// 參考尺寸
export const REFERENCE_SIZES: Record<CardType, { width: number; height: number }> = {
  id: {
    width: 1000,
    height: 650
  },
  health: {
    width: 860,    // 健保卡的標準寬度
    height: 540    // 健保卡的標準高度
  }
};

// 卡片區域定義
export const CARD_REGIONS: CardRegionsMap = {
  id: {
    name: {
      field: 'name',
      x: 160,      // 姓名位置
      y: 295,      
      width: 480,  
      height: 100   
    },
    id: {
      field: 'id',
      x: 640,      // 身分證字號位置（右上角）
      y: 520,      
      width: 320,  
      height: 80   
    },
    birth: {
      field: 'birth',
      x: 160,      // 出生年月日位置
      y: 410,      
      width: 480,  
      height: 90   
    },
    issueDate: {
      field: 'issueDate',
      x: 160,      // 發證日期位置
      y: 520,      
      width: 480,  
      height: 80   
    }
  },
  health: {
    name: {
      field: 'name',
      x: 220,      // 姓名位置
      y: 180,      
      width: 200,  
      height: 40   
    },
    id: {
      field: 'id',
      x: 220,      // 身分證字號位置
      y: 230,      
      width: 200,  
      height: 40   
    },
    birth: {
      field: 'birth',
      x: 220,      // 出生年月日位置
      y: 280,      
      width: 200,  
      height: 40   
    },
    cardNumber: {
      field: 'cardNumber',
      x: 220,      // 卡號位置
      y: 330,      
      width: 200,  
      height: 40   
    }
  }
};

// 卡片類型標籤
export const CARD_LABELS: Record<CardType, string> = {
  id: '身分證',
  health: '健保卡'
};

// 欄位標籤
export const FIELD_LABELS: Record<string, string> = {
  name: '姓名',
  id: '身分證字號',
  birth: '出生年月日',
  issueDate: '發證日期',
  cardNumber: '卡號'
}; 