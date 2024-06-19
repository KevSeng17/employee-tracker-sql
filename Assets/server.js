const inquirer = require("inquirer");
const express = require("express");
const { Pool } = require("pg");
const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const pool = new Pool(
  {
    user: "postgres",
    password: "Weedman17",
    host: "localhost",
    database: "company_db",
  },
  console.log(`Connected to company_db database on ${PORT}.`)
);
pool.connect();
promptUser();
function promptUser() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "Add Employee",
          "Update Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.action) {
        case "View All Employees":
          viewAllEmployees();
          break;
        case "View All Roles":
          viewAllRoles();
          break;
        case "View All Departments":
          viewAllDepartments();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Add Role":
          addRole();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "Exit":
          pool.end();
          break;
      }
    });
}
function viewAllDepartments() {
  const query = "SELECT * FROM departments";
  pool.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    promptUser();
  });
}
function viewAllRoles() {
  const query = `SELECT roles.id, roles.title, roles.salary, departments.name AS department FROM roles
  JOIN departments ON roles.department_id = departments.id`;
  pool.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    promptUser();
  });
}
function viewAllEmployees() {
  const query = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, 
                 CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
                 FROM employees 
                 LEFT JOIN roles ON employees.role_id = roles.id 
                 LEFT JOIN departments ON roles.department_id = departments.id 
                 LEFT JOIN employees manager ON manager.id = employees.manager_id`;
  pool.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    promptUser();
  });
}
function addDepartment() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "Enter the name of the department:",
      },
    ])
    .then((answer) => {
      const query = "INSERT INTO departments (name) VALUES (?)";
      pool.query(query, answer.name, (err, res) => {
        if (err) throw err;
        console.log(`Department added: ${answer.name}`);
        promptUser();
      });
    });
}
function addRole() {
  pool.query("SELECT * FROM departments", (err, departments) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "Enter the title of the role:",
        },
        {
          name: "salary",
          type: "input",
          message: "Enter the salary for the role:",
        },
        {
          name: "department_id",
          type: "list",
          message: "Select the department for the role:",
          choices: departments.map((department) => ({
            name: department.name,
            value: department.id,
          })),
        },
      ])
      .then((answer) => {
        const query =
          "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)";
        pool.query(
          query,
          [answer.title, answer.salary, answer.department_id],
          (err, res) => {
            if (err) throw err;
            console.log(`Role added: ${answer.title}`);
            promptUser();
          }
        );
      });
  });
}
function addEmployee() {
  pool.query("SELECT * FROM roles", (err, roles) => {
    if (err) throw err;
    pool.query("SELECT * FROM employees", (err, employees) => {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: "first_name",
            type: "input",
            message: "Enter the employee's first name:",
          },
          {
            name: "last_name",
            type: "input",
            message: "Enter the employee's last name:",
          },
          {
            name: "role_id",
            type: "list",
            message: "Select the employee's role:",
            choices: roles.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
          {
            name: "manager_id",
            type: "list",
            message: "Select the employee's manager:",
            choices: [{ name: "None", value: null }].concat(
              employees.map((employee) => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
              }))
            ),
          },
        ])
        .then((answer) => {
          const query =
            "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
          pool.query(
            query,
            [
              answer.first_name,
              answer.last_name,
              answer.role_id,
              answer.manager_id,
            ],
            (err, res) => {
              if (err) throw err;
              console.log(
                `Employee added: ${answer.first_name} ${answer.last_name}`
              );
              promptUser();
            }
          );
        });
    });
  });
}
function updateEmployeeRole() {
  pool.query("SELECT * FROM employees", (err, employees) => {
    if (err) throw err;
    pool.query("SELECT * FROM roles", (err, roles) => {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: "employee_id",
            type: "list",
            message: "Select the employee to update:",
            choices: employees.map((employee) => ({
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id,
            })),
          },
          {
            name: "role_id",
            type: "list",
            message: "Select the new role:",
            choices: roles.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
        ])
        .then((answer) => {
          const query = "UPDATE employees SET role_id = ? WHERE id = ?";
          pool.query(
            query,
            [answer.role_id, answer.employee_id],
            (err, res) => {
              if (err) throw err;
              console.log("Employee role updated");
              promptUser();
            }
          );
        });
    });
  });
}
