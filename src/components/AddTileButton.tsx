interface Props {
  onClick: () => void;
}

export default function AddTileButton({ onClick }: Props) {
  return (
    <button
      className="toolbar-btn toolbar-btn--add"
      onClick={onClick}
    >
      Add New
    </button>
  );
}
