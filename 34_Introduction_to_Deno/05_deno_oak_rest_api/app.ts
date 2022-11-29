import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import router from "./routes/todoRoutes.ts";

const app = new Application();

app.use(async (_ctx, next) => {
  console.log("A middleware");
  await next();
});
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8080 });
