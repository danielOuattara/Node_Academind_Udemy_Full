const { writeFile } = require("fs");

function requestHandler(req, res) {
  const url = req.url;
  const method = req.method;
  res.setHeader("Content-Type", "text/html");

  if (url === "/") {
    res.write(`
        <html>
            <head>
                <title>Enter Message</title>
            </head>
            <body>
                <form action='/message' method='POST'>
                    <input type='text' name='message'/>
                    <input type='submit' value='send Message'/>
                </form>
            </body>
        </html>`);
    res.end();
  } else if (url == "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      console.log("chunk ==", chunk);
      body.push(chunk);
    });

    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      console.log(parsedBody);
      const message = parsedBody.split("=")[1].replace(/\++/g, " ");
      writeFile("message.txt", `${message}\n`, { flag: "a" }, (err, data) => {
        if (err) console.log(err);
        res.statusCode = 302;
        res.writeHead(302, { Location: "/" });
        res.end();
      });
    });
  } else {
    // res.setHeader('Content-Type', 'text/html');
    res.write("<html>");
    res.write("<head><title>My first page</title></head>");
    res.write("<body><h1>Hello Node.js </h1></body>");
    res.write("</html>");
    res.end();
  }
}

module.exports = requestHandler;

// module.exports = {
//     requestHandler,
//     someText: "Some text"
// };

// module.exports.handler = requestHandler;
// module.exports.someText = 'Some Text';

// exports.handler = requestHandler;
// exports.someText = 'Some Text';
