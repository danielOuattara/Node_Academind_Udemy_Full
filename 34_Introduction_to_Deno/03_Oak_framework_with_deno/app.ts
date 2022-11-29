import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";

const app = new Application();

app.use((ctx) => {
  ctx.response.body = "Hello World !";
});

await app.listen({ port: 8000 });

/* ======================================================================

Resolved Dependency
------------------------
Code: https​://deno.land/x/oak/mod.ts

A middleware framework for handling HTTP with Deno.

"oak" works well on both Deno CLI and Deno deploy, 
and is inspired by koa. 

It works well with both the Deno CLI and Deno Deploy.

Example server
---------------
A minimal router server which responds with content on "/". 
With Deno CLI this will listen on port 8080 and on Deploy, 
this will simply serve requests received on the application. */

// import { Application, Router } from "https://deno.land/x/oak/mod.ts";

// const router = new Router();
// router.get("/", (ctx) => {
//   ctx.response.body = `<!DOCTYPE html>
//     <html>
//       <head><title>Hello oak!</title><head>
//       <body>
//         <h1>Hello oak!</h1>
//       </body>
//     </html>
//   `;
// });

// router.get("/home", (ctx) => {
//   ctx.response.body = `<!DOCTYPE html>
//     <html>
//       <head><title>Hello oak!</title><head>
//       <body>
//         <h1>Home of oak!</h1>
//       </body>
//     </html>
//   `;
// });

// const app = new Application();
// app.use(router.routes());
// app.use(router.allowedMethods());

// await app.listen({ port: 8080 });

/*
Using Deno's flash server
----------------------------
Currently, Deno's flash server is not the default, 
even with the --unstable flag. In order to use 
the flash server, you need to provide the 
{@linkcode FlashServer} to the {@linkcode Application} 
constructor:*/

// TODO: not working; The flash bindings for serving HTTP are not available.

// import { Application, FlashServer } from "https://deno.land/x/oak/mod.ts";
// const app = new Application({ serverConstructor: FlashServer });
// app.use((ctx) => {
//   ctx.response.body = "Hello World !";
// });
// app.listen({ port: 8080 });

/*
Note the currently Deno's flash server requires 
the --unstable flag. If it isn't present, 
the application will error on listening.

Follow link (ctrl + click)

Implicitly using latest version (v11.1.0) for
 https://deno.land/x/oak/mod.tsdeno(deno-warn)

The import of "https://deno.land/x/oak/mod.ts" 
was redirected to "https://deno.land/x/oak@v11.1.0/mod.ts".deno(redirect)

*/
