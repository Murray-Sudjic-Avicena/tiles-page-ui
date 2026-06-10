import FabInspectionButton from './FabInspectionButton';
import AddDigitMappingButton from './AddDigitMappingButton';
import AddTileButton from './AddTileButton';

export default function TileToolbar() {
  return (
    <div className="tile-toolbar">
      <FabInspectionButton />
      <AddDigitMappingButton />
      <AddTileButton />
    </div>
  );
}
