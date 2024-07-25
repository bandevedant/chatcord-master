const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const messageBox = require("./utils/messages");
const {
  userJoin,
  getCurrentuser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");
const app = express();
const server = http.createServer(app);

require('dotenv').config();
// Use Helmet to set various security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "geolocation=(self), microphone=()"); // Customize permissions as needed
  res.setHeader("Cache-Control", "no-store"); // Control caching behavior
  next();
});

app.use(express.static(path.join(__dirname, "public")));

const io = socketio(server);

io.on("connection", (socket) => {
  // console.log('new connection');
  socket.on("joinroom", ({ username, room }) => {
    const user = userJoin(username, room, socket.id);
    socket.join(user.room);

    socket.emit("message", messageBox("ChatBot", "Welcome to ChatCord"));

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        messageBox("ChatBot", `${user.username} has joined the chat.`)
      );
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  socket.on("chatMessage", (msg) => {
    // console.log(msg);
    const user = getCurrentuser(socket.id);

    io.to(user.room).emit("message", messageBox(user.username, msg));
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        messageBox("ChatBot", `${user.username} has left the chat room.`)
      );

      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const port = process.env.PORT;
server.listen(port, () => {
  console.log(`server started on port ${port}`);
});
