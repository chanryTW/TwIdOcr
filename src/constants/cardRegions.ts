import { Region, CardType } from '../types/ocr';

// 參考尺寸
export const REFERENCE_SIZES = {
  id: {
    width: 1000,
    height: 650
  },
  health: {
    width: 1000,
    height: 650
  },
  driver: {
    width: 1000,
    height: 650
  }
};

// 預設區域位置
const ID_CARD_REGIONS: Array<Omit<Region, 'id'>> = [
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

const HEALTH_CARD_REGIONS: Array<Omit<Region, 'id'>> = [
  {
    field: 'name',
    x: 150,
    y: 200,
    width: 200,
    height: 45
  },
  {
    field: 'id',
    x: 150,
    y: 250,
    width: 300,
    height: 45
  },
  {
    field: 'birth',
    x: 150,
    y: 300,
    width: 250,
    height: 45
  },
  {
    field: 'validDate',
    x: 150,
    y: 350,
    width: 250,
    height: 45
  }
];

const DRIVER_LICENSE_REGIONS: Array<Omit<Region, 'id'>> = [
  {
    field: 'name',
    x: 200,
    y: 150,
    width: 200,
    height: 45
  },
  {
    field: 'id',
    x: 200,
    y: 200,
    width: 300,
    height: 45
  },
  {
    field: 'birth',
    x: 200,
    y: 250,
    width: 250,
    height: 45
  },
  {
    field: 'licenseNumber',
    x: 200,
    y: 300,
    width: 300,
    height: 45
  },
  {
    field: 'validDate',
    x: 200,
    y: 350,
    width: 250,
    height: 45
  }
];

export const CARD_REGIONS: Record<CardType, Array<Omit<Region, 'id'>>> = {
  id: ID_CARD_REGIONS,
  health: HEALTH_CARD_REGIONS,
  driver: DRIVER_LICENSE_REGIONS
};

export const CARD_LABELS: Record<CardType, string> = {
  id: '身分證',
  health: '健保卡',
  driver: '駕照'
};

export const FIELD_LABELS: Record<string, string> = {
  name: '姓名',
  id: '身分證字號',
  birth: '出生年月日',
  issueDate: '發證日期',
  validDate: '有效期限',
  licenseNumber: '駕照號碼'
}; 