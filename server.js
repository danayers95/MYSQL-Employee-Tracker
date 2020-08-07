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
              "Add Employee",
              "Remove Employee",
              "Update Employee Information",
              "Add role",
              "End"
          ]
      })
      .then(function ({ task }) {
          switch (task) {
              case "View Employees":
                  viewEmployee();
                  break;
              case "View Employees by Department":
                  viewEmployeeByDepartment();
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

function listEmployee() {
    const query = "SELECT * FROM employee";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        startPrompt();
    });
}

// Make department for array

function viewEmployeeByDepartment() {}