import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import TileToolbar from '../components/TileToolbar';
import SearchBox from '../components/SearchBox';
import TileGrid, { type TileGridHandle } from '../components/TileGrid';
import TileFormModal from '../components/TileFormModal';
import BulkAddTileModal from '../components/BulkAddTileModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { deleteTile } from '../api/tiles-api';
import type { Tile } from '../types/tile';
import '../tiles.css';

export default function TilePage() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  // Modal / dialog state. `formTile` distinguishes add (undefined) vs edit.
  const [formOpen, setFormOpen] = useState(false);
  const [formTile, setFormTile] = useState<Tile | undefined>(undefined);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [tileToDelete, setTileToDelete] = useState<Tile | null>(null);
  const [deleting, setDeleting] = useState(false);

  const gridRef = useRef<TileGridHandle>(null);

  // Debounce: wait until the user pauses typing for 300ms before committing the
  // search term. The grid refetches its blocks whenever `search` changes.
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const openAdd = () => { setFormTile(undefined); setFormOpen(true); };
  const openEdit = (tile: Tile) => { setFormTile(tile); setFormOpen(true); };

  const handleSaved = () => {
    setFormOpen(false);
    gridRef.current?.refresh();
  };

  const handleBulkSaved = () => {
    setBulkOpen(false);
    gridRef.current?.refresh();
  };

  const handleConfirmDelete = async () => {
    if (!tileToDelete) return;
    setDeleting(true);
    try {
      await deleteTile(tileToDelete.id);
      setTileToDelete(null);
      gridRef.current?.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="tile-page-shell">
      <Header />
      <div className="tile-page-content">
        <TileToolbar onAddTile={openAdd} onBulkAdd={() => setBulkOpen(true)} />
        <SearchBox value={searchInput} onChange={setSearchInput} />
        <TileGrid
          ref={gridRef}
          search={search}
          onEditTile={openEdit}
          onDeleteTile={setTileToDelete}
        />
      </div>

      {formOpen && (
        <TileFormModal
          tile={formTile}
          onClose={() => setFormOpen(false)}
          onSaved={handleSaved}
        />
      )}

      {bulkOpen && (
        <BulkAddTileModal
          onClose={() => setBulkOpen(false)}
          onSaved={handleBulkSaved}
        />
      )}

      {tileToDelete && (
        <ConfirmDialog
          title="Delete Tile"
          message={`Delete tile "${tileToDelete.tileId}"? This cannot be undone.`}
          busy={deleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setTileToDelete(null)}
        />
      )}
    </div>
  );
}
