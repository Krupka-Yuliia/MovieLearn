CREATE TABLE user_interest
(
    user_id  INT NOT NULL,
    interest_id INT NOT NULL,
    PRIMARY KEY (user_id, interest_id),
    FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE,
    FOREIGN KEY (interest_id) REFERENCES interest (id) ON DELETE CASCADE
);
