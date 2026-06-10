interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBox({ value, onChange }: Props) {
  return (
    <div className="search-box">
      <label htmlFor="tile-search">Search:</label>
      <input
        id="tile-search"
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Filter tiles…"
      />
    </div>
  );
}
