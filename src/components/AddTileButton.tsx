// Dummy button

export default function AddTileButton() {
  return (
    <button
      className="toolbar-btn toolbar-btn--add"
      onClick={() => alert('Add New Tile clicked')}
    >
      Add New
    </button>
  );
}
