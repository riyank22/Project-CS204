create table LogIn(
    EmailAddress varchar(40) primary key,
    password varchar(40) not null,
    role ENUM('s','t') not null
);

INSERT INTO LogIn VALUES('202251127@iiitvadodara.ac.in','202251127','s');
INSERT INTO LogIn VALUES('202251125@iiitvadodara.ac.in','202251125','s');
INSERT INTO LogIn VALUES('teacher1@iiitvadodara.ac.in','teacter','t');
INSERT INTO LogIn VALUES('202251136@iiitvadodara.ac.in','202251136','s');

INSERT INTO LogIn VALUES('202252308@iiitvadodara.ac.in','202252308','s');
INSERT INTO LogIn VALUES('202252301@iiitvadodara.ac.in','202252301','s');
INSERT INTO LogIn VALUES('202252310@iiitvadodara.ac.in','202252310','s');