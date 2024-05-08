import { pool } from '../db/sql_conn';

// retrievals

export async function getBookByISBN(ISBN: bigint) {
  const query = `
  SELECT 
  b.id,
  b.isbn13,
  b.authors,
  b.publication_year,
  b.original_title,
  b.title,
  b.image_url,
  b.image_small_url
  FROM books b
  WHERE b.isbn13 = $1`;

  const result = await pool.query(query, [ISBN]);
  const rows = result.rows;
  return rows || null;
}