CREATE TABLE Course (
    Course_ID INT PRIMARY KEY AUTO_INCREMENT,
    Course_Code VARCHAR(10) NOT NULL,
    Course_Name VARCHAR(50) NOT NULL,
    Teacher_ID VARCHAR(5) NOT NULL,
    Year INT NOT NULL,
    CanJoin ENUM('Y','N') DEFAULT 'Y',
    UNIQUE KEY Unique_Course_Code_Year (Course_Code, Year),
    FOREIGN KEY (Teacher_ID) REFERENCES teacher(Teacher_ID)
);


Insert into Course(Course_Code, Course_Name, Teacher_ID, Year) values('CS201','Data Structures', 1, 2023);

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