export type IdCardField = 
  | 'name' 
  | 'id' 
  | 'birth' 
  | 'address' 
  | 'issueDate';

export interface Region {
  id: string;
  field: IdCardField;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OcrResult {
  text: string;
  confidence: number;
}

export interface FieldOcrResult {
  [key in IdCardField]?: OcrResult;
} 