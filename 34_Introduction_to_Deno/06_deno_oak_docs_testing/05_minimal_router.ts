/*
Example server
---------------
A minimal router server which responds with content on "/". 
With Deno CLI this will listen on port 8080 and on Deploy, 
this will simply serve requests received on the application. */

import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();

router.get("/", (ctx) => {
  ctx.response.body = `<!DOCTYPE html>
    <html>
      <head><title>Hello oak!</title><head>
      <body>
        <h1>Hello oak!</h1>
      </body>
    </html>
  `;
});

router.get("/home", (ctx) => {
  ctx.response.body = `<!DOCTYPE html>
    <html>
      <head><title>Hello oak!</title><head>
      <body>
        <h1>Home of oak!</h1>
      </body>
    </html>
  `;
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8080 });
