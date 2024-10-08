create table student(
    EmailAddress varchar(40),
    RollNo varchar(10) primary key,
    FName varchar(20) not null,
    LName varchar(20),
    Barch int not null,
    gender ENUM('M','F') not null,
    Branch varchar(10) not null

    foreign key(EmailAddress) references LogIn(EmailAddress)
);

Insert into student values('202251127@iiitvadodara.ac.in','202251127','Riyank','Singh',2022,'M','CSE');  
Insert into student values('202251125@iiitvadodara.ac.in','202251125','Shrijan','Shresth',2022,'M','CSE');
Insert into student values('202251136@iiitvadodara.ac.in','202251136','Sudhir','Nagar',2022,'M','CSE');

create table teacher(
    EmailAddress varchar(40),
    Teacher_ID varchar(5) primary key,
    Teacher_FName varchar(20) not null,
    Teacher_LName varchar(20) not null,
    gender ENUM('M','F') not null,
    Joining_Year int not null,

    foreign key(EmailAddress) references LogIn(EmailAddress)
)

Insert into teacher values('test', '1', 'Teacher', '1', 'F', 2015);

Insert into student values('202252301@iiitvadodara.ac.in','202252301','Abhyuday','Tomar',2022,'M','IT');
Insert into student values('202252308@iiitvadodara.ac.in','202252308','Ayush','Yadav',2022,'M','IT');
Insert into student values('202252310@iiitvadodara.ac.in','202252310','Yash','Bhambhani',2022,'M','IT');
