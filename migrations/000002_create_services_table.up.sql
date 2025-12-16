CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    code VARCHAR(64) NOT NULL,
    name VARCHAR(128) NOT NULL,
    icon VARCHAR(255),
    tariff INT NOT NULL,
    CONSTRAINT uq_code
        UNIQUE (code)
);