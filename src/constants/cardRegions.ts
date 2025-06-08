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
  },
  driver: {
    width: 1000,
    height: 650
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
      x: 270,      // 姓名位置
      y: 200,      
      width: 310,  
      height: 120   
    },
    id: {
      field: 'id',
      x: 270,      // 身分證字號位置
      y: 320,      
      width: 310,  
      height: 60   
    },
    birth: {
      field: 'birth',
      x: 270,      // 出生年月日位置
      y: 380,      
      width: 310,  
      height: 50   
    },
    cardNumber: {
      field: 'cardNumber',
      x: 30,      // 卡號位置
      y: 450,      
      width: 250,  
      height: 70   
    }
  },
  driver: {
    name: {
      field: 'name',
      x: 160,
      y: 200,
      width: 300,
      height: 45
    },
    id: {
      field: 'id',
      x: 160,
      y: 250,
      width: 300,
      height: 45
    },
    birth: {
      field: 'birth',
      x: 160,
      y: 300,
      width: 250,
      height: 45
    },
    licenseNumber: {
      field: 'licenseNumber',
      x: 160,
      y: 350,
      width: 300,
      height: 45
    },
    validDate: {
      field: 'validDate',
      x: 160,
      y: 400,
      width: 250,
      height: 45
    }
  }
};

// 卡片類型標籤
export const CARD_LABELS: Record<CardType, string> = {
  id: '身分證',
  health: '健保卡',
  driver: '駕照'
};

// 欄位標籤
export const FIELD_LABELS: Record<string, string> = {
  name: '姓名',
  id: '身分證字號',
  birth: '出生年月日',
  issueDate: '發證日期',
  validDate: '有效期限',
  licenseNumber: '駕照號碼',
  cardNumber: '卡號'
}; 