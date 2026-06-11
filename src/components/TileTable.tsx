import type { Tile, SortConfig, SortField } from '../types/Tile';
import TileCategoryRow from './TileCategoryRow';
import TileRow from './TileRow';

interface Props {
  tiles: Tile[];
  sortConfig: SortConfig | null;
  onSort: (field: SortField) => void;
}

export default function TileTable({ tiles, sortConfig, onSort }: Props) {
  function handleEdit(tile: Tile) {
    alert(`Edit tile: ${tile.tileId}`);
  }

  function handleDelete(tile: Tile) {
    alert(`Delete tile: ${tile.tileId}`);
  }

  return (
    <table className="tile-table">
      <thead>
        <TileCategoryRow sortConfig={sortConfig} onSort={onSort} /> {/* props sent to child components*/}
      </thead>
      <tbody>
        {tiles.length === 0 ? (
          <tr>
            <td className="tile-cell" colSpan={7} style={{ textAlign: 'center', color: '#888', padding: '24px' }}>
              No tiles match your search.
            </td>
          </tr>
        ) : (
          tiles.map(tile => (
            <TileRow
              key={tile.id}
              tile={tile}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </tbody>
    </table>
  );
}
