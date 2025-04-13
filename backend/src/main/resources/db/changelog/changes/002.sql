CREATE TABLE interest
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO interest (name)
VALUES ('Sport'),
       ('Fashion'),
       ('Food'),
       ('Space'),
       ('Art'),
       ('Traveling'),
       ('Literature'),
       ('Humor'),
       ('Music'),
       ('Science');