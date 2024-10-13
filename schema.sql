CREATE DATABASE todo_proyecto;

USE todo_proyecto;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255)
);

CREATE TABLE todos(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    completed BOOLEAN DEFAULT false,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE shared_todos(
    id INT AUTO_INCREMENT PRIMARY KEY,
    todo_id INT,
    user_id INT,
    shared_with_id INT,
    Foreign Key (todo_id) REFERENCES todos(id) ON DELETE CASCADE,
    Foreign Key (user_id) REFERENCES users(id) ON DELETE CASCADE,
    Foreign Key (shared_with_id) REFERENCES users(id)ON DELETE CASCADE
);

INSERT INTO shared_todos(todo_id, user_id, shared_id) VALUES(1,1,2);

INSERT INTO users(name, email, password) values ('anthony', 'example@example.com','12345');
INSERT INTO users(name, email, password) values ('sofia', 'example2@example.com','123456');


INSERT INTO todos (title, user_id)
VALUES ("Go to a morning run", 1),
("Go to a night qwe", 1),
("Go to a asd qwe", 1),
("Go to a maning qwe", 1);
INSERT INTO shared_todos (todo_id, user_id, shared_with_id) VALUES (1, 1, 2);


SELECT todos.*, shared_todos.shared_with_id
FROM todos
LEFT JOIN shared_todos ON todos.id = shared_todos.todo_id
WHERE todos.user_id = 1 OR shared_todos.shared_with_id = 1;

