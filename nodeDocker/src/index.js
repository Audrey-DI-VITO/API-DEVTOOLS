import express from "express";
import bodyParser from "body-parser";
import {booksController} from "./controllers/booksController.js";
import {con, minioClient, testSelect, createTables} from "./database/index.js";

class Server {
    constructor() {
        this.app = express();
        this.app.use(function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            next();
        });
        this.app.use(bodyParser.urlencoded());
        this.app.use(bodyParser.json());
        this.configuration();
        this.booksControl = new booksController();
        this.routesBooks();

        con.connect(function (err) {
            if (err) throw err;
            console.log("Connected!");

            if(testSelect() === undefined || testSelect() === null) {
                createTables();
            }

            minioClient.bucketExists('books', function (err, exists) {
                if (!exists) {
                    minioClient.makeBucket('books', 'eu-west-1');
                }
            })
        });
    }

    configuration() {
        this.app.set('port', 3000);
    }

    routesBooks() {
        this.app.get("/books", (req, res) => {
            this.booksControl.getAll(req, res);
        });

        this.app.get("/books/:isbn", (req, res) => {
            this.booksControl.getByISBN(req, res);
        });

        this.app.post("/books", (req, res) => {
            this.booksControl.create(req, res);
        });

        this.app.patch("/books/:isbn", (req, res) => {
            this.booksControl.update(req, res);
        });

        this.app.delete("/books/:isbn", (req, res) => {
            this.booksControl.delete(req, res);
        });
    }

    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log("Server listening on port " + this.app.get('port'));
        });
    }

}

const server = new Server();
server.start();