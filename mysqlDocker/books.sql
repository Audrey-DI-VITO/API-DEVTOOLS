DROP DATABASE books;
CREATE DATABASE books;
USE books;

CREATE TABLE books (
    id INT NOT NULL PRIMARY AUTO_INCREMENT,
    isbn VARCHAR(13) NOT NULL,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(150),
    overview VARCHAR(1500),
    picture VARCHAR(255),
    read_count INT DEFAULT 1
) ENGINE = InnoDB;
