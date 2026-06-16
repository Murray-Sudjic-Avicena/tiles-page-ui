// 'Bridge' to Backend/API. Sends HTTP requests to API endpoint at 'http://localhost:8000/api'. Returns the data to construct tile table

import type { Tile, SortField, SortDirection } from '../types/Tile';

export interface TileQueryParams {
  page: number;
  pageSize: number;
  sortField?: SortField;
  sortDir?: SortDirection;
  search?: string;
}

export interface PagedTileResponse {
  tiles: Tile[];
  total: number;
  page: number;
  page_size: number;
}

// api URL
const BASE_URL = 'http://localhost:8000/api';

// input: Takes a TileQueryParams object
// output: PageTileResponse, wrapped in a Promise - i.e, caller waits for HTTP body to return

export async function fetchTiles(params: TileQueryParams): Promise<PagedTileResponse> {
  // builds query string (sortfield,... only added if they have values)
  const qs = new URLSearchParams({
    page: String(params.page),
    page_size: String(params.pageSize),
  });
  if (params.sortField) qs.set('sort_field', params.sortField);
  if (params.sortDir)   qs.set('sort_dir', params.sortDir);
  if (params.search)    qs.set('search', params.search);
  // Calls the api using browsers built-in fetch, appending query string to base URL
  const res = await fetch(`${BASE_URL}/tiles?${qs}`);
  if (!res.ok) throw new Error(`Tiles API error: ${res.status}`);
  return res.json() as Promise<PagedTileResponse>; 
}
