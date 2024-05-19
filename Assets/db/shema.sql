DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

\c company_db;

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    department_name VARCHAR(50),
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50),
);

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    employee_name VARCHAR(100),
);