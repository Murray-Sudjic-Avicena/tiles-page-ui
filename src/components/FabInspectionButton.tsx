// Dummy button

export default function FabInspectionButton() {
  return (
    <button
      className="toolbar-btn toolbar-btn--fab"
      onClick={() => alert('Fab Inspection View Button clicked')}
    >
      Fab Inspection View
    </button>
  );
}
