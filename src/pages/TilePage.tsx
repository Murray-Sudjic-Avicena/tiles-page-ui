import { useState, useEffect } from 'react';
import Header from '../components/Header';
import TileToolbar from '../components/TileToolbar';
import SearchBox from '../components/SearchBox';
import TileGrid from '../components/TileGrid';
import '../tiles.css';

export default function TilePage() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  // Debounce: wait until the user pauses typing for 300ms before committing the
  // search term. The grid refetches its blocks whenever `search` changes.
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div className="tile-page-shell">
      <Header />
      <div className="tile-page-content">
        <TileToolbar />
        <SearchBox value={searchInput} onChange={setSearchInput} />
        <TileGrid search={search} />
      </div>
    </div>
  );
}
