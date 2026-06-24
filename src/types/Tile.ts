export type Grade = 'A' | 'B' | 'C' | 'n/a';

// Raw shape returned by the API
export interface ApiTile {
  Tile_Id: number;
  Tile_Type: string;
  Wafer: string;
  Tile_Row: number;
  Tile_Column: number;
  Tile_Identity: string;
  Grade: string;
  Created_Date: string;
  Created_By: string;
  Modified_Date: string;
  Modified_By: string;
}

// Frontend representation used throughout the app
export interface Tile {
  id: string;
  type: string;
  wafer: string;
  row: number;
  column: number;
  tileId: string;
  grade: Grade;
}