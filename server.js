// server.js
const { createServer } = require("http");
const next = require("next");
const { Server: SocketServer } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const io = new SocketServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  let latestLocation = null;
  let locationHistory = [];

  io.on("connection", (socket) => {
    console.log("📡 Client terhubung:", socket.id);

    if (latestLocation) {
      socket.emit("location-update", latestLocation);
      socket.emit("location-history", locationHistory);
    }

    socket.on("send-location", (data) => {
      console.log("📍 Lokasi diterima:", data.lat, data.lng);

      latestLocation = {
        ...data,
        timestamp: Date.now(),
      };

      locationHistory.push(latestLocation);
      if (locationHistory.length > 100) {
        locationHistory.shift();
      }

      io.emit("location-update", latestLocation);
      io.emit("location-history", locationHistory);
    });

    socket.on("disconnect", () => {
      console.log("📡 Client disconnect:", socket.id);
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log("📡 Socket.IO running");
  });
});
