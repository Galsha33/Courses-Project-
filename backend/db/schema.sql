CREATE TABLE users(
    user_id INT GENERATED ALWAYS AS IDENTITY,
    name varchar(100) not null,
    password varchar(100) not null,
    email varchar(100) not null,
    PRIMARY KEY(user_id)
);

CREATE TABLE subjects(
    subject_id INT GENERATED ALWAYS AS IDENTITY,
    subject varchar(30) not null,
    rating decimal(2,2),
    level varchar(10),
    PRIMARY KEY(subject_id)
);

CREATE TABLE courses(
    course_id INT GENERATED ALWAYS AS IDENTITY,
    name varchar(100),
    user_id int,
    subject_id int,
    PRIMARY KEY(course_id),
    CONSTRAINT fk_users
      FOREIGN KEY(user_id) 
	  REFERENCES users(user_id),
    CONSTRAINT fk_subjects
      FOREIGN KEY(subject_id) 
	  REFERENCES subjects(subject_id)
);