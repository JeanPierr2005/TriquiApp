import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { Room } from "./clases/room";
import { createRoomArgs, joinRoomArgs } from "./interfaces/createRoom";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

server.listen(3000, () => {
  console.log("Server esta en el puerto 3000");
});

const rooms: Room[] = [];
let idNextRoom = 0;

io.on("connection", (socket) => {
  console.log("Nueva Conexion");

  socket.on("findRoom", (callback) => searchPublicRoom(callback));
  socket.on("createRoom", (args, callback) => createRoom(callback, args));
});

/**Busca una sala disponible, si la encuentra devuelve el id y si no encuenta devuelve null */
function searchPublicRoom(callback: Function) {
  console.log("Buscando una sala publica");

  const disableRoom = rooms.find((room) => {
    if (!room.publica) return false;
    if (room.player[0].name && room.player[1].name) return false;
    return true;
  });
  callback(disableRoom ? disableRoom.id : null);
}

function createRoom(callback: Function, args: createRoomArgs) {
  console.log("Debo crear una sala con estos datos", args);
  const newRoom = new Room(args);
  newRoom.id = idNextRoom;
  idNextRoom++;
  rooms.push(newRoom);
  joinRoom(callback);
}

function joinRoom(callback: Function, args: joinRoomArgs) {
  if(!rooms.length) return callback({exito: false, message: "No exiten salas"})
  const roomIndex = rooms.findIndex(room => room.id === args.id)
  if(roomIndex === -1) return callback({exito: false, message: "No existe sala con ID" + args.id})
}
