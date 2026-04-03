console.log("DEBUG: Script started");
const http = require('http');
console.log("DEBUG: http loaded");
const https = require('https');
console.log("DEBUG: https loaded");
const fs = require('fs');
console.log("DEBUG: fs loaded");
const path = require('path');
console.log("DEBUG: path loaded");

const PORT = 8001;

try {
    const server = http.createServer((req, res) => {
        console.log(`DEBUG: Request received: ${req.url}`);
        res.end("OK");
    });
    console.log("DEBUG: server created");

    server.listen(PORT, '0.0.0.0', () => {
        console.log(`DEBUG: Server listening on port ${PORT}`);
    });
} catch (err) {
    console.error("DEBUG: Error during server creation:", err);
}

console.log("DEBUG: End of script reached");
