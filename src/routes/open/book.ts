import express, { NextFunction, Request, Response, Router } from 'express';

import { pool } from '../../core/db/sql_conn';

const bookRouter: Router = express.Router();

// TODO add this function to ../../core/utilities
function mwValidNameBookBody(
    request: Request,
    response: Response,
    next: NextFunction
) {
    next();
    //TODO add validity to body
}
const format = (
    resultRow //TODO fix formatting maybe?
) =>
    `isbn: ${resultRow.isbn13}, authors: ${resultRow.authors}, title: ${resultRow.original_title}`;

/**
 * @api {post} /book Request to add an entry
 * @apiName PostBook
 * @apiGroup Books
 *
 * @apiParam {Number} isbn a books isbn number.
 * @apiParam {String} authors a books author’s name.
 * @apiParam {Number} publication year a books publication year.
 * @apiParam {String} original_title a books original title.
 * @apiParam {String} title a book title.
 * @apiParam {String} image_url a books image url.
 * @apiParam {String} image_small_url a books small image url.
 *
 * @apiSuccess (Success 201) {String} entry the string:
 *       `{${resultRow.book_id}}, [${resultRow.isbn13}], ${resultRow.authors}, ${resultRow.original_title}`;
 *
 *  @apiError (400: Name exists) {String} message "Book exists"
 *  @apiError (400: Missing Parameters) {String} message "Missing required information - please refer to documentation
 */
bookRouter.post(
    '/',
    mwValidNameBookBody,
    (request: Request, response: Response, next: NextFunction) => {
        //const priority: string = request.body.priority as string;
        next();
        // if (
        //     validationFunctions.isNumberProvided(priority) &&
        //     parseInt(priority) >= 1 &&
        //     parseInt(priority) <= 3
        // ) {
        //     next();
        // } else {
        //     console.error('Invalid or missing Priority');
        //     response.status(400).send({
        //         message:
        //             'Invalid or missing Priority - please refer to documentation',
        //     });
        // }
    },
    (request: Request, response: Response) => {
        const theQuery = `
        INSERT INTO BOOKS 
        (isbn13, authors, publication_year, original_title, title, image_url, image_small_url) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING *`;

        const values = [
            request.body.isbn13,
            request.body.authors,
            request.body.publication_year,
            request.body.original_title,
            request.body.title,
            request.body.image_url,
            request.body.image_small_url,
        ];

        pool.query(theQuery, values)
            .then((result) => {
                response.status(201).send({
                    entry: format(result.rows[0]),
                });
            })
            .catch((error) => {
                if (
                    error.detail != undefined &&
                    (error.detail as string).endsWith('already exists.') //TODO book exists
                ) {
                    console.error('Book exists!');
                    console.error(error);
                    response.status(400).send({
                        message: 'Book exists',
                    });
                } else {
                    //log the error
                    console.error('DB Query error on POST');
                    console.error(error);
                    response.status(500).send({
                        message: 'server error - contact support~!',
                    });
                }
            });
    }
);

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

export { bookRouter };
