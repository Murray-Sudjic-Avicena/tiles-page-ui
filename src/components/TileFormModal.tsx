import { useState, useEffect } from 'react';
import type { Tile, Grade } from '../types/tile';
import { createTile, updateTile, type TileInput } from '../api/tiles-api';
import { emptyRow, describeRowErrors, rowToInput, type CellRow } from '../validation/tileValidation';

// Grades offered by the dropdown. UI concern (the select's options), so it
// stays local; the validation rules themselves live in tileValidation.
const GRADES: Grade[] = ['A', 'B', 'C', 'n/a'];

// The single-add form uses the same all-strings row shape as the bulk grid.
function toFormState(tile: Tile): CellRow {
  return {
    type: tile.type,
    wafer: tile.wafer,
    row: String(tile.row),
    column: String(tile.column),
    tileId: tile.tileId,
    grade: tile.grade,
  };
}

interface Props {
  // When `tile` is provided we're editing it; otherwise we're adding a new one.
  tile?: Tile;
  onClose: () => void;
  onSaved: () => void;
}

export default function TileFormModal({ tile, onClose, onSaved }: Props) {
  const isEdit = tile != null;
  // New tiles default Grade to 'A' so the dropdown has a valid initial value
  // (the shared emptyRow leaves grade blank, which the bulk grid fills by paste).
  const [form, setForm] = useState<CellRow>(tile ? toFormState(tile) : { ...emptyRow(), grade: 'A' });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const set = <K extends keyof CellRow>(key: K, value: CellRow[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const message = describeRowErrors(form);
    if (message) {
      setError(message);
      return;
    }

    const input: TileInput = rowToInput(form);

    setSaving(true);
    try {
      if (isEdit) await updateTile(tile.id, input);
      else await createTile(input);
      onSaved();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{isEdit ? 'Edit Tile' : 'Add New Tile'}</h3>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Type</span>
            <input value={form.type} onChange={(e) => set('type', e.target.value)} autoFocus />
          </label>
          <label className="form-field">
            <span>Wafer</span>
            <input value={form.wafer} onChange={(e) => set('wafer', e.target.value)} />
          </label>
          <div className="form-row">
            <label className="form-field">
              <span>Row</span>
              <input type="number" value={form.row} onChange={(e) => set('row', e.target.value)} />
            </label>
            <label className="form-field">
              <span>Column</span>
              <input type="number" value={form.column} onChange={(e) => set('column', e.target.value)} />
            </label>
          </div>
          <label className="form-field">
            <span>Tile ID</span>
            <input value={form.tileId} onChange={(e) => set('tileId', e.target.value)} />
          </label>
          <label className="form-field">
            <span>Grade</span>
            <select value={form.grade} onChange={(e) => set('grade', e.target.value)}>
              {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </label>

          {error && <p className="modal-error">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Tile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
