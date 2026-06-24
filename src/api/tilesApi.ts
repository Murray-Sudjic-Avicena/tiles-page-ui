import type { Tile, ApiTile, Grade } from '../types/Tile';

export interface SortModelItem {
  colId: string;
  sort: 'asc' | 'desc';
}

export interface TileQueryRequest {
  startRow: number;
  endRow: number;
  sortModel: SortModelItem[];
  filterModel: Record<string, unknown>;
  search?: string;
}

export interface TileBlockResponse {
  rows: Tile[];
  lastRow: number; // -1 means total is unknown; a non-negative value signals the final page
}

// Maps a frontend column id to the API's field name for sort_by
const COL_TO_API_FIELD: Record<string, string> = {
  type:   'Tile_Type',
  wafer:  'Wafer',
  row:    'Tile_Row',
  column: 'Tile_Column',
  tileId: 'Tile_Identity',
  grade:  'Grade',
};

const BASE_URL = '/api';

function mapTile(raw: ApiTile): Tile {
  return {
    id:     String(raw.Tile_Id),
    type:   raw.Tile_Type,
    wafer:  raw.Wafer,
    row:    raw.Tile_Row,
    column: raw.Tile_Column,
    tileId: raw.Tile_Identity,
    grade:  (raw.Grade ?? 'n/a') as Grade,
  };
}

// Converts AG Grid's startRow/endRow block request to page-based API calls.
// Returns lastRow=-1 while more pages may exist; sets it to the exact count
// once the last page is reached so the grid can size its scrollbar.
export async function queryTiles(req: TileQueryRequest): Promise<TileBlockResponse> {
  const blockSize = req.endRow - req.startRow;
  const page = Math.floor(req.startRow / blockSize) + 1;

  const params = new URLSearchParams({
    page:      String(page),
    page_size: String(blockSize),
  });

  if (req.sortModel.length > 0) {
    const s = req.sortModel[0];
    const apiField = COL_TO_API_FIELD[s.colId];
    if (apiField) {
      params.set('sort_by',    apiField);
      params.set('sort_order', s.sort);
    }
  }

  if (req.search) params.set('search', req.search);

  const res = await fetch(`${BASE_URL}/tiles?${params}`);
  if (!res.ok) throw new Error(`Tiles API error: ${res.status}`);

  const body = await res.json() as { page: number; page_size: number; data: ApiTile[] };
  const rows = body.data.map(mapTile);

  // If this page returned fewer rows than requested, we've hit the last page.
  const isLastPage = rows.length < blockSize;
  const lastRow = isLastPage ? req.startRow + rows.length : -1;

  return { rows, lastRow };
}

// Editable fields of a tile (id is assigned by the backend).
export interface TileInput {
  type: string;
  wafer: string;
  row: number;
  column: number;
  tileId: string;
  grade: Grade;
}

export async function createTile(_input: TileInput): Promise<Tile> {
  throw new Error('Create tile is not yet supported by the API.');
}

export async function updateTile(_id: string, _input: TileInput): Promise<Tile> {
  throw new Error('Update tile is not yet supported by the API.');
}

export async function deleteTile(_id: string): Promise<void> {
  throw new Error('Delete tile is not yet supported by the API.');
}
