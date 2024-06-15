import express from 'express';
import dotenv from 'dotenv';
import dbConnect from './config/config';
import cors from 'cors';
import http from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import userRouter from './routers/userRouter';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // Default to port 3000 if not specified

// Creating server
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

// Middlewares
app.use(express.json());
app.use(cors());

// User routes
app.use('/', userRouter);

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'somethind'

// setting the user and the socket id 
const userSocket = new Map()

// Socket.IO middleware for authentication
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
        jwt.verify(token, JWT_SECRET, (err:any, decoded:any) => {
            if (err) return next(new Error('Authentication error'));
            socket.data.user = decoded;              
            next();
        });
    } else {
        next(new Error('Authentication error'));
    }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    userSocket.set(socket.data.user.userId,socket.id)
    console.log(userSocket,'user');

 
});

// Connect to the database and start the server
dbConnect().then(() => {
    server.listen(port, () => {
        console.log(`Server listening at port ${port}`);
    });
}).catch(err => {
    console.error('Failed to connect to the database:', err);
});
