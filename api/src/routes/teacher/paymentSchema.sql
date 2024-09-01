CREATE TABLE
    Payment (
        paymentId SERIAL PRIMARY KEY,
        purchaser INT REFERENCES users (userid),
        price VARCHAR(10) NOT NULL,
        courseId INT REFERENCES course (courseid),
        createdAt TIMESTAMP DEFAULT NOW ()
    );