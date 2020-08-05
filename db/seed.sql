INSERT INTO departments(department_name)
VALUES
('Management'),
('Sales'),
('Warehouse'),
('Human Resources'),
('Quality Control'),
('Office Management'),
('Accounting');

INSERT INTO roles(title, salary, department_id)
VALUES
('Regional Manager', 120000, 1),
('Sales Rep', 65000, 2),
('HR Rep', 67000, 4),
('Warehouse Worker', 42000, 3),
('Receptionist', 46000, 6),
('Accountant', 71000, 7);

INSERT INTO employees(first_name, last_name, role_id)

