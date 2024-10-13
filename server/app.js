import express from "express";
import {
  getTodo,
  sharedTodo,
  deleteTodo,
  getTodoById,
  createTodo,
  toggleCompleted,
  getUserEmail,
  getUserById,
  getSharedTodoById,
} from "./database.js";
import cors from "cors";
const corsOptions = {
  origin: "http://localhost:8081",
  methods: ["GET", "POST"],
  credentials: true,
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.get("/todos/:id", async (req, res) => {
  try {
    const todo = await getTodoById(req.params.id);

    if (!todo) {
      return res.status(404).json({ error: "Todo no encontrado" });
    }

    res.status(200).send(todo);
  } catch (error) {
    console.error("Error al obtener todo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.get("/todos/shared_todos/:id", async (req, res) => {
  try {
    const todo = await getSharedTodoById(req.params.id);

    if (!todo) {
      return res.status(404).json({ error: "Todo compartido no encontrado" });
    }

    const autor = await getUserById(todo.user_id);
    const shared_with = await getUserById(todo.shared_with_id);

    if (!autor || !shared_with) {
      return res
        .status(404)
        .json({ error: "Autor o usuario compartido no encontrado" });
    }

    res.status(200).send({ autor, shared_with });
  } catch (error) {
    console.error("Error al obtener todo compartido:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).send(user);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.put("/todos/:id", async (req, res) => {
  try {
    const { value } = req.body;

    const todo = await toggleCompleted(req.params.id, value);

    if (!todo) {
      return res.status(404).json({ error: "Todo no encontrado" });
    }

    res.status(200).send(todo);
  } catch (error) {
    console.error("Error al actualizar todo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    const result = await deleteTodo(req.params.id);

    if (!result) {
      return res.status(404).json({ error: "Todo no encontrado" });
    }

    res.status(200).send({ message: "Tarea eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar todo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.post("/todo/shared_todos/", async (req, res) => {
  try {
    const { todo_id, user_id, email } = req.body;
    const userToShare = await getUserEmail(email);

    if (!userToShare) {
      return res
        .status(404)
        .json({ error: "Usuario para compartir no encontrado" });
    }

    const sharedTodoResult = await sharedTodo(todo_id, user_id, userToShare.id);

    res.status(201).send({
      message: "Tarea compartida con éxito",
      sharedTodoId: sharedTodoResult,
    });
  } catch (error) {
    console.error("Error al compartir todo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.post("/todos", async (req, res) => {
  try {
    // Validación de entrada
    const { user_id, title } = req.body;

    if (!user_id || !title) {
      return res
        .status(400)
        .json({ error: "user_id y title son obligatorios." });
    }

    // Crear la tarea
    const todo = await createTodo(user_id, title);

    // Verificar si la tarea fue creada exitosamente
    if (!todo) {
      return res.status(500).json({ error: "Error al crear la tarea." });
    }

    // Responder con la tarea creada
    res.status(201).json({ message: "Tarea creada con éxito", todo });
  } catch (error) {
    console.error("Error al crear la tarea:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.listen(8000, () => {
  console.log("corriendo en el puerto http://localhost:8000");
});
