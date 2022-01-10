
const http = require('http');
const requestHandler = require('./routes')
const server = http.createServer(requestHandler);

const PORT = 5500;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});