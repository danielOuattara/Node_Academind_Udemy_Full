import { Router } from "express";
import { TodoInterface } from "../models/todoRoutes";
const router = Router();

let todos: TodoInterface[] = [];
type RequestBody = { text: string };
type RequestParams = { todoId: string };

router.get("/todos", (req, res, next) => {
  res.status(200).json({ todos });
});

//
router.post("/todos", (req, res, next) => {
  const body = req.body as RequestBody;
  const newTodo: TodoInterface = {
    id: Math.random().toString(),
    text: body.text,
  };

  todos.push(newTodo);
  return res.status(201).json({ message: "Created successfully", todos });
});

//
router.put("/todos/:todoId", (req, res, next) => {
  const body = req.body as RequestBody;
  const params = req.params as RequestParams;
  const todoIndex = todos.findIndex((item) => item.id === params.todoId);
  if (todoIndex >= 0) {
    todos[todoIndex] = {
      id: req.params.todoId,
      text: body.text,
    };
    return res.status(201).json({ message: "Updated successfully", todos });
  }
  return res.status(404).json({ message: "Todo not found" });
});

//
router.delete("/todos/:todoId", (req, res, next) => {
  const params = req.params as RequestParams;
  const todoIndex = todos.findIndex((item) => item.id === params.todoId);
  if (todoIndex >= 0) {
    todos = todos.filter((item) => item.id !== req.params.todoId);
    return res.status(201).json({ message: "Deleted successfully", todos });
  }
  return res.status(404).json({ message: "Todo not found" });
});

export default router;
