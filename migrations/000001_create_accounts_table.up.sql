CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    email VARCHAR(128) NOT NULL,
    first_name VARCHAR(128) NOT NULL,
    last_name VARCHAR(128) NOT NULL,
    password VARCHAR(255) NOT NULL,
    balance INT DEFAULT 0,
    profile_image VARCHAR(255),
    CONSTRAINT uq_email
        UNIQUE (email),

    CONSTRAINT balance_not_negative
        CHECK (balance >= 0)
);