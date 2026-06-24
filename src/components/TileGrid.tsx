import { useMemo, useCallback, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type {
  ColDef,
  ICellRendererParams,
  GridApi,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from 'ag-grid-community';
import type { Tile } from '../types/Tile';
import { queryTiles } from '../api/tilesApi';
import { gridTheme } from '../theme/gridTheme';

const BLOCK_SIZE = 100;

// Passed to the grid as `context` so cell renderers can reach the row actions.
interface GridContext {
  onEditTile: (tile: Tile) => void;
  onDeleteTile: (tile: Tile) => void;
}

// Imperative handle exposed to the parent (e.g. to refetch after a mutation).
export interface TileGridHandle {
  refresh: () => void;
}

function TileIdRenderer({ value }: ICellRendererParams<Tile>) {
  return <span className="tile-id">{value}</span>;
}

function ActionCellRenderer({ data, context }: ICellRendererParams<Tile, unknown, GridContext>) {
  if (!data) return null;
  return (
    <span style={{ display: 'flex', gap: 4, alignItems: 'center', height: '100%' }}>
      <button
        className="action-btn"
        onClick={() => context.onEditTile(data)}
        title="Edit"
      >
        <svg style={{ width: 14, height: 14, stroke: 'currentColor', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', verticalAlign: 'middle' }} viewBox="0 0 24 24" aria-hidden>
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </button>
      <button
        className="action-btn"
        onClick={() => context.onDeleteTile(data)}
        title="Delete"
      >
        <svg style={{ width: 14, height: 14, stroke: 'currentColor', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', verticalAlign: 'middle' }} viewBox="0 0 24 24" aria-hidden>
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6V4h6v2" />
        </svg>
      </button>
    </span>
  );
}

interface Props {
  search: string;
  onEditTile: (tile: Tile) => void;
  onDeleteTile: (tile: Tile) => void;
}

const TileGrid = forwardRef<TileGridHandle, Props>(function TileGrid( //Reference, capability is in TilePage to call these functions
  { search, onEditTile, onDeleteTile },
  ref,
) {
  const gridApiRef = useRef<GridApi<Tile> | null>(null);
  // Keep the latest search in a ref so the datasource always reads the current
  // value without having to be recreated on every keystroke.
  const searchRef = useRef(search);
  searchRef.current = search;

  // Latest action callbacks, read via grid context (which we set once).
  const contextRef = useRef<GridContext>({ onEditTile, onDeleteTile });
  contextRef.current = { onEditTile, onDeleteTile };

  // Function sent upwards - against convention, allows TilePage to refetch the grid after add/edit/delete.
  useImperativeHandle(ref, () => ({
    refresh: () => gridApiRef.current?.purgeInfiniteCache(), // purgeInfiniteCache deletes stale values
  }), []);

  const colDefs = useMemo<ColDef<Tile>[]>(() => [
    { field: 'type',   headerName: 'Type',    flex: 2,   filter: 'agTextColumnFilter' },
    { field: 'wafer',  headerName: 'Wafer',   flex: 1,   filter: 'agTextColumnFilter' },
    { field: 'row',    headerName: 'Row',     flex: 1,   type: 'numericColumn', filter: 'agNumberColumnFilter' },
    { field: 'column', headerName: 'Column',  flex: 1,   type: 'numericColumn', filter: 'agNumberColumnFilter' },
    { field: 'tileId', headerName: 'Tile ID', flex: 1.5, cellRenderer: TileIdRenderer, filter: 'agTextColumnFilter' },
    { field: 'grade',  headerName: 'Grade',   flex: 1,   filter: 'agTextColumnFilter' },
    {
      headerName: 'Actions',
      flex: 1.5,
      sortable: false,
      filter: false,
      cellRenderer: ActionCellRenderer,
    },
  ], []);

  // The datasource is how the grid asks us for rows. It fires whenever the grid
  // needs a block — on first load, on scroll, and after sort/filter changes.
  const datasource = useMemo<IDatasource>(() => ({
    getRows: async (params: IGetRowsParams) => {
      try {
        const res = await queryTiles({
          startRow: params.startRow,
          endRow: params.endRow,
          sortModel: params.sortModel.map((s) => ({ colId: s.colId, sort: s.sort })),
          filterModel: params.filterModel ?? {},
          search: searchRef.current || undefined,
        });
        params.successCallback(res.rows, res.lastRow);
      } catch (err) {
        console.error(err);
        params.failCallback();
      }
    },
  }), []);

  const onGridReady = useCallback((e: GridReadyEvent<Tile>) => {
    gridApiRef.current = e.api;
  }, []);

  // When the global search changes, drop cached blocks so they refetch.
  useEffect(() => {
    gridApiRef.current?.purgeInfiniteCache();
  }, [search]);

  return (
    <div className="tile-grid-wrapper">
      <AgGridReact
        theme={gridTheme}
        columnDefs={colDefs}
        defaultColDef={{ sortable: true, resizable: true, unSortIcon: true, filter: true }}
        rowModelType="infinite"
        datasource={datasource}
        cacheBlockSize={BLOCK_SIZE} //Specifies how many rows the grid requests per fetch
        context={contextRef.current}
        onGridReady={onGridReady}
        suppressDragLeaveHidesColumns
        suppressCellFocus
        animateRows={false}
        pagination={true}
      />
    </div>
  );
});

export default TileGrid;
