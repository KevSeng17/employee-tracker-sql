const inquirer = require("inquirer");
const express = require("express");
const { Pool } = require("pg");
const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const pool = new Pool (
  {
    user: 'postgres',
    password: 'Weedman17',
    host: 'localhost',
    database: 'company_db'
  },
  console.log(`Connected to company_db database.`)
)
pool.connect();

inquirer.prompt([
  {
    type: "list",
    name: "Opening Menu",
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
]);
