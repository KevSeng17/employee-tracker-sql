SELECT employees.first_name AND employees.last_name

SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, 
                 CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
                 FROM employees 
                 LEFT JOIN roles ON employees.role_id = roles.id 
                 LEFT JOIN departments ON roles.department_id = departments.id 
                 LEFT JOIN employees manager ON manager.id = employees.manager_id
                 SELECT roles.id, roles.title, roles.salary, departments.name AS department FROM roles
  JOIN departments ON roles.department_id = departments.id
  INSERT INTO departments (name) VALUES (?)