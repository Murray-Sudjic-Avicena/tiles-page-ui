import { useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, ICellRendererParams, SortChangedEvent } from 'ag-grid-community';
import type { Tile, SortField, SortDirection } from '../types/Tile';
import { gridTheme } from '../theme/gridTheme';

function TileIdRenderer({ value }: ICellRendererParams<Tile>) {
  return <span className="tile-id">{value}</span>;
}

function ActionCellRenderer({ data }: ICellRendererParams<Tile>) {
  if (!data) return null;
  return (
    <span style={{ display: 'flex', gap: 4, alignItems: 'center', height: '100%' }}>
      <button
        className="action-btn"
        onClick={() => alert(`Edit tile: ${data.tileId}`)}
        title="Edit"
      >
        <svg style={{ width: 14, height: 14, stroke: 'currentColor', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', verticalAlign: 'middle' }} viewBox="0 0 24 24" aria-hidden>
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </button>
      <button
        className="action-btn"
        onClick={() => alert(`Delete tile: ${data.tileId}`)}
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
  tiles: Tile[];
  loading: boolean;
  onSortChange: (field?: SortField, dir?: SortDirection) => void;
}

export default function TileGrid({ tiles, loading, onSortChange }: Props) {
  const colDefs = useMemo<ColDef<Tile>[]>(() => [
    { field: 'type',   headerName: 'Type',    flex: 2 },
    { field: 'wafer',  headerName: 'Wafer',   flex: 1 },
    { field: 'row',    headerName: 'Row',     flex: 1, type: 'numericColumn' },
    { field: 'column', headerName: 'Column',  flex: 1, type: 'numericColumn' },
    { field: 'tileId', headerName: 'Tile ID', flex: 1.5, cellRenderer: TileIdRenderer },
    { field: 'grade',  headerName: 'Grade',   flex: 1 },
    {
      headerName: 'Actions',
      flex: 1.5,
      sortable: false,
      filter: false,
      cellRenderer: ActionCellRenderer,
    },
  ], []);

  const handleSortChanged = useCallback((event: SortChangedEvent<Tile>) => {
    const sorted = event.api.getColumnState().find((c) => c.sort != null);
    onSortChange(
      sorted?.colId as SortField | undefined,
      sorted?.sort as SortDirection | undefined,
    );
  }, [onSortChange]);

  return (
    <div className="tile-grid-wrapper" style={{ position: 'relative' }}>
      {loading && <div className="grid-loading-overlay" />}
      <AgGridReact
        theme={gridTheme}
        rowData={tiles}
        columnDefs={colDefs}
        defaultColDef={{ sortable: true, resizable: true, unSortIcon: true }}
        onSortChanged={handleSortChanged}
        suppressDragLeaveHidesColumns
        suppressCellFocus
        domLayout="autoHeight"
        animateRows={false}
      />
    </div>
  );
}
