const http = require('http');
const { writeFile } = require('fs');

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;
    res.setHeader('Content-Type', 'text/html');

    
    if (url === '/') {
        res.writeHeader(200,{ "Content-Type": "text/html; charset=utf-8"});
        res.write("Welcome to NodeJS !")
        res.write(`            
            <html>
                <title>Create User</title>
                <meta charset = "UTF-8">
                <head>
                    <style> form {
                        margin: 20px;
                        border: 2px solid green;
                        padding: 10px;
                        width: 60%;
                    }</style>
                </head>
                <body>
                    <form action='/create-user' method='POST'>
                        <input type='text' name='username' placeholder='Enter a username' required/>
                        <input type='submit' value='Create user'/>
                    </form>
                </body>
            </html> `
        );
       return res.end();
    }  

    if (url === '/users') {
        res.writeHeader(200, {
            "Content-Type": "text/html; charset=utf-8"
        });
        res.write(`
        <html>
            <title> Welcome </title>
            <head>
                <style>
                    ul {
                        list-style-type:none;
                        font-size:22px
                    } 
                    li {
                        margin: 10px;
                        padding: 10px;
                        width: 50%;
                    } 
                    li:nth-child(even) {
                        background-color: lightgreen;
                    } 
                    li:nth-child(odd) {
                        background-color: lightblue;
                    } 
                </style>
            </head>
            <body>
                <ul>
                    <li>Max</li>
                    <li>Manu</li>
                    <li>Daniel</li>
                    <li>Julie</li>
                </ul>
            <body>
        </html>  `);
        return res.end();
    }

    if (url === '/create-user' && method === 'POST') {
        const body = [];

        req.on('data', (chunk) => {
            body.push(chunk);
        });

        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const username = parsedBody.split("=")[1].replace(/\++/g, " ");
            console.log(username);
            writeFile('usernames.txt', `${username}\n`, { flag: 'a' }, (err, data) => {
                if (err) console.log(err)
                res.statusCode = 302;
                res.writeHead(302, { 'Location': '/' });
                return res.end();
            });
        })
    }
    
});

const PORT = process.env.port || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});
