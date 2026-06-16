// tile types

export type Grade = 'A' | 'B' | 'C' | 'n/a';

export interface Tile {
  id: string;
  type: string;
  wafer: string;
  row: number;
  column: number;
  tileId: string;
  grade: Grade;
}