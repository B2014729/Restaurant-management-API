import express from "express";
import RouterWeb from "./Routers/RouterWeb.js";
import MiddeleWareConfig from "./Configs/ConfigMiddelware.js";
import { Server } from "socket.io";
import http from 'http';


const StartServer = () => {
    try {
        const app = express();
        const server = http.createServer(app);

        const io = new Server(server, {
            cors: {
                origin: 'http://localhost:3001',
                methods: ['GET', 'POST'],
                credentials: true,
            }
        });

        io.on('connection', (socket) => {
            console.log("A client connected", socket.id);
        });

        app.use(function (req, res, next) {
            req.io = io;
            next();
        });

        MiddeleWareConfig(app);
        RouterWeb(app);                 //File chua tat ca cac khai bao route

        app.use((req, res) => {
            return res.status(404).json({
                statusCode: 404,
                message: "NotFound",
                data: []
            });
        });

        const PORT = 8000;
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}.`);
        });
    } catch (exception) {
        console.log(exception);
    }
}

StartServer();