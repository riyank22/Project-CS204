create table Enrollement(
    RollNo varchar(10),
    Course_ID int,
    int Year,
    FOREIGN KEY (RollNo) REFERENCES student(RollNo),
    FOREIGN KEY (Course_ID) REFERENCES Course(Course_ID),
    PRIMARY KEY (RollNo, Course_ID,Year)
);
Insert into Enrollement values('202251127', 1);

SELECT * FROM Enrollement join Course on Enrollement.Course_ID = Course.Course_ID
where RollNo = '202251127' and Year = 2023;

create table project(
    Project_ID varchar(20) PRIMARY KEY AUTO_INCREMENT,
    Project_Name varchar(20),
    Teacher_ID VARCHAR(5) NOT NULL,
    CanJoin ENUM('Y','N') DEFAULT 'Y',
    Max_Students int NOT NULL,
    Min_Students int NOT NULL,
    Last_Date date NOT NULL,
    FOREIGN KEY (Teacher_ID) REFERENCES teacher(Teacher_ID),
    FOREIGN KEY (Course_ID) REFERENCES Course(Course_ID),
    check( Min_Students <= Max_Students),
    check (Min_Students > 0)
);