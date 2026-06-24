import { useState, useEffect } from 'react';
import { bulkCreateTiles } from '../api/tiles-api';
import {
  COLUMNS,
  COLUMN_LABELS,
  emptyRow,
  validateRow,
  isRowValid,
  rowToInput,
  type Field,
  type CellRow,
} from '../validation/tileValidation';

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

export default function BulkAddTileModal({ onClose, onSaved }: Props) {
  // Start with a single empty row; users typically paste many rows at once.
  const [rows, setRows] = useState<CellRow[]>(() => [emptyRow()]);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Close on Escape (mirrors TileFormModal).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const setCell = (rowIndex: number, field: Field, value: string) =>
    setRows((prev) => prev.map((r, i) => (i === rowIndex ? { ...r, [field]: value } : r)));

  const addRow = () => setRows((prev) => [...prev, emptyRow()]);
  const deleteRow = (rowIndex: number) =>
    setRows((prev) => (prev.length === 1 ? [emptyRow()] : prev.filter((_, i) => i !== rowIndex)));
  const clearAll = () => { setRows([emptyRow()]); setAttemptedSubmit(false); setError(null); };

  // Multi-row paste from Excel/TSV. Only intercept when the clipboard text spans
  // multiple cells (contains a tab or newline) — otherwise let the browser paste
  // the single value into the focused input normally.
  const handlePaste = (rowIndex: number, e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text');
    if (!text.includes('\t') && !text.includes('\n')) return; // single cell: native paste

    e.preventDefault();
    const parsed = text
      .split(/\r?\n/)
      .filter((line) => line.trim() !== '')
      .map((line) => line.split('\t'));

    if (parsed.length === 0) return;

    const pastedRows: CellRow[] = parsed.map((cells) => {
      const row = emptyRow();
      COLUMNS.forEach((field, col) => {
        if (cells[col] !== undefined) row[field] = cells[col];
      });
      return row;
    });

    // Overwrite starting at the row that received the paste, growing as needed.
    setRows((prev) => {
      const next = [...prev];
      pastedRows.forEach((r, i) => { next[rowIndex + i] = r; });
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const invalidCount = rows.filter((row) => !isRowValid(row)).length;

    if (invalidCount > 0) {
      setAttemptedSubmit(true);
      setError(`${invalidCount} row${invalidCount === 1 ? '' : 's'} have errors — fix the highlighted cells.`);
      return;
    }

    const inputs = rows.map(rowToInput);

    setSaving(true);
    try {
      await bulkCreateTiles(inputs);
      onSaved();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setSaving(false);
    }
  };

  // Per-cell error highlighting only kicks in after the first submit attempt.
  const rowErrors = attemptedSubmit ? rows.map(validateRow) : null;

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal modal--wide" onMouseDown={(e) => e.stopPropagation()}>
        <h3 className="modal-title">Bulk Add Tiles</h3>
        <p className="modal-hint">
          Paste rows from Excel (Type, Wafer, Row, Column, Tile ID, Grade) or edit cells directly.
        </p>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="bulk-grid-wrapper">
            <table className="bulk-grid">
              <thead>
                <tr>
                  {COLUMNS.map((field) => <th key={field}>{COLUMN_LABELS[field]}</th>)}
                  <th aria-label="Row actions" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {COLUMNS.map((field) => {
                      const hasError = rowErrors?.[rowIndex]?.[field];
                      const cellClass = hasError ? 'bulk-cell bulk-cell--error' : 'bulk-cell';
                      return (
                        <td key={field} className={cellClass}>
                          <input
                            value={row[field]}
                            onChange={(ev) => setCell(rowIndex, field, ev.target.value)}
                            onPaste={(ev) => handlePaste(rowIndex, ev)}
                          />
                        </td>
                      );
                    })}
                    <td className="bulk-cell bulk-cell--action">
                      <button
                        type="button"
                        className="action-btn"
                        title="Remove row"
                        onClick={() => deleteRow(rowIndex)}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bulk-grid-controls">
            <button type="button" className="btn btn-secondary" onClick={addRow}>Add Row</button>
            <button type="button" className="btn btn-secondary" onClick={clearAll}>Clear All</button>
            <span className="bulk-grid-count">{rows.length} row{rows.length === 1 ? '' : 's'}</span>
          </div>

          {error && <p className="modal-error">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Add Tiles'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
