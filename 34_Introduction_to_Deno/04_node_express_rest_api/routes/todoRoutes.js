const { Router } = require("express");
const {
  getTodo,
  addTodo,
  updateTodo,
  deleteTodo,
} = require("./../controllers/todoControllers");

const router = Router();

router.get("/todos", getTodo);
router.post("/todos", addTodo);
router.put("/todos/:todoId", updateTodo);
router.delete("/todos/:todoId", deleteTodo);

module.exports = router;

//---------------------------------------------------
