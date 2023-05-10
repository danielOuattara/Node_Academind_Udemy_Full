// import { type RouterParamMiddleware } from "https://deno.land/x/oak@v12.4.0/router.ts";
// import { type RouterContext } from "https://deno.land/x/oak@v12.4.0/router.ts";
import { RouterContext } from "https://deno.land/x/oak/mod.ts";
import { TodoInterface } from "../models/todoModel.ts";

let todos: TodoInterface[] = [
  {
    id: "123456789",
    text: "walk around",
  },
  {
    id: "987654321",
    text: "feed the fish",
  },
];
type RequestBody = { text: string };
type RequestParams = { todoId: string };
//
type ctxType = RouterContext<
  "/todos",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

type ctxTypeTodoId = RouterContext<
  "/todos/:todoId",
  {
    todoId: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

// RouterContext<
//   "/todos",
//   Record<string | number, string | undefined>,
//   Record<string, any>
// >;

//
const getTodos = (ctx: ctxType) => {
  ctx.response.body = { todos };
};

// OK!
const getSingleTodo = (ctx: ctxTypeTodoId) => {
  const params = ctx.params as RequestParams;
  const todo = todos.find((item) => item.id === params.todoId);
  if (todo) {
    ctx.response.body = { todo: todo };
  } else {
    ctx.response.body = "Todo not found";
  }
};

// (Check)!
const addTodo = async (ctx: ctxType) => {
  const data = await ctx.request.body().value;
  const newTodo: TodoInterface = {
    id: Math.random().toString().split(".")[1],
    text: data.text,
  };

  todos.push(newTodo);
  ctx.response.body = { todo: newTodo };
};

// (Check)!
const updateTodo = async (ctx: ctxTypeTodoId) => {
  const data = await ctx.request.body().value;
  const params = ctx.params as RequestParams;
  const todoIndex = todos.findIndex((item) => item.id === params.todoId);
  if (todoIndex >= 0) {
    todos[todoIndex] = {
      id: params.todoId,
      text: data.text,
    };
    ctx.response.body = todos;
  } else {
    ctx.response.body = "Todo not found";
  }
};

// OK!
const deleteTodo = (ctx: ctxTypeTodoId) => {
  const params = ctx.params as RequestParams;
  const todoIndex = todos.findIndex((item) => item.id === params.todoId);
  if (todoIndex >= 0) {
    todos = todos.filter((item) => item.id !== params.todoId);
    ctx.response.body = todos;
  } else {
    ctx.response.body = "Todo not found";
  }
};

export { getTodos, getSingleTodo, addTodo, updateTodo, deleteTodo };
