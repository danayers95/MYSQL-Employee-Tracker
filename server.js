let mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root000yes",
    database: "employees"
});

// connect to mysql server
connection.connect(function(err) {
    if (err) {
        return console.error('error: ' + err.message);
    }
    console.log("Connected to MySQL server.");
});

// Initial prompt
function startPrompt() {
    inquirer
      .prompt({
          type: "rawlist",
          name: "action",
          message: "What would you like to do?",
          choices: [
              "View Employees",
              "View Employees by Department",
              "View Employees by Manager",
              "View All Employee Roles",
              "Add Employee",
              "Remove Employee",
              "Update Employee Information",
              "Exit"
          ],
      })
      .then(function ({ task }) {
          switch (task) {
              case "View Employees":
                  viewEmployee();
                  break;
              case "View Employees by Department":
                  viewEmployeeByDepartment();
                  break;
              case "View Employees by Manager":
                  viewByManager();
                  break;
              case "View All Employee Roles":
                  viewAllRoles();
                  break;
              case "Add Employee":
                  addEmployee();
                  break;
              case "Remove Employee":
                  removeEmployee();
                  break;
              case "Update Employee Information":
                  updateEmployeeRole();
                  break;
              case "Add Role":
                  addRole();
                  break;
              case "End":
                  connection.end();
                  break;
          }
      });
}

// Make array to list all employees in one place
function viewEmployee() {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id)
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY employee.id;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('VIEW ALL EMPLOYEES');
        console.log('\n');
        console.table(res);
        startPrompt();
    });
}

// Make array to view employees by department 

function viewEmployeeByDepartment() {
    const query = `SELECT department.name AS department, role.title, employee.id, employee.first_name, employee.last_name
    FROM employee
    LEFT JOIN role ON (role.id = employee.role_id)
    LEFT JOIN department ON (department.id = role.department_id)
    ORDER BY department.name;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('VIEW EMPLOYEE BY DEPARTMENT');
        console.log('\n');
        console.table(res);
        startPrompt();
    });
}

function viewByManager() {
    const query = `SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS manager, department.name AS department, employee.id, employee.first_name, employee.last_name, role.title
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id && employee.manager_id != 'NULL')
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY manager;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('VIEW EMPLOYEE BY MANAGER');
        console.log('\n');
        console.table(res);
        startPrompt();
    });
}

function viewAllRoles() {
    const query = `SELECT role.title, employee.id, employee.first_name, employee.last_name, department.name AS department
    FROM employee
    LEFT JOIN role ON (role.id = employee.role_id)
    LEFT JOIN department ON (department.id = role.department_id)
    ORDER BY role.title;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('VIEW EMPLOYEE BY ROLE');
        console.log('\n');
        console.table(res);
        startPrompt();
    });
}


// Add employee function
async function addEmployee() {
    const addName = await inquirer.prompt(askName());
    connection.query('SELECT role.id, role.title FROM role ORDER BY role.id;', async (err, res) => {
        if (err) throw err;
        const { role } = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: () => res.map(res => res.title),
                message: 'What is the role of the employee?'
            }
        ]);
        let roleId;
        for (const row of res) {
            if (row.title === role) {
                roleId = row.id;
                continue;
            }
        }
        connection.query('SELECT * FROM employee', async (err, res) => {
            if (err) throw err;
            let choices = res.map(res => `${res.first_name} ${res.last_name}`);
            choices.push('none');
            let { manager } = await inquirer.prompt ([
                {
                    name: 'manager',
                    type: 'list',
                    choices: choices,
                    message: 'Choose the Manager'
                }
            ]);
            let managerId;
            let managerName;
            if (manager === 'none') {
                managerId = null;
            } else {
                for (const data of res) {
                    data.fullName = `${data.first_name} ${data.last_name}`;
                    if (data.fullName === manager) {
                        managerId = data.id;
                        managerName = data.fullName;
                        console.log(managerId);
                        console.log(managerName);
                        continue;
                    }
                }
            }
            console.log('Employee has been added!');
            connection.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: addname.first,
                    last_name: addname.last,
                    role_id: roleId,
                    manager_id: parseInt(managerId)
                },
                (err, res) => {
                    if (err) throw err;
                    startPrompt();
                }
            );
        });
    });
}

function remove(input) {
    const promptQ = {
        yes: "yes",
        no: "no",
    };
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: "In order to add an employee, an employee ID must be entered. Do you know the employee ID?",
            choices: [promptQ.yes, promptQ.no]
        }
    ]).then(answer => {
        if (input === 'delete' && answer.action === "yes") removeEmployee();
        else if (input === 'role' && answer.action === "yes") updateEmployeeRole();
        else viewEmployee();
    });
};

async function removeEmployee() {
    const answer = await inquirer.prompt([
        {
            name: "first",
            type: "input",
            message: "Enter the employee ID you would like to remove"
        }
    ]);
    connection.query('DELETE FROM employee WHERE ?',
      {
          id: answer.first
      },
      function(err) {
          if (err) throw err;
      }
    )
    console.log('Employee has been removed');
    startPrompt();
};

function askId() {
    return ([
        {
            name: "name",
            type: "input",
            message: "What is the employee ID? "
        }
    ]);
}

async function updateEmployeeRole() {
    const employeeId = await inquirer.prompt(askId());

    connection.query('SELECT role.id, role.title FROM role ORDER BY role.id;', async (err, res) => {
        if (err) throw err;
        const { role } = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: () => res.map(res => res.title),
                message: 'What is the new employee role?'
            }
        ]);
        let roleId;
        for (const row of res) {
            if (row.title === role) {
                roleId = row.id;
                continue;
            }
        }
        connection.query(`UPDATE employee
        SET role_id = ${roleId}
        WHERE employee.id = ${employeeId.name}`, async (err, res) => {
            if (err) throw err;
            console.log('Role has been updated.')
            startPrompt();
        });
    });
}

function askName() {
    return ([
        {
            name: "first",
            type: "input",
            message: "Enter first name "
        },
        {
            name: "last",
            type: "input",
            message: "Enter last name "
        }
    ]);
}
