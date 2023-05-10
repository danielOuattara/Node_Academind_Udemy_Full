import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { getDB } from "./../database/connect.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
const router = new Router();

interface Todo {
  _id?: ObjectId;
  text: string;
}

//---------------------------------------------------------------
router.get("/todos", async (ctx) => {
  const todos = await getDB().collection<Todo>("todos").find().toArray();
  const transformedTodos = todos.map((todo: Todo) => {
    return {
      id: todo._id,
      text: todo.text,
    };
  });
  ctx.response.body = { todos: transformedTodos };
});

//---------------------------------------------------------------
router.get("/todos/:todoId", async (ctx) => {
  const todoId = ctx.params.todoId;
  const todos = await getDB()
    .collection<Todo>("todos")
    .findOne({ _id: new ObjectId(todoId) });
  ctx.response.body = { todo: todos };
});

//---------------------------------------------------------------
router.post("/todos", async (ctx) => {
  const data = await ctx.request.body({ type: "json" }).value;
  const newTodo: Todo = {
    text: data.text,
  };

  const id = await getDB().collection<Todo>("todos").insertOne(newTodo);
  ctx.response.body = { message: "Created todo!", todo: newTodo };
});

//---------------------------------------------------------------
router.put("/todos/:todoId", async (ctx) => {
  const todoId = ctx.params.todoId;
  const data = await ctx.request.body({ type: "json" }).value;
  await getDB()
    .collection<Todo>("todos")
    .updateOne({ _id: new ObjectId(todoId) }, { $set: { text: data.text } });
  ctx.response.body = { message: "Updated todo" };
});

//---------------------------------------------------------------
router.delete("/todos/:todoId", async (ctx) => {
  const todoId = ctx.params.todoId;
  await getDB()
    .collection<Todo>("todos")
    .deleteOne({ _id: new ObjectId(todoId) });
  ctx.response.body = { message: "Deleted todo" };
});

export default router;
