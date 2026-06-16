import FabInspectionButton from './FabInspectionButton';
import AddDigitMappingButton from './AddDigitMappingButton';
import AddTileButton from './AddTileButton';

interface Props {
  onAddTile: () => void;
}

export default function TileToolbar({ onAddTile }: Props) {
  return (
    <div className="tile-toolbar">
      <h2 className="tile-toolbar-title">Tiles Summary</h2>
      <div className="tile-toolbar-actions">
        <FabInspectionButton />
        <AddDigitMappingButton />
        <AddTileButton onClick={onAddTile} />
      </div>
    </div>
  );
}
