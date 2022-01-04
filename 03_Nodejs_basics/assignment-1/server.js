const http = require('http');
const handleRequest = require("./routes");

const server = http.createServer(handleRequest);

const PORT = process.env.port || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});
