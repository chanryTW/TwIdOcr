export type CardType = 'id' | 'health' | 'driver';

export type IdCardField = 'name' | 'id' | 'birth' | 'issueDate';
export type HealthCardField = 'name' | 'id' | 'birth' | 'validDate';
export type DriverLicenseField = 'name' | 'id' | 'birth' | 'licenseNumber' | 'validDate';

export type CardField = IdCardField | HealthCardField | DriverLicenseField;

export interface Region {
  id: string;
  field: CardField;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OcrResult {
  text: string;
  confidence: number;
}

export type FieldOcrResult = {
  [key in CardField]?: OcrResult;
}; 