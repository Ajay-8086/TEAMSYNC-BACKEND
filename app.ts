import express from 'express';
import dotenv from 'dotenv';
import dbConnect from './config/config';
import cors from 'cors';
import http from 'http';
import userRouter from './routers/userRouter';
import { initializeSocket } from './utilities/socket';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Creating server
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);
// Middlewares
app.use(express.json());
app.use(cors());

// User routes
app.use('/', userRouter);

// Connect to the database and start the server
dbConnect().then(() => {
    server.listen(port, () => {
        console.log(`Server listening at port ${port}`);
    });
}).catch(err => {
    console.error('Failed to connect to the database:', err);
});
