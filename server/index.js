console.log(`Server starting 🟠️`);
const startTime = performance.now()
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const net = require("net").createServer()

net.on("connection", (socket) => {
    console.log(`New socket connetion: ${socket.remoteAddress}`);
})

http.listen(3000, () => {
    console.log(`HTTP server started 🟢️ (Took ${Math.round((performance.now() - startTime)*100)/100}ms)`);
});

net.listen(3001, () => {
    console.log(`TCP server started 🟢️ (Took ${Math.round((performance.now() - startTime)*100)/100}ms)`);
})