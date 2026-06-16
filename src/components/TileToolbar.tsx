import FabInspectionButton from './FabInspectionButton';
import AddDigitMappingButton from './AddDigitMappingButton';
import AddTileButton from './AddTileButton';

export default function TileToolbar() {
  return (
    <div className="tile-toolbar">
      <h2 className="tile-toolbar-title">Tiles Summary</h2>
      <div className="tile-toolbar-actions">
        <FabInspectionButton />
        <AddDigitMappingButton />
        <AddTileButton />
      </div>
    </div>
  );
}
