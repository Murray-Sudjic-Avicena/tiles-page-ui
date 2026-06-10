import type { Tile } from '../types/Tile';

interface Props {
  tile: Tile;
  onEdit: (tile: Tile) => void;
  onDelete: (tile: Tile) => void;
}

const EditIcon = () => (
  <svg className="icon" viewBox="0 0 24 24" aria-label="Edit">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="icon" viewBox="0 0 24 24" aria-label="Delete">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

export default function TileRow({ tile, onEdit, onDelete }: Props) {
  return (
    <tr className="tile-row">
      <td className="tile-cell">{tile.type}</td>
      <td className="tile-cell">{tile.wafer}</td>
      <td className="tile-cell">{tile.row}</td>
      <td className="tile-cell">{tile.column}</td>
      <td className="tile-cell"><span className="tile-id">{tile.tileId}</span></td>
      <td className="tile-cell">{tile.grade}</td>
      <td className="tile-cell">
        <button className="action-btn" onClick={() => onEdit(tile)} title="Edit">
          <EditIcon />
        </button>
        <button className="action-btn" onClick={() => onDelete(tile)} title="Delete">
          <DeleteIcon />
        </button>
      </td>
    </tr>
  );
}
