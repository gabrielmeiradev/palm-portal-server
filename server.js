var net = require("net");
var fs = require("fs");

let date = new Date(),
  size = 0,
  elapsed,
  connected = 0,
  writer,
  socketToken,
  wrongToken = false;
const DEPLOY_TOKEN = "FUCK";

var server = net.createServer(function (socket) {
  socket.on("connect", () => {
    if (connected > 1) {
      socket.end();
    }

    console.log("Client connected");
    connected++;
  });

  socket.once("data", (data) => {
    socketToken = data.toString();

    if (socketToken != DEPLOY_TOKEN) {
      wrongToken = true;
      socket.write(
        "Socket disconnected because the token provided is incorrect"
      );
      socket.end();
      return;
    }
  });

  socket.on("data", (chunk) => {
    if (wrongToken) return;

    if (!writer) {
      if (fs.existsSync("output.zip")) {
        fs.unlinkSync("output.zip");
      }
      writer = fs.createWriteStream("output.zip");
    }
    size += chunk.length;
    elapsed = new Date() - date;
    process.stdout.write(
      `\r${(size / (1024 * 1024)).toFixed(
        2
      )} MB of data was sent. Total elapsed time is ${elapsed / 1000} s`
    );
    writer.write(chunk);
  });

  socket.on("end", () => {
    if (wrongToken) {
      console.error(
        "Socket disconnected because the token provided is incorrect"
      );
    } else {
      console.log(
        `\nFinished getting file. speed was: ${(
          size /
          (1024 * 1024) /
          (elapsed / 1000)
        ).toFixed(2)} MB/s`
      );
    }
    size = elapsed = connected = 0;
  });
});

server.listen(1337, () => {
  console.log("Server started on port 1337");
});
