
// const http = require('http');

// const server = http.createServer((req, res) => {
//     res.end("Welcome");
// });

// const PORT = 5500;
// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`)
// });

//------------------------------------------------------------

// const http = require('http');

// const server = http.createServer((req, res) => {
//     console.log(req.url, req.method, req.headers);
//     res.setHeader('Content-Type', 'text/html');
//     res.write("<h1>Hello Node.js </h1>")
//     res.end();
// });

// const PORT = 5500;
// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`)
// });

//------------------------------------------------------------

/* Synchronous
---------------- */

// const http = require('http');
// const { writeFileSync } = require ('fs')

// const server = http.createServer((req, res) => {
//     const url = req.url;
//     const method = req.method;
//     res.setHeader('Content-Type', 'text/html');
//     if (url === "/") {
        // res.write("<html>");
        // res.write("<head><title>Enter Message</title></head>");
        // res.write("<body><form action='/message' method='POST'><input type='text' name='message'/><input type='submit' value='send Message'/></form></body>")
        // res.write("</html>")
//         res.end();
    
//     } else if(url =='/message' && method === 'POST') {
//         const body = [];
//         req.on('data', (chunk) => {
//             console.log("chunk ==", chunk)
//             body.push(chunk)
//         });
//         req.on('end', () => {
//             const parsedBody = Buffer.concat(body).toString();
//             const message = parsedBody.split("=")[1].replace(/\++/g, " ");
//             writeFileSync('message.txt', message, {flag: 'a'});
//             res.statusCode = 302;
//             res.writeHead(302, { 'Location': '/'});
//             res.end();
//         });

//     } else {   
//         res.write("<html>");
//         res.write("<head><title>My first page</title></head>");
//         res.write("<body><h1>Hello Node.js </h1></body>")  
//         res.write("</html>")
//         res.end();
//     }
// });

// const PORT = 5500;
// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`)
// });

//------------------------------------------------------------

/* Asynchronous
---------------- */

// const http = require('http');
// const { writeFile } = require ('fs')

// const server = http.createServer((req, res) => {
//     const url = req.url;
//     const method = req.method;
//     res.setHeader('Content-Type', 'text/html');
//     if (url === "/") {
//         res.write("<html>");
//         res.write("<head><title>Enter Message</title></head>");
//         res.write("<body><form action='/message' method='POST'><input type='text' name='message'/><input type='submit' value='send Message'/></form></body>")
//         res.write("</html>")
//         res.end();
    
//     } else if(url =='/message' && method === 'POST') {
//         const body = [];
//         req.on('data', (chunk) => {
//             console.log("chunk ==", chunk)
//             body.push(chunk)
//         });
//         req.on('end', () => {
//             const parsedBody = Buffer.concat(body).toString();
//             const message = parsedBody.split("=")[1].replace(/\++/g, " ");

//             writeFile('message.txt', `${message}\n`, {flag: 'a'}, (err, data) => {
//                 if(err) console.log(err)
//                 res.statusCode = 302;
//                 res.writeHead(302, { 'Location': '/'});
//                 res.end();
//             });
//         });

//     } else {   
//         // res.setHeader('Content-Type', 'text/html');
//         res.write("<html>");
//         res.write("<head><title>My first page</title></head>");
//         res.write("<body><h1>Hello Node.js </h1></body>")  
//         res.write("</html>")
//         res.end();
//     }
// });

// const PORT = 5500;
// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`)
// });



const http = require('http');
const requestHandler = require('./routes')
const server = http.createServer(requestHandler);


const PORT = 5500;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});