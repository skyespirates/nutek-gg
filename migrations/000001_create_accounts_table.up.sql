CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    email VARCHAR(128) NOT NULL,
    first_name VARCHAR(128) NOT NULL,
    last_name VARCHAR(128) NOT NULL,
    password VARCHAR(255) NOT NULL,
    balance INT DEFAULT 0
);