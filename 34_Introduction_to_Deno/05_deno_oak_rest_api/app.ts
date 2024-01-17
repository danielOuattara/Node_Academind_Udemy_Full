// import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
// import todoRoutes from "./routes/todoRoutes.ts";

// const app = new Application();

// app.use(async (_ctx, next) => {
//   console.log("A middleware");
//   await next();
// });

// app.use(todoRoutes.routes());
// app.use(todoRoutes.allowedMethods());

// await app.listen({ port: 3000 });

// import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
// import todoRoutes from "./routes/todoRoutes.ts";

// const app = new Application();

// app.use(async (_ctx, next) => {
//   console.log("A middleware");
//   await next();
// });

// // Version 1 routes
// app.use(todoRoutes.routes());
// app.use(todoRoutes.allowedMethods());

// // You can use a prefix for versioning, e.g., "/api/v1"
// const version1Prefix = "/api/v1";
// app.use(version1Prefix, todoRoutes.routes());
// app.use(version1Prefix, todoRoutes.allowedMethods());

// await app.listen({ port: 3000 });

//---------------------------------------------------------

import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import todoRoutes from "./routes/todoRoutes.ts";

const app = new Application();
const router = new Router();

app.use(async (_ctx, next) => {
  console.log("A middleware");
  await next();
});

// Version 1 routes with prefix "/api/v1"
const version1Prefix = "/api/v1";
router.use(version1Prefix, todoRoutes.routes());
router.use(version1Prefix, todoRoutes.allowedMethods());

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 3000 });
