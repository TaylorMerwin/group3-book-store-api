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

// Update title based on current title
bookRouter.put('/book/updateTitle', async (request: Request, response: Response) => {
    const currentTitle = request.body.currentTitle;
    const newTitle = request.body.newTitle;
    const theQuery = 'UPDATE BOOKS SET title = $1 WHERE title = $2 RETURNING *';

    try {
        const result = await pool.query(theQuery, [newTitle, currentTitle]);
        if (result.rowCount > 0) {
            response.send({ message: "Title updated successfully." });
        } else {
            response.status(404).send({ message: "Original title not found." });
        }
    } catch (error) {
        console.error('Error updating title:', error);
        response.status(500).send({ message: 'Internal server error' });
    }
});

// Update ISBN based on current ISBN
bookRouter.put('/book/updateIsbn', async (request: Request, response: Response) => {
    const currentIsbn = request.body.currentIsbn;
    const newIsbn = request.body.newIsbn;
    const theQuery = 'UPDATE BOOKS SET isbn13 = $1 WHERE isbn13 = $2 RETURNING *';

    try {
        const result = await pool.query(theQuery, [newIsbn, currentIsbn]);
        if (result.rowCount > 0) {
            response.send({ message: "ISBN updated successfully." });
        } else {
            response.status(404).send({ message: "Original ISBN not found." });
        }
    } catch (error) {
        console.error('Error updating ISBN:', error);
        response.status(500).send({ message: 'Internal server error' });
    }
});

// Update author based on ID
bookRouter.put('/book/updateAuthor/:id', async (request: Request, response: Response) => {
    const id = request.params.id;
    const newAuthor = request.body.author;
    const theQuery = 'UPDATE BOOKS SET authors = $1 WHERE id = $2 RETURNING *';

    try {
        const result = await pool.query(theQuery, [newAuthor, id]);
        if (result.rowCount > 0) {
            response.send({ message: "Author updated successfully." });
        } else {
            response.status(404).send({ message: "Book ID not found." });
        }
    } catch (error) {
        console.error('Error updating author:', error);
        response.status(500).send({ message: 'Internal server error' });
    }
});

// Update publication date based on ID
bookRouter.put('/book/updateDate/:id', async (request: Request, response: Response) => {
    const id = request.params.id;
    const newDate = request.body.date;
    const theQuery = 'UPDATE BOOKS SET publication_year = $1 WHERE id = $2 RETURNING *';

    try {
        const result = await pool.query(theQuery, [newDate, id]);
        if (result.rowCount > 0) {
            response.send({ message: "Publication date updated successfully." });
        } else {
            response.status(404).send({ message: "Book ID not found." });
        }
    } catch (error) {
        console.error('Error updating publication date:', error);
        response.status(500).send({ message: 'Internal server error' });
    }
});

// Update rating based on ID
bookRouter.put('/book/updateRating/:id', async (request: Request, response: Response) => {
    const id = request.params.id;
    const newRating = request.body.rating;
    const theQuery = 'UPDATE BOOKS SET rating = $1 WHERE id = $2 RETURNING *';

    try {
        const result = await pool.query(theQuery, [newRating, id]);
        if (result.rowCount > 0) {
            response.send({ message: "Rating updated successfully." });
        } else {
            response.status(404).send({ message: "Book ID not found." });
        }
    } catch (error) {
        console.error('Error updating rating:', error);
        response.status(500).send({ message: 'Internal server error' });
    }
});

// Update image based on ID
bookRouter.put('/book/updateImage/:id', async (request: Request, response: Response) => {
    const id = request.params.id;
    const newImageUrl = request.body.imageUrl;
    const theQuery = 'UPDATE BOOKS SET image_url = $1 WHERE id = $2 RETURNING *';

    try {
        const result = await pool.query(theQuery, [newImageUrl, id]);
        if (result.rowCount > 0) {
            response.send({ message: "Image updated successfully." });
        } else {
            response.status(404).send({ message: "Book ID not found." });
        }
    } catch (error) {
        console.error('Error updating image:', error);
        response.status(500).send({ message: 'Internal server error' });
    }
});

export { bookRouter };
