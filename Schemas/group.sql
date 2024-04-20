create table Team(
    id int AUTO_INCREMENT,
    Project_ID int,
    Team_Name varchar(50),
    Team_Lead varchar(10) not null,
    primary key (id, Project_ID, Team_Lead),

    foreign key (Team_Lead) references student(RollNo),
    foreign key (Project_ID) references project(Project_ID)
);

create table Team_Member(
    Team_ID int,
    RollNo varchar(10),
    role ENUM('m','l') not null,
    foreign key (RollNo) references student(RollNo),
    foreign key (Team_ID) references Team(id)    
);

DELIMITER //
create trigger teamCreation
after insert on Team
for each row
begin
    insert into Team_Member values(new.id, new.Team_Lead, 'l');
end
// DELIMITER;

insert into Team(Project_ID, Team_Name, Team_Lead) values(1, 'Team1', '5678');