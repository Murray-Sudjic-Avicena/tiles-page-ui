import { useState, useMemo } from 'react';
import Header from '../components/Header';
import TileToolbar from '../components/TileToolbar';
import SearchBox from '../components/SearchBox';
import TileTable from '../components/TileTable';
import Pagination from '../components/Pagination';
import { mockTiles } from '../data/mockTiles';
import type { SortConfig, SortField } from '../types/Tile';
import '../tiles.css';

export default function TilePage() {
  /* The state, what TilePage remembers. 
     Child components may call the setter functions, 
     thus updating the state and rerendering the page.
     Parameter is the starting value */
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // Everything below is derived from state (above) + mockTiles data

  // Array of filtered tiles. Filters by search term, useMemo caches 
  // the result, so no redundant calculations
  const filteredTiles = useMemo(() => {
    if (!searchTerm.trim()) return mockTiles;
    const lower = searchTerm.toLowerCase();
    return mockTiles.filter(tile =>
      tile.type.toLowerCase().includes(lower) ||
      tile.wafer.toLowerCase().includes(lower) ||
      tile.tileId.toLowerCase().includes(lower) ||
      tile.grade.toLowerCase().includes(lower)
    );
  }, [searchTerm]);

  // Sorts the filtered results
  const sortedTiles = useMemo(() => {
    if (!sortConfig) return filteredTiles;
    return [...filteredTiles].sort((a, b) => { //'...' creates a shallow copy. sort takes two arbitrary a and b, aVal and bVal come from values of columns we are comparing. Then sort rearranges 
      const aVal = String(a[sortConfig.field]);
      const bVal = String(b[sortConfig.field]);
      const cmp = aVal.localeCompare(bVal, undefined, { numeric: true });
      return (sortConfig.direction === 'asc') ? cmp : -cmp; 
    });
  }, [filteredTiles, sortConfig]);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sortedTiles.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages); //e.g., if you are on page 5, and the filter reduces the results to 2 pages, you should drop to page 2
  const paginatedTiles = sortedTiles.slice( //finds tiles to display on the current page
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  // Event handlers - update state in response to user actions, all of which handed to child components as props
  function handleSort(field: SortField) {
    setSortConfig(prev =>
      prev?.field === field
        ? { field, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { field, direction: 'asc' }
    );
    setCurrentPage(1);
  }

  function handleSearch(term: string) {
    setSearchTerm(term);
    setCurrentPage(1);
  }

  function handleItemsPerPageChange(n: number) {
    setItemsPerPage(n);
    setCurrentPage(1);
  }

  return ( //Description of what the UI should look like
    <div>
      <Header />
      <div className="tile-page-content">
        <TileToolbar />
        <SearchBox value={searchTerm} onChange={handleSearch} />
        <TileTable
          tiles={paginatedTiles} //props handed to child components
          sortConfig={sortConfig}
          onSort={handleSort}
        />
        <Pagination
          currentPage={safePage} //props handed to child components
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
    </div>
  );
}
