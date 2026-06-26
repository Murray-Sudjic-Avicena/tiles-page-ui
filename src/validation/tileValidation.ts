// Validation and field definitions for the bulk tile-entry grid.
// Kept separate from the modal so the data rules live in one place and can be
// unit-tested or reused independently of the UI.

import type { Grade } from '../types/tile';
import type { TileInput } from '../api/tiles-api';

// Columns in the order Excel will paste them. The order matches the legacy
// paste grid so a straight copy from the spreadsheet maps positionally.
export const COLUMNS = ['type', 'wafer', 'row', 'column', 'tileId', 'grade'] as const;
export type Field = (typeof COLUMNS)[number];

export const COLUMN_LABELS: Record<Field, string> = {
  type: 'Type',
  wafer: 'Wafer',
  row: 'Row',
  column: 'Column',
  tileId: 'Tile ID',
  grade: 'Grade',
};

// A CellRow object will have one of the COLUMNS as a key, and the value is the string in that cell. 
// All values are strings because they come from user input. (The row/column values will be coerced to numbers later.)
export type CellRow = Record<Field, string>;

// function that returns an empty row object with all fields empty.
export const emptyRow = (): CellRow => ({ type: '', wafer: '', row: '', column: '', tileId: '', grade: '' });

// Which fields of a given row are invalid. Empty set means the row is valid.
export type RowErrors = Partial<Record<Field, true>>;

// Resolve a pasted grade to one of the allowed Grade values, tolerating case
// and the common 'na'/'n/a' spellings. Returns null if it isn't a valid grade.
export function normalizeGrade(raw: string): Grade | null {
  const value = raw.trim().toUpperCase();
  if (value === 'A' || value === 'B' || value === 'C') return value as Grade;
  if (value === 'N/A' || value === 'NA') return 'n/a';
  return null;
}

// Same rules as TileFormModal applied per cell:
//  type/wafer/tileId: required, non-empty after trim
//  row/column: must be integers
//  grade: must resolve to one of the allowed grades
export function validateRow(row: CellRow): RowErrors {
  const errors: RowErrors = {};
  if (!row.type.trim()) errors.type = true;
  if (!row.wafer.trim()) errors.wafer = true;
  if (!row.tileId.trim()) errors.tileId = true;
  if (!Number.isInteger(Number(row.row)) || row.row.trim() === '') errors.row = true;
  if (!Number.isInteger(Number(row.column)) || row.column.trim() === '') errors.column = true;
  if (normalizeGrade(row.grade) === null) errors.grade = true;
  return errors;
}

// True when a row has no validation errors.
export function isRowValid(row: CellRow): boolean {
  return Object.keys(validateRow(row)).length === 0;
}

// A single human-readable summary of a row's errors, suitable for a form-level
// message (used by the single-add modal). Returns null when the row is valid.
export function describeRowErrors(row: CellRow): string | null {
  const errors = validateRow(row);
  const missing = (['type', 'wafer', 'tileId'] as const).filter((f) => errors[f]);
  if (missing.length > 0) return 'Type, Wafer and Tile ID are required.';
  if (errors.row || errors.column) return 'Row and Column must be whole numbers.';
  if (errors.grade) return 'Grade must be one of A, B, C or n/a.';
  return null;
}

// Coerce a validated row into the API payload shape. Assumes the row has
// already passed validateRow; grade falls back to 'n/a' defensively.
export function rowToInput(row: CellRow): TileInput {
  return {
    type: row.type.trim(),
    wafer: row.wafer.trim(),
    row: Number(row.row),
    column: Number(row.column),
    tileId: row.tileId.trim(),
    grade: normalizeGrade(row.grade) ?? 'n/a',
  };
}
