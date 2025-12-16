CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    number VARCHAR(64) NOT NULL,
    transaction_type VARCHAR(24) NOT NULL,
    description VARCHAR(255),
    total_amount INT NOT NULL,
    created_on TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT uq_number
        UNIQUE (number),

    CONSTRAINT amount_not_negative
        CHECK (total_amount >= 0)
);