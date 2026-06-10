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
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // 1. Filter by search term
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

  // 2. Sort the filtered results
  const sortedTiles = useMemo(() => {
    if (!sortConfig) return filteredTiles;
    return [...filteredTiles].sort((a, b) => {
      const aVal = String(a[sortConfig.field]);
      const bVal = String(b[sortConfig.field]);
      const cmp = aVal.localeCompare(bVal, undefined, { numeric: true });
      return sortConfig.direction === 'asc' ? cmp : -cmp;
    });
  }, [filteredTiles, sortConfig]);

  // 3. Paginate
  const totalPages = Math.max(1, Math.ceil(sortedTiles.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedTiles = sortedTiles.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

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

  return (
    <div>
      <Header />
      <div className="tile-page-content">
        <TileToolbar />
        <SearchBox value={searchTerm} onChange={handleSearch} />
        <TileTable
          tiles={paginatedTiles}
          sortConfig={sortConfig}
          onSort={handleSort}
        />
        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
    </div>
  );
}
