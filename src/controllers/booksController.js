import {Router} from "express";
import {select, selectByISBN, deleteFromISBN, insert, updateByISBN} from "../database/index.js";

export class booksController {
    constructor() {
        this.router = Router();
    }

    // get all books
    getAll = (req, res) => {
        select(res);
    }

    // create a book
    create = (req, res) => {
        const isbn = req.body.isbn;
        const title = req.body.title;
        const author = req.body.author;
        const overview = req.body.overview;
        const picture = req.body.picture;
        const read_count = req.body.read_count;

        insert(res, req, {isbn, title, author, overview, picture, read_count});
    }

    // get by isbn
    getByISBN = (req, res) => {
        const isbn = req.params.isbn;

        selectByISBN(res, isbn);
    }

    // update a book
    update = (req, res) => {
        const isbn = req.params.isbn;
        const isbnNew = req.body.isbn;
        const title = req.body.title;
        const author = req.body.author;
        const overview = req.body.overview;
        const picture = req.body.picture;
        const read_count = req.body.read_count;

        if(isbn === undefined || isbn === "") {
            res.send("Error : Please indicate an isbn for update a book");
            res.status(400);
            return;
        }

        updateByISBN(res, isbn, {isbnNew, title, author, overview, picture, read_count});
    }

    // delete a book
    delete = (req, res) => {
        const isbn = req.params.isbn;

        if(isbn === undefined || isbn === "") {
            res.send("Error : Please indicate an isbn for delete a book");
            res.status(200);
            return;
        }

        deleteFromISBN(res, isbn);
    }
}