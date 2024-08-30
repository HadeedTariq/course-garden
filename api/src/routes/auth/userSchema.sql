CREATE TYPE USERROLE AS ENUM ('student', 'teacher', 'admin');

CREATE TYPE USERSTATUS AS ENUM ('member', 'pro');

CREATE TABLE
    USERS (
        USERID SERIAL,
        USERNAME VARCHAR(50) PRIMARY KEY,
        EMAIL VARCHAR(255) UNIQUE NOT NULL,
        AVATAR TEXT DEFAULT 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRhtuszppVVNDg2JDHofrs55RtFKjd8I9vNU_wzl2CMA&s"',
        USER_PASSWORD VARCHAR(355) NOT NULL,
        QUALIFICATION VARCHAR(50) NOT NULL,
        POINTID INT,
        REFRESHTOKEN TEXT NOT NULL,
        USERROLE USERROLE DEFAULT 'student',
        MOBILENUMBER VARCHAR(20) NOT NULL UNIQUE,
        COUNTRY VARCHAR(255) NOT NULL,
        USERSTATUS USERSTATUS DEFAULT 'member',
        CREATED_AT TIMESTAMP DEFAULT NOW (),
        UPDATED_AT TIMESTAMP DEFAULT NOW (),
        FOREIGN KEY (POINTID) REFERENCES POINTSCHEMA (POINTID)
    )