/*  january 2024
------------------- */

Deno.serve((_req) => new Response("Hello, world"));

//------------------------------------------------------

// Deno.serve(
//   { port: 3000, hostname: "0.0.0.0" },
//   (_req) => new Response("Hello, world"),
// );

//-------------------------------------------------------

// const ac = new AbortController();

// const server = Deno.serve(
//   { signal: ac.signal },
//   (_req) => new Response("Hello, world again !"),
// );
// server.finished.then(() => console.log("Server closed"));

// console.log("Closing server...");
// ac.abort();

//---------------------------------------------------------

// Deno.serve({ port: 3000 }, (request: Request) => {
//   console.log("request = ", request);
//   return new Response("Hello, world!");
// });

// ---------------------------------------------------------

// Deno.serve((request: Request) => {
//   console.log("request = ", request, `\n\n`);
//   const response = new Response("<h1>Hello, world</h1>");
//   response.headers.set("Content-Type", "text/html");
//   console.log("response = ", response);
//   return response;
// });
