// import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
// import { TodoInterface } from "../models/todoModel.ts";

// const router = new Router();

// let todos: TodoInterface[] = [
//   {
//     id: "123456789",
//     text: "walk around",
//   },
//   {
//     id: "987654321",
//     text: "feed the fish",
//   },
// ];

// type RequestBody = { text: string };
// type RequestParams = { todoId: string };

// //
// router.get("/todos", (ctx) => {
//   console.log("ctx = ", ctx);
//   ctx.response.body = { todos };
// });

// // OK!
// router.get("/todos/:todoId", (ctx) => {
//   const params = ctx.params as RequestParams;
//   const todo = todos.find((item) => item.id === params.todoId);
//   if (todo) {
//     ctx.response.body = { todo: todo };
//   } else {
//     ctx.response.body = "Todo not found";
//   }
// });

// // (Check)!
// router.post("/todos", async (ctx) => {
//   const data = await ctx.request.body().value;
//   const newTodo: TodoInterface = {
//     id: Math.random().toString().split(".")[1],
//     text: data.text,
//   };

//   todos.push(newTodo);
//   ctx.response.body = { todo: newTodo };
// });

// // (Check)!
// router.put("/todos/:todoId", async (ctx) => {
//   const data = await ctx.request.body().value;
//   const params = ctx.params as RequestParams;
//   const todoIndex = todos.findIndex((item) => item.id === params.todoId);
//   if (todoIndex >= 0) {
//     todos[todoIndex] = {
//       id: params.todoId,
//       text: data.text,
//     };
//     ctx.response.body = todos;
//   } else {
//     ctx.response.body = "Todo not found";
//   }
// });

// // OK!
// router.delete("/todos/:todoId", (ctx) => {
//   const params = ctx.params as RequestParams;
//   const todoIndex = todos.findIndex((item) => item.id === params.todoId);
//   if (todoIndex >= 0) {
//     todos = todos.filter((item) => item.id !== params.todoId);
//     ctx.response.body = todos;
//   } else {
//     ctx.response.body = "Todo not found";
//   }
// });

// export default router;

//---------------------------------------------------------------

import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import {
  getTodos,
  getSingleTodo,
  addTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoControllers.ts";
const router = new Router();

//
router.get("/todos", getTodos);
router.get("/todos/:todoId", getSingleTodo);
router.post("/todos", addTodo);
router.put("/todos/:todoId", updateTodo);
router.delete("/todos/:todoId", deleteTodo);

export default router;
