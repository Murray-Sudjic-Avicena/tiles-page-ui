// tile types

export type Grade = 'A' | 'B' | 'C' | 'n/a';
export type SortField = 'type' | 'wafer' | 'row' | 'column' | 'tileId' | 'grade';
export type SortDirection = 'asc' | 'desc';

export interface Tile {
  id: string;
  type: string;
  wafer: string;
  row: number;
  column: number;
  tileId: string;
  grade: Grade;
}

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}