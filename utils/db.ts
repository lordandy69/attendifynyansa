// utils/db.ts
import { supabase } from "./supabaseClient";

/**
 * Insert a new row into a given table
 */
export async function insertRow<T>(table: string, values: T) {
  const { data, error } = await supabase.from(table).insert([values]);

  if (error) return { error: error.message, data: null };
  return { error: null, data };
}

/**
 * Fetch all rows from a given table
 */
export async function getAllRows<T>(table: string) {
  const { data, error } = await supabase.from(table).select("*");

  if (error) return { error: error.message, data: null };
  return { error: null, data };
}

/**
 * Fetch a single row by column match
 */
export async function getRowBy<T>(
  table: string,
  column: string,
  value: string | number
) {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq(column, value)
    .single();

  if (error) return { error: error.message, data: null };
  return { error: null, data };
}

/**
 * Update a row in a table by column match
 */
export async function updateRow<T>(
  table: string,
  column: string,
  value: string | number,
  updates: Partial<T>
) {
  const { data, error } = await supabase
    .from(table)
    .update(updates)
    .eq(column, value)
    .select();

  if (error) return { error: error.message, data: null };
  return { error: null, data };
}

/**
 * Delete a row from a table by column match
 */
export async function deleteRow(
  table: string,
  column: string,
  value: string | number
) {
  const { error } = await supabase.from(table).delete().eq(column, value);

  if (error) return { error: error.message };
  return { error: null };
}
