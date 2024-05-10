import express, { Request, Response, Router } from 'express';

import { pool } from '../../core/db/sql_conn';

const bookRouter: Router = express.Router();

// Get book by ISBN
bookRouter.get('/ISBN/:isbn', async (request: Request, response: Response) => {
    const theQuery = `
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
    const values = [request.params.isbn];

    try {
        const result = await pool.query(theQuery, values);
        if (result.rowCount === 1) {
            response.send({
                entry: result.rows[0],
            });
        } else {
            console.log('Book not found for ISBN:', request.params.isbn);
            response.status(404).send({
                message: 'Book not found',
            });
        }
    } catch (error) {
        console.error('Error executing database query:', error);
        response.status(500).send({
            message: 'Error fetching book',
        });
    }
});

// Get books by page
bookRouter.get('/', async (request: Request, response: Response) => {
    const theQuery = `
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
    WHERE b.id > ($2 * ($1 - 1))
    ORDER BY b.id
    LIMIT $2;`;
    const values = [request.query.page, request.query.size];
    try {
        const result = await pool.query(theQuery, values);
        if (result.rowCount === 0) {
            console.log('Invalid Page:', request.query.page);
            response.status(404).send({
                message: 'The given page is not used in the database!',
            });
        } else {
            response.send({
                entry: result.rows,
            });
        }
    } catch (error) {
        console.error('Error executing database query:', error);
        response.status(500).send({
            message: 'Error fetching book',
        });
    }
});
// Get book by publishing year
bookRouter.get(
    '/year/:pubYear',
    async (request: Request, response: Response) => {
        const theQuery = `
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
  WHERE b.publication_year = $1`;
        const values = [request.params.pubYear];

        try {
            const result = await pool.query(theQuery, values);
            if (result.rowCount === 0) {
                console.log(
                    'Book not found with given publishing year:',
                    request.params.pubYear
                );
                response.status(404).send({
                    message:
                        'No books with this publishing year in the database!',
                });
            } else {
                response.send({
                    entry: result.rows,
                });
            }
        } catch (error) {
            console.error('Error executing database query:', error);
            response.status(500).send({
                message: 'Error fetching book',
            });
        }
    }
);

export { bookRouter };
