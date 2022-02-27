import {createConnection} from "mysql";
import {Client} from "minio";

export let con = createConnection({
    host: "db",
    user: "root",
    password: "root",
    database: "books",
    insecureAuth: true
});

export let minioClient = new Client({
    endPoint: 'minio',
    port: 9000,
    useSSL: false,
    accessKey: 'minio',
    secretKey: 'minio123'
});

export function createTables() {
    let sql = "CREATE TABLE books (id VARCHAR(13), title VARCHAR(200), author VARCHAR(150), overview VARCHAR(1500), picture VARCHAR(255), read_count INT)";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Tables created");
    });
}

export function select(res) {
    let sql = "SELECT * FROM books";
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.status(200);
        res.send(result);
    });
}

export function testSelect() {
    let sql = "SELECT * FROM books";
    return con.query(sql, function (err, result) {
        if (err) throw err;
        return result;
    });
}

export function selectByISBN(res, isbn) {
    let sql = "SELECT * FROM books WHERE isbn = '"+isbn+"'";
    return con.query(sql, function (err, result) {
        if (result.length === 1) {
            res.status(200);
            res.send(result);
        } else {
            res.status(404);
            res.send("Le livre que vous avez cherché n'existe pas.");
        }
    });
}

export function insert(res, req, book) {

    if(testAllFieldRequiredHere(res, book) === 0) {
        return;
    }

    let sql = "SELECT * FROM books WHERE isbn = '"+book.isbn+"'";
    con.query(sql, function (err, result) {
        if(result.length === 0) {
            let metaData = {
                'Content-Type': 'application/octet-stream',
                'X-Amz-Meta-Testing': 1234,
                'example': 5678
            }

            minioClient.fPutObject("books", book.isbn+".png", "/src/pictures/"+book.picture, metaData, function (error, etag) {
                if(error) {
                    return console.log(error);
                }
                console.log(etag)
            });

            let sql = "INSERT INTO books(isbn, title, author, overview, picture, read_count) VALUES ('"+book.isbn+"', '"+book.title+"', '"+book.author+"', '"+book.overview+"', '"+book.picture+"', '"+book.read_count+"')";
            con.query(sql, function (err, result) {
                let sql = "SELECT * FROM books WHERE isbn = '"+book.isbn+"'";
                return con.query(sql, function (err, result) {
                    res.status(201);
                    res.send(result);
                });
            });
        } else {
            res.status(422);
            res.send("Le livre que vous souhaitez créer existe déjà.");
        }

    });

}

function testAllFieldRequiredHere(res, book) {
    if(!book.isbn) {
        res.status(422);
        res.send("Vous n'avez pas renseigné le numéro ISBN du livre");
        return 0;
    }

    if(!book.title) {
        res.status(422);
        res.send("Vous n'avez pas renseigné le titre du livre");
        return 0;
    }

    if(!book.author) {
        res.status(422);
        res.send("Vous n'avez pas renseigné l'auteur du livre");
        return 0;
    }
}

export function deleteFromISBN(res, isbn) {
    let sql = "SELECT * FROM books WHERE isbn = '"+isbn+"'";
    con.query(sql, function (err, result) {
        if(result.length === 0) {
            res.status(404);
            res.send("Le livre que vous souhaitez supprimer n'existe pas.");
        } else {
            let sql = "DELETE FROM books WHERE isbn = '"+isbn+"'";
            minioClient.removeObject("books", isbn+".png");
            return con.query(sql, function (err, result) {
                res.status(204);
                res.send({});
            });
        }
    });
}

export function updateByISBN(res, isbn, book) {
    if(!isbn || !book.isbnNew) {
        res.status(422);
        res.send("Vous n'avez pas renseigné le numéro ISBN du livre");
        return 0;
    }

    if(!book.title) {
        res.status(422);
        res.send("Vous n'avez pas renseigné le titre du livre");
        return 0;
    }

    if(!book.author) {
        res.status(422);
        res.send("Vous n'avez pas renseigné l'auteur du livre");
        return 0;
    }

    let metaData = {
        'Content-Type': 'application/octet-stream',
        'X-Amz-Meta-Testing': 1234,
        'example': 5678
    }

    let sql = "SELECT * FROM books WHERE isbn = '"+isbn+"'";
    con.query(sql, function (err, result) {
        if(result.length === 0) {
            res.status(404);
            res.send("Le livre que vous souhaitez mettre à jour n'existe pas.");
        } else {
            minioClient.removeObject("books", isbn+".png");
            minioClient.fPutObject("books", book.isbnNew+".png", "/src/pictures/"+book.picture, metaData, function (error, etag) {
                if(error) {
                    return console.log(error);
                }
                console.log(etag)
            });
            let sql = "UPDATE books SET isbn = '"+book.isbnNew+"', title = '"+book.title+"', author = '"+book.author+"', overview = '"+book.overview+"', picture = '"+book.picture+"', read_count = '"+book.read_count+"' WHERE isbn = '"+isbn+"'";

            return con.query(sql, function (err, result) {
                if (err) throw  err;
                res.status(200);
                selectByISBN(res, book.isbnNew)
            });
        }
    });
}