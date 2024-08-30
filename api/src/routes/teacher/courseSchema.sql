CREATE TYPE status_type AS ENUM ('free', 'paid');

CREATE TYPE category_type AS ENUM (
    'Cs',
    'It',
    'FullStack',
    'AppDev',
    'Ml',
    'DataScience',
    'Frontend',
    'Backend',
    'Other'
);

CREATE TABLE
    course (
        courseid SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL, -- assuming title has a maximum length of 255
        description TEXT NOT NULL,
        thumbnail VARCHAR(500) NOT NULL,
        status status_type, -- use the enum type created earlier
        category category_type, -- use the enum type created earlier
        totalChapters INT,
        ispublish BOOLEAN DEFAULT FALSE,
        creator INT REFERENCES users (userid),
    );

create table
    couponusers (
        id serial primary key,
        userid int references users (userid),
        courseid int references course (courseid)
    );

create table
    couponcode (
        coupon varchar(15) not null,
        quantity int default 0,
        courseid int references course (courseid),
        couponusers int references couponusers (id)
    );

create table
    purchasers (
        purchaser_id int references users (userid),
        courseid int references course (courseid)
    )