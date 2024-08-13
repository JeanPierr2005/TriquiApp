import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

server.listen(3000, () => {
  console.log("Server esta en el puerto 3000");
});
io.on("connection", (socket) => {
  console.log("Nueva Conexion");
});
