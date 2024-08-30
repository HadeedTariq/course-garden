CREATE TABLE
    feedback (
        feedback_id SERIAL PRIMARY KEY,
        content_data VARCHAR(255) NOT NULL,
        user_id INT REFERENCES users (userid),
        courseid INT REFERENCES course (courseid)
    );

CREATE TABLE
    replies (
        reply_id SERIAL PRIMARY KEY,
        content_data VARCHAR(255) NOT NULL,
        user_id INT REFERENCES users (userid),
        feedback_id INT REFERENCES feedback (feedback_id)
    );