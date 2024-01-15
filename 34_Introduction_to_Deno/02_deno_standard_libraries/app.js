/* in Node.js environment 
-------------------------- */
const http = require("http");

const server_node = http.createServer((req, res) => {
  return res.end("<h1>Welcome, in NodeJs environment</>");
});

server_node.listen(3100, () => {
  console.log(`Server is running on http://localhost:3100`);
});

/* in Deno environment
------------------------ */

// import { createServer } from "node:http";

// const server = createServer((req, res) => {
//   res.end("Welcome");
// });

// server.listen(3100, () => {
//   console.log(`Server is running on http://localhost:3200`);
// });
