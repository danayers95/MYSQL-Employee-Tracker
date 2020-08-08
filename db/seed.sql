DROP database IF EXISTS exployeeDB;
CREATE database employeeDB;
USE employeeDB;
CREATE TABLE department (
    id INTEGER primary key auto_increment,
    name VARCHAR(30)
);
CREATE TABLE role (
    id INTEGER primary key auto_increment,
    title VARCHAR(30) not null,
    salary DECIMAL not null,
    department_id INTEGER not null
);
CREATE TABLE employee (
    id INTEGER primary key auto_increment,
    first_name VARCHAR(30) not null,
    last_name VARCHAR(30) not null,
    role_id INTEGER not null,
    manager_id INTEGER null
);
INSERT INTO department (name)
VALUES ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');
INSERT INTO role (title, salary, department_id)
VALUES ('Sales Lead', 100000, 1),
    ('Salesperson', 80000, 1),
    ('Lead Engineer', 150000, 2),
    ('Software Engineer', 120000, 2),
    ('Account Manager', 160000, 3),
    ('Accountant', 125000, 3),
    ('Legal Team Lead', 250000, 4),
    ('Lawyer', 190000, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, NULL),
    ('Mike', 'Chan', 2, 1),
    ('Ashley', 'Rodriguez', 3, NULL),
    ('Kevin', 'Tupik', 4, 3),
    ('Kunal', 'Singh', 5, NULL),
    ('Malia', 'Brown', 6, 5),
    ('Sarah', 'Lourd', 7, NULL),
    ('Tom', 'Allen', 8, 7);