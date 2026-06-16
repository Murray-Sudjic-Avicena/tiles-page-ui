import { useState, useEffect } from 'react';
import Header from '../components/Header';
import TileToolbar from '../components/TileToolbar';
import SearchBox from '../components/SearchBox';
import TileGrid from '../components/TileGrid';
import { fetchTiles } from '../api/tilesApi';
import type { Tile, SortField, SortDirection } from '../types/Tile';
import '../tiles.css';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function TilePage() {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortField, setSortField] = useState<SortField | undefined>();
  const [sortDir, setSortDir] = useState<SortDirection | undefined>();
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  //Wait until the user pauses typing for 300ms, then update the search and reset to page 1. Prevents refresh after each keystroke. React will call this when necessary
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch whenever query params change - note watches search not searchInput
  useEffect(() => {
    let cancelled = false;
    setLoading(true); //tells UI "fetch in progress"

    fetchTiles({ page, pageSize, sortField, sortDir, search }) //fetchTiles returns a Promise, so must have .then
      .then((res) => { //updates tiles and total count
        if (!cancelled) {
          setTiles(res.tiles);
          setTotal(res.total);
        }
      })
      .catch((err) => { //if anything went wrong this runs instead of .then
        if (!cancelled) console.error(err);
      })
      .finally(() => { //runs regardless, turns off the loading state.
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; }; // if any of the dependancy values (below) change while fetchTiles is returning, then React will run the cleanup, thus not updating the table.
  }, [page, pageSize, sortField, sortDir, search]); //tells react when to rerun - i.e., if any of these change re-run

  const handleSortChange = (field?: SortField, dir?: SortDirection) => { //? means field can be omitted or undefined
    setSortField(field); // these run regardless
    setSortDir(dir);
    setPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="tile-page-shell">
      <Header />
      <div className="tile-page-content">
        <TileToolbar />
        <SearchBox value={searchInput} onChange={setSearchInput} />
        <TileGrid tiles={tiles} loading={loading} onSortChange={handleSortChange} />
        <div className="pagination-bar">
          <button
            className="pagination-btn"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Prev
          </button>
          <span className="pagination-info">
            Page {page} of {totalPages}
            <span className="pagination-total"> ({total} total)</span>
          </span>
          <button
            className="pagination-btn"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
          <select
            className="pagination-size"
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>{n} / page</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
