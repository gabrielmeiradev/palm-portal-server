
var net = require('net');
var fs = require('fs');

let date = new Date(), size = 0, elapsed;
let writer = fs.createWriteStream("output.zip");

var server = net.createServer(function(socket) {
    socket.on('connect', () => {
        console.log("Client connected");
    });
    socket.on('data', chunk => {
        size += chunk.length;
        elapsed = new Date() - date;
        process.stdout.write(`\r${(size / (1024 * 1024)).toFixed(2)} MB of data was sent. Total elapsed time is ${elapsed / 1000} s`);
        writer.write(chunk);
      });
      
      socket.on("end", () => {
        console.log(`\nFinished getting file. speed was: ${((size / (1024 * 1024)) / (elapsed / 1000)).toFixed(2)} MB/s`);
      });

});

server.listen(1337, () => {
    console.log("Server started on port 1337");
});