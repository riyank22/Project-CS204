create table enrollement(
    Student_ID int,
    Project_ID int,
    FOREIGN KEY (Student_ID) REFERENCES student(userID),
    FOREIGN KEY (Project_ID) REFERENCES project(Project_ID),
    PRIMARY KEY (Student_ID, Project_ID)
);

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