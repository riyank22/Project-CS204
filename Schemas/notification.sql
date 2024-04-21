create table invite (
    id int primary key auto_increment,
    Team_ID int not null,
    Receiver_ID varchar(10) not null,
    foreign key (Team_ID) references Team(id),
    foreign key (Receiver_ID) references student(RollNo)
);

create table request (
    id int primary key auto_increment,
    Team_ID int not null,
    Sender_ID varchar(10) not null,
    foreign key (Team_ID) references Team(id),
    foreign key (Sender_ID) references student(RollNo)
);