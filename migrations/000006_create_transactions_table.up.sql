CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    email VARCHAR(24) NOT NULL,
    service_code VARCHAR(24) NOT NULL,
    invoice_number VARCHAR(24) NOT NULL,

    CONSTRAINT fk_account
        FOREIGN KEY (email) 
        REFERENCES accounts(email)
        ON DELETE CASCADE,

    CONSTRAINT fk_service
        FOREIGN KEY (service_code) 
        REFERENCES services(code)
        ON DELETE CASCADE,

    CONSTRAINT fk_invoice
        FOREIGN KEY (invoice_number) 
        REFERENCES invoices(number)
        ON DELETE CASCADE
);