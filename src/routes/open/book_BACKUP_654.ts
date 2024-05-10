import express, { Request, Response, Router } from 'express';

import { pool } from '../../core/db/sql_conn';

const bookRouter: Router = express.Router();

// Get book by ISBN
bookRouter.get('/ISBN/:isbn', async (request: Request, response: Response) => {
<<<<<<< HEAD
    const theQuery = `
=======
  const theQuery = `
>>>>>>> main
  SELECT 
  b.id,
  b.isbn13,
  b.authors,
  b.publication_year,
  b.original_title,
  b.title,
  b.image_url,
<<<<<<< HEAD
  b.image_small_url
  FROM books b
  WHERE b.isbn13 = $1`;
    const values = [request.params.isbn];
=======
  b.image_small_url,
  COUNT(r.rating) as rating_count, 
  AVG(r.rating) as average_rating,
  SUM(CASE WHEN r.rating = 1 THEN 1 ELSE 0 END) as rating_1_star,
  SUM(CASE WHEN r.rating = 2 THEN 1 ELSE 0 END) as rating_2_star,
  SUM(CASE WHEN r.rating = 3 THEN 1 ELSE 0 END) as rating_3_star,
  SUM(CASE WHEN r.rating = 4 THEN 1 ELSE 0 END) as rating_4_star,
  SUM(CASE WHEN r.rating = 5 THEN 1 ELSE 0 END) as rating_5_star
FROM books b
LEFT JOIN ratings r ON b.id = r.book_id
WHERE b.isbn13 = $1
GROUP BY b.id, b.isbn13, b.authors, b.publication_year, b.original_title, b.title, b.image_url, b.image_small_url;
;
`;
  const values = [request.params.isbn];
>>>>>>> main

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
<<<<<<< HEAD
=======
  } catch (error) {
    console.error('Error executing database query:', error);
    response.status(500).send({
      message: 'Error fetching book' + error,
    });
  }
>>>>>>> main
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