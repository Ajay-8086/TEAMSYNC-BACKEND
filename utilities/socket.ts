// socketUtil.ts
import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

interface UserSocketMap {
  [userId: string]: string; // Map userId to socketId
}

export const userSocketMap: UserSocketMap = {}; 

export let io: Server;

export const initializeSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: '*',
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log('A user connected', socket.id);

    socket.on('registerUser', (userId: string) => {
      userSocketMap[userId] = socket.id;

    });

    socket.on('disconnect', () => {
      console.log('A user disconnected', socket.id);
      for (const [userId, socketId] of Object.entries(userSocketMap)) {
        if (socketId === socket.id) {
          delete userSocketMap[userId];
          console.log(`User disconnected: ${userId}`);
          break;
        }
      }
    });

    socket.on('sendInvitation', (data) => {
      console.log('Invitation data received on server:', data);
      const socketId = userSocketMap[data.userId];
      if (socketId) {
        io.to(socketId).emit('receiveInvitation', data.invitation);
      } else {
        console.log(`User with ID ${data.userId} is not connected`);
      }
    });
  });
};
