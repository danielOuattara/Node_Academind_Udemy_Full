const { Router } = require("express");

const router = Router();
let todos = [];

//
router.get("/todos", (_req, res) => {
  res.status(200).json({ quantity: todos.length, todos });
});

//
router.post("/todos", (req, res) => {
  const newTodo = {
    id: Math.random().toString().split(".")[1],
    text: req.body.text,
  };

  todos.push(newTodo);
  return res.status(201).json({ message: "Created successfully", todos });
});

//
router.put("/todos/:todoId", (req, res) => {
  const todoIndex = todos.findIndex((item) => item.id === req.params.todoId);
  if (todoIndex >= 0) {
    todos[todoIndex] = {
      id: req.params.todoId,
      text: eq.body.text,
    };
    return res.status(201).json({ message: "Updated successfully", todos });
  }
  return res.status(404).json({ message: "Todo not found" });
});

//
router.delete("/todos/:todoId", (req, res) => {
  const todoIndex = todos.findIndex((item) => item.id === req.params.todoId);
  if (todoIndex >= 0) {
    todos = todos.filter((item) => item.id !== req.params.todoId);
    return res.status(201).json({ message: "Deleted successfully", todos });
  }
  return res.status(404).json({ message: "Todo not found" });
});

//
module.exports = router;
