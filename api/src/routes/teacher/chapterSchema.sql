CREATE TABLE
    chapters (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        thumbnail VARCHAR(255) NOT NULL,
        chapter_number INTEGER NOT NULL,
        video VARCHAR(355) NOT NULL,
        courseid INTEGER REFERENCES course (courseid)
    );