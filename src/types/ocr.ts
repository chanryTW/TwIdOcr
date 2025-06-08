export type CardType = 'id' | 'health' | 'driver';

export interface Region {
  field: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type CardRegions = Record<string, Region>;

export type CardRegionsMap = Record<CardType, CardRegions>;

export interface OcrResult {
  text: string;
  confidence: number;
}

export type FieldOcrResult = {
  [key: string]: OcrResult;
}; 