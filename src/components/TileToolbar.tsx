import FabInspectionButton from './FabInspectionButton';
import AddDigitMappingButton from './AddDigitMappingButton';
import AddTileButton from './AddTileButton';
import BulkAddButton from './BulkAddButton';

interface Props {
  onAddTile: () => void;
  onBulkAdd: () => void;
}

export default function TileToolbar({ onAddTile, onBulkAdd }: Props) {
  return (
    <div className="tile-toolbar">
      <h2 className="tile-toolbar-title">Tiles Summary</h2>
      <div className="tile-toolbar-actions">
        <FabInspectionButton />
        <AddDigitMappingButton />
        <BulkAddButton onClick={onBulkAdd} />
        <AddTileButton onClick={onAddTile} />
      </div>
    </div>
  );
}
