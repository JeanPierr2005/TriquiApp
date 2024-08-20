import express from "express";
import { createServer } from "node:http";
import { Server, Socket } from "socket.io";
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
  socket.on("createRoom", (args, callback) =>
    createRoom(socket, callback, args)
  );
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

function createRoom(socket: Socket, callback: Function, args: createRoomArgs) {
  const newRoom = new Room(args);
  newRoom.id = idNextRoom;
  idNextRoom++;
  rooms.push(newRoom);
  joinRoom(socket, callback, {
    id: newRoom.id,
    playerName: args.playerName,
  });
}

/**Une a un jugar a una sala */
function joinRoom(socket: Socket, callback: Function, args: joinRoomArgs) {
  if (!rooms.length)
    return callback({ exito: false, message: "No exiten salas" });
  const roomIndex = rooms.findIndex((room) => room.id === args.id);
  if (roomIndex === -1)
    return callback({
      exito: false,
      message: "No existe sala con ID" + args.id,
    });
  if (rooms[roomIndex].player[0].name && rooms[roomIndex].player[1].name)
    return callback({
      exito: false,
      message: "La sala esta ocupada",
    });
  rooms[roomIndex].addPlayer(args.playerName);
  socket.join("room-" + rooms[roomIndex].id);
  return callback({
    exito: true,
    message: "Unido a la sala " + rooms[roomIndex].id,
    room: rooms[roomIndex].getRoom(),
  });
}
