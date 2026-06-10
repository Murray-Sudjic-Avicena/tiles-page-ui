import type { SortConfig, SortField } from '../types/Tile';

interface Props {
  sortConfig: SortConfig | null;
  onSort: (field: SortField) => void;
}

const columns: { label: string; field: SortField }[] = [
  { label: 'Type',    field: 'type'   },
  { label: 'Wafer',  field: 'wafer'  },
  { label: 'Row',    field: 'row'    },
  { label: 'Column', field: 'column' },
  { label: 'Tile ID',field: 'tileId' },
  { label: 'Grade',  field: 'grade'  },
];

export default function TileCategoryRow({ sortConfig, onSort }: Props) {
  function arrow(field: SortField) {
    if (sortConfig?.field !== field) {
      return <span className="sort-arrow">⇅</span>;
    }
    return (
      <span className="sort-arrow sort-arrow--active">
        {sortConfig.direction === 'asc' ? '↑' : '↓'}
      </span>
    );
  }

  return (
    <tr className="tile-table-header-row">
      {columns.map(col => (
        <th
          key={col.field}
          className="tile-table-header-cell"
          onClick={() => onSort(col.field)}
        >
          {col.label}
          {arrow(col.field)}
        </th>
      ))}
      <th className="tile-table-header-cell">Action</th>
    </tr>
  );
}
