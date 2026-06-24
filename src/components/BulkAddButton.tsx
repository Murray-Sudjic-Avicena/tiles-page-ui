interface Props {
  onClick: () => void;
}

export default function BulkAddButton({ onClick }: Props) {
  return (
    <button
      className="toolbar-btn toolbar-btn--add"
      onClick={onClick}
    >
      Bulk Add
    </button>
  );
}
