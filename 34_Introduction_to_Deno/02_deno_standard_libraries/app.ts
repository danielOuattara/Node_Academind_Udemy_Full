/* 
Serves HTTP requests with the given handler.

You can specify an object with a port and hostname 
option, which is the address to listen on. 
The default is port 8000 on hostname "0.0.0.0".

The below example serves with the port 8000. */

// import { serve } from "https://deno.land/std@0.165.0/http/server.ts";
// serve((_req) => new Response("Hello, world"));

/* 
You can change the listening address by the hostname 
and port options. 

The below example serves with the port 3000. */

// import { serve } from "https://deno.land/std@0.165.0/http/server.ts";
// serve((_req) => new Response("Hello, world"), { port: 3000 });

/* 
serve function prints the message Listening on 
http://<hostname>:<port>/ on start-up by default. 

If you like to change this message, you can specify 
onListen option to override it. */

// import { serve } from "https://deno.land/std@0.165.0/http/server.ts";
// serve((_req) => new Response("Hello, world"), {
//   onListen({ port, hostname }) {
//     console.log(`Server started at http://${hostname}:${port}`);
//     // ... more info specific to your server ..
//   },
// });

/* 
You can also specify undefined or null to stop 
the logging behavior. */

// import { serve } from "https://deno.land/std@0.165.0/http/server.ts";
// serve((_req) => new Response("Hello, world"), { onListen: undefined });

// @param - handler The handler for individual HTTP requests.
// @param - options The options. See ServeInit documentation for details.

// import { serve } from "https://deno.land/std@0.165.0/http/server.ts";
// serve(function (_req) {
//   console.log("_req = ", _req);
//   const response = new Response("<h1>Hello, world</h1>");
//   console.log(response.body);
//   console.log(response.headers);
//   console.log(response.status);
//   console.log(response.statusText);
//   console.log(response.ok);
//   return response;
// });

/* deno 1.33.2 
-----------------------*/
// import { serve } from "https://deno.land/std@0.186.0/http/server.ts";
// serve((_req) => new Response("Hello, world"), { port: 8440 });

//-----------------

import { serve, Server } from "https://deno.land/std@0.186.0/http/server.ts";

serve(function (_req) {
  console.log("_req = ", _req);
  const response = new Response("<h1>Hello, world</h1>");
  response.headers.set("Content-Type", "text/html");
  console.log("response = ", response);
  return response;
});

//------------------------------------------------------------------------

// import { serve } from "https://deno.land/std@0.186.0/http/server.ts";
// serve(function (_req) {
//   console.log("_req = ", _req);
//   const response = new Response("<h1>Hello, world</h1>");
//   console.log(response.body);
//   console.log(response.headers);
//   console.log(response.status);
//   console.log(response.statusText);
//   console.log(response.ok);
//   return response;
// });
