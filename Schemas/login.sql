create table LogIn(
    EmailAddress varchar(40) primary key,
    password varchar(40) not null,
    role ENUM('s','t') not null
);

INSERT INTO LogIn VALUES('202251127@iiitvadodara.ac.in','202251127','s');
INSERT INTO LogIn VALUES('202251125@iiitvadodara.ac.in','202251125','s');