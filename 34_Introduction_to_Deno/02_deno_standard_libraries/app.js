const http = require("http");

const server = http.createServer((req, res) => {
  res.end("Welcome");
});

server.listen(3100, () => {
  console.log(`Server is running on http://localhost:3100`);
});
