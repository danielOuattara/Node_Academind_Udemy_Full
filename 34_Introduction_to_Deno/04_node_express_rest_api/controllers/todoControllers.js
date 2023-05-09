let todoList = [];

//
const getTodo = (_req, res) => {
  res.status(200).json({ quantity: todoList.length, todoList });
};

//--------------------------------------------
const addTodo = (req, res) => {
  const newTodo = {
    id: Math.random().toString().split(".")[1],
    text: req.body.text,
  };

  todoList.push(newTodo);
  return res.status(201).json({ message: "Created successfully", todoList });
};

//--------------------------------------------
const updateTodo = (req, res) => {
  const todoIndex = todoList.findIndex((item) => item.id === req.params.todoId);
  if (todoIndex >= 0) {
    todoList[todoIndex] = {
      id: req.params.todoId,
      text: req.body.text,
    };
    return res.status(201).json({ message: "Updated successfully", todoList });
  }
  return res.status(404).json({ message: "Todo not found" });
};

//--------------------------------------------
const deleteTodo = (req, res) => {
  const todoIndex = todoList.findIndex((item) => item.id === req.params.todoId);
  if (todoIndex >= 0) {
    todoList = todoList.filter((item) => item.id !== req.params.todoId);
    return res.status(201).json({ message: "Deleted successfully", todoList });
  }
  return res.status(404).json({ message: "Todo not found" });
};

module.exports = {
  getTodo,
  addTodo,
  updateTodo,
  deleteTodo,
};
