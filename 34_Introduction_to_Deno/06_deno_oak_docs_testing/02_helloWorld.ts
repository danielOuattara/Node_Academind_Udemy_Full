import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";

const app = new Application();

// console.log(app);

// Logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

//Timing
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

// Hello World!

app.use((ctx) => {
  ctx.response.body = "Hello world!";
});

await app.listen({ port: 8000 });
