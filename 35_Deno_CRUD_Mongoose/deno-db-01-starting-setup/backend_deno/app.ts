import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import todosRoutes from "./routes/todos.ts";
import { connectToDB } from "./database/connect.ts";

const app = new Application();

app.use(async (_ctx, next) => {
  console.log("Middleware!");
  await next();
});

app.use(async (ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE",
  );
  ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  await next();
});
app.use(todosRoutes.routes());
app.use(todosRoutes.allowedMethods());

connectToDB()
  .then(() => {
    app.listen({ hostname: "localhost", port: 8080 });
  })
  .then(() => console.log("App is running on port 8080"))
  .catch((err) => console.log(err));
