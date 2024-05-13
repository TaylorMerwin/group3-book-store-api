import express, {Request, Response, Router } from "express";

import {pool} from '../../core/db/sql_conn';

const bookRouter: Router = express.Router();

// Get book by ISBN
bookRouter.get('ISBN/:isbn', async (request: Request, response: Response) => {
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

//This is just to look up for authors to do testing
bookRouter.get('/Allauthors', (request: Request, response: Response) => {
  const theQuery = 'SELECT authors FROM BOOKS';

  pool.query(theQuery)
      .then((result) => {
          response.send({
              entries: result.rows
          });
      })
      .catch((error) => {
          //log the error
          console.error('DB Query error on GET all');
          console.error(error);
          response.status(500).send({
              message: 'server error - contact support',
          });
      });
});

/**
 * @api {put} /book/title/:isbn Update Book Title
 * @apiName UpdateBookTitle
 * @apiGroup Book
 *
 * @apiParam {Number} isbn Book's unique ISBN.
 * @apiParam {String} title New title of the Book.
 *
 * @apiSuccess {String} message "Title updated successfully."
 * @apiError (404: ISBN Not Found) {String} message "ISBN not found."
 */

bookRouter.put('/book/title/:isbn', async (req: Request, res: Response) => {
    const { isbn } = req.params;
    const { title } = req.body;

    const updateQuery = `UPDATE books SET title = $1 WHERE isbn13 = $2 RETURNING *;`;
    try {
        const result = await pool.query(updateQuery, [title, isbn]);
        if (result.rowCount > 0) {
            res.json({ message: "Title updated successfully." });
        } else {
            res.status(404).json({ message: "ISBN not found." });
        }
    } catch (error) {
        console.error('Error updating title:', error);
        res.status(500).send({ message: 'Error updating book title' });
    }
});

/**
 * @api {put} /book/isbn/:id Update Book ISBN
 * @apiName UpdateBookISBN
 * @apiGroup Book
 *
 * @apiParam {Number} id Book's unique ID.
 * @apiParam {Number} isbn New ISBN of the Book.
 *
 * @apiSuccess {String} message "ISBN updated successfully."
 * @apiError (404: ID Not Found) {String} message "Book ID not found."
 */

bookRouter.put('/book/isbn/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isbn } = req.body;

    const updateQuery = `UPDATE books SET isbn13 = $1 WHERE id = $2 RETURNING *;`;
    try {
        const result = await pool.query(updateQuery, [isbn, id]);
        if (result.rowCount > 0) {
            res.json({ message: "ISBN updated successfully." });
        } else {
            res.status(404).json({ message: "Book ID not found." });
        }
    } catch (error) {
        console.error('Error updating ISBN:', error);
        res.status(500).send({ message: 'Error updating book ISBN' });
    }
});

/**
 * @api {put} /book/author/:id Update Book Author
 * @apiName UpdateBookAuthor
 * @apiGroup Book
 *
 * @apiParam {Number} id Book's unique ID.
 * @apiParam {String} author New author of the Book.
 *
 * @apiSuccess {String} message "Author updated successfully."
 * @apiError (404: ID Not Found) {String} message "Book ID not found."
 */

bookRouter.put('/book/author/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { author } = req.body;

    const updateQuery = `UPDATE books SET authors = $1 WHERE id = $2 RETURNING *;`;
    try {
        const result = await pool.query(updateQuery, [author, id]);
        if (result.rowCount > 0) {
            res.json({ message: "Author updated successfully." });
        } else {
            res.status(404).json({ message: "Book ID not found." });
        }
    } catch (error) {
        console.error('Error updating author:', error);
        res.status(500).send({ message: 'Error updating book author' });
    }
});

/**
 * @api {put} /book/date/:id Update Book Publication Date
 * @apiName UpdateBookDate
 * @apiGroup Book
 *
 * @apiParam {Number} id Book's unique ID.
 * @apiParam {String} date New publication date of the Book.
 *
 * @apiSuccess {String} message "Publication date updated successfully."
 * @apiError (404: ID Not Found) {String} message "Book ID not found."
 */

bookRouter.put('/book/date/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { date } = req.body;

    const updateQuery = `UPDATE books SET publication_year = $1 WHERE id = $2 RETURNING *;`;
    try {
        const result = await pool.query(updateQuery, [date, id]);
        if (result.rowCount > 0) {
            res.json({ message: "Publication date updated successfully." });
        } else {
            res.status(404).json({ message: "Book ID not found." });
        }
    } catch (error) {
        console.error('Error updating publication date:', error);
        res.status(500).send({ message: 'Error updating book publication date' });
    }
});

/**
 * @api {put} /book/rating/:id Update Book Rating
 * @apiName UpdateBookRating
 * @apiGroup Book
 *
 * @apiParam {Number} id Book's unique ID.
 * @apiParam {Number} rating New rating of the Book (1-5).
 *
 * @apiSuccess {String} message "Rating updated successfully."
 * @apiError (404: ID Not Found) {String} message "Book ID not found."
 */

bookRouter.put('/book/rating/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { rating } = req.body;

    const updateQuery = `UPDATE books SET rating = $1 WHERE id = $2 RETURNING *;`;
    try {
        const result = await pool.query(updateQuery, [rating, id]);
        if (result.rowCount > 0) {
            res.json({ message: "Rating updated successfully." });
        } else {
            res.status(404).json({ message: "Book ID not found." });
        }
    } catch (error) {
        console.error('Error updating rating:', error);
        res.status(500).send({ message: 'Error updating book rating' });
    }
});

/**
 * @api {put} /book/images/:id Update Book Images
 * @apiName UpdateBookImages
 * @apiGroup Book
 *
 * @apiParam {Number} id Book's unique ID.
 * @apiParam {String[]} images Array of new image URLs for the Book.
 *
 * @apiSuccess {String} message "Images updated successfully."
 * @apiError (404: ID Not Found) {String} message "Book ID not found."
 */

bookRouter.put('/book/images/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { images } = req.body; // assuming images is an array of URLs

    const updateQuery = `UPDATE books SET image_urls = $1 WHERE id = $2 RETURNING *;`;
    try {
        const result = await pool.query(updateQuery, [images, id]);
        if (result.rowCount > 0) {
            res.json({ message: "Images updated successfully." });
        } else {
            res.status(404).json({ message: "Book ID not found." });
        }
    } catch (error) {
        console.error('Error updating images:', error);
        res.status(500).send({ message: 'Error updating book images' });
    }
});

export { bookRouter };
