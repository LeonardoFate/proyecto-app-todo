import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
}).promise();

export async function getTodosById(id) {
    const [rows] = await pool.query(
      `SELECT todos.*, shared_todos.shared_with_id
      FROM todos
      LEFT JOIN shared_todos ON todos.id = shared_todos.todo_id
      WHERE todos.user_id = ? OR shared_todos.shared_with_id = ?
      `,
      [id, id]
    );
    return rows;
  }

export async function getTodo(id) {
    const [rows] = await pool.query(`SELECT * FROM todos WHERE id = ?`,[id]);
    return rows[0]
}
