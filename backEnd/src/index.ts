import express from "express";
import { createServer } from "node:http";
import { Server, Socket } from "socket.io";
import { Room } from "./clases/room";
import { createRoomArgs, joinARoomArgs } from "./interfaces/createRoom";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
global.io = io;

server.listen(3000, () => {
    console.log("Server esta en el puerto 3000");
});

let rooms: Room[] = [];
let idNextRoom = 0;

io.on("connection", (socket) => {
    console.log("Nueva Conexion");

    socket.on("findRoom", (callback) => searchPublicRoom(callback));
    socket.on("createRoom", (args, callback) =>
        createRoom(socket, callback, args)
    );
    socket.on("joinARoom", (args, callback) =>
        joinARoom(socket, callback, args)
    );
    socket.on("disconnecting", () => {
        if (socket.rooms.size < 2) return;
        const roomPlayer = rooms.find(
            (room) => room.id == parseInt([...socket.rooms][1].substring(5))
        );
        if (!roomPlayer) return;
        roomPlayer?.abandonmentPlayer();
        socket.conn.close();
        rooms = rooms.filter((room) => room.id !== roomPlayer.id);
        console.log(
            "Acabo de cerrar la sala",
            roomPlayer.id,
            ", ahora las salas son",
            rooms
        );
    });
    socket.on("play", (args) => {
        console.log(
            "Mirando el registro de una jugada",
            args,
            searchRoom(args.roomId)
        );
        searchRoom(args.roomId)?.play(args.player, args.position);
    });

    socket.on("newRound", (args) => {
        console.log(
            "Mirando para empezar una nueva ronda",
            args,
            searchRoom(args.roomId)
        );
        searchRoom(args.roomId)?.newRound();
    });
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
    const newRoom = new Room(args, socket);
    newRoom.id = idNextRoom;
    idNextRoom++;
    rooms.push(newRoom);
    joinARoom(socket, callback, {
        id: newRoom.id,
        playerName: args.playerName,
    });
}

/**Une a un jugar a una sala */
function joinARoom(socket: Socket, callback: Function, args: joinARoomArgs) {
    console.log("Uniendo a sala", args);

    if (!rooms.length)
        return callback({ exito: false, message: "No exiten salas" });
    const roomIndex = rooms.findIndex((room) => room.id === args.id);
    if (roomIndex === -1)
        return callback({
            exito: false,
            message: "No existe sala con ID " + args.id,
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

function searchRoom(id: number) {
    return rooms.find((room) => room.id === id);
}
