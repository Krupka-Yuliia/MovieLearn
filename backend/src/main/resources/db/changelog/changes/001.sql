CREATE TABLE user
(
    id       INT AUTO_INCREMENT PRIMARY KEY,
    email    VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    name     VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    english_level ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2') DEFAULT 'A1',
    role ENUM('ADMIN', 'USER') NOT NULL,
    profile_pic BLOB
);

