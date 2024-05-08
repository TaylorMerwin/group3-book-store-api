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
//entry point is "books"
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


//This is to delete books by authors
/**
 * @api {delete} /books/authors/:authorName Deletes books by author
 * @apiName DeleteBooksByAuthor
 * @apiGroup Book
 *
 * @apiParam {String} The author of the books to delete
 * @apiParam {String} password User's password.
 *
 * @apiSuccess {String} message Success message confirming the deletion of books by author.
 * @apiError (404: Book Not Found) {String} message "Book not found"
 */



bookRouter.delete('/authors/:authorName', (request: Request, response: Response) => {
  const theQuery = 'DELETE FROM BOOKS WHERE authors = $1 RETURNING *';
  const authorName = request.params.authorName;
  const values = [authorName];

  pool.query(theQuery, values)
      .then((result) => {
          if (result.rowCount === 1) {
              response.send({
                  entry: 'Deleted book(s) by author: ' + authorName,
              });
          } else if (result.rowCount > 1) {
              response.send({
                  entry: 'Deleted ' + result.rowCount + ' book(s) by author: ' + authorName,
              });
          } else {
              response.status(404).send({
                  message: 'No books found by author: ' + authorName,
              });
          }
      })
      .catch((error) => {
          // Log the error
          console.error('Error executing DELETE query:', error);
          response.status(500).send({
              message: 'Error deleting books - contact support',
              error: error.message, // Include the error message for debugging
          });
      });
});

/**
 * @api {delete} /books/isbn/:isbn13 Deletes books by isbn13
 * @apiName DeleteBooksByisbn13
 * @apiGroup Book
 *
 * @apiParam {String} The author of the books to delete
 * @apiParam {String} password User's password.
 *
 * @apiSuccess {String} message Success message confirming the deletion of books by author.
 * @apiError (404: Book Not Found) {String} message "Book not found"
 */
bookRouter.delete('/isbn/:isbn13', (request: Request, response: Response) => {
  const theQuery = 'DELETE FROM BOOKS WHERE isbn13 = $1 RETURNING *';
  const isbn = request.params.isbn13;
  const values = [isbn];

  pool.query(theQuery, values)
      .then((result) => {
          if (result.rowCount === 1) {
              response.send({
                  entry: 'Deleted books(s) by isbn: ' + isbn,
              });
          } else if (result.rowCount > 1) {
              response.send({
                  entry: 'Deleted ' + result.rowCount + ' book(s) by isbn: ' + isbn,
              });
          } else {
              response.status(404).send({
                  message: 'No books found by isbn: ' + isbn,
              });
          }
      })
      .catch((error) => {
          // Log the error
          console.error('Error executing DELETE query:', error);
          response.status(500).send({
              message: 'Error deleting books - contact support',
              error: error.message, // Include the error message for debugging
          });
      });
});

/**
 * @api {delete} /books/bookId/:id Deletes a book by ID
 * @apiName DeleteBookByID
 * @apiGroup Book
 *
 * @apiParam {int} id The ID of the book to delete
 * @apiParam {String} password User's password.
 *
 * @apiSuccess {String} message Success message confirming the deletion of the book by ID.
 * @apiError (404: Book Not Found) {String} message "Book not found"
 */
bookRouter.delete('/bookId/:id', (request: Request, response: Response) => {
  const theQuery = 'DELETE FROM BOOKS WHERE id = $1 RETURNING *';
  const theId = request.params.id;
  const values = [theId];

  pool.query(theQuery, values)
      .then((result) => {
          if (result.rowCount === 1) {
              response.send({
                  entry: 'Deleted books(s) by id: ' + theId,
              });
          } else if (result.rowCount > 1) {
              response.send({
                  entry: 'Deleted ' + result.rowCount + ' book(s) by id: ' + theId,
              });
          } else {
              response.status(404).send({
                  message: 'No books found by id: ' + theId,
              });
          }
      })
      .catch((error) => {
          // Log the error
          console.error('Error executing DELETE query:', error);
          response.status(500).send({
              message: 'Error deleting books - contact support',
              error: error.message, // Include the error message for debugging
          });
      });
});
/**
 * @api {delete} /books/bookTitle/:title Deletes a book by title
 * @apiName DeleteBookByTitle
 * @apiGroup Book
 *
 * @apiParam {int} id The ID of the book to delete
 * @apiParam {String} password User's password.
 *
 * @apiSuccess {String} message Success message confirming the deletion of the book by ID.
 * @apiError (404: Book Not Found) {String} message "Book not found"
 */
bookRouter.delete('/bookTitle/:title', (request: Request, response: Response) => {
    const theQuery = 'DELETE FROM BOOKS WHERE title = $1 RETURNING *';
    const theTitle= request.params.title;
    const values = [theTitle];
  
    pool.query(theQuery, values)
        .then((result) => {
            if (result.rowCount === 1) {
                response.send({
                    entry: 'Deleted books(s) by Title: ' + theTitle,
                });
            } else if (result.rowCount > 1) {
                response.send({
                    entry: 'Deleted ' + result.rowCount + ' book(s) by Title: ' + theTitle,
                });
            } else {
                response.status(404).send({
                    message: 'No books found by Title: ' + theTitle,
                });
            }
        })
        .catch((error) => {
            // Log the error
            console.error('Error executing DELETE query:', error);
            response.status(500).send({
                message: 'Error deleting books - contact support',
                error: error.message, // Include the error message for debugging
            });
        });
  });
export { bookRouter };
