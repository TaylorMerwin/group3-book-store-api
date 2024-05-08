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

//This is to delete books by ISBN13
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
export { bookRouter };