const express = require("express");
const mongoose = require('mongoose');
const routes = require("../routes/routes.js")
const app = express();
const http = require('http');
const cors = require('cors');
app.use(express.json());
app.use(cors());
const PORT = 5000;
const MONGO_URI = "mongodb+srv://vasylshlapak14:IeuLQZD4cYou0dIp@cluster0.xu6uy.mongodb.net/Games_DB?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log("Database Connection Error:", err));

const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});
app.io = io
app.use('/api', routes);

app.use((req,res,next) => {
    res.setHeader("Content-Security-Policy",
        "default-src 'self'; " +
        "object-src 'none';" +
        " style-src 'self' 'unsafe-inline';" +
        "require-trusted-types-for 'script'");
    next();
})

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('gameAdded', (game) => {
        io.emit('gameUpdated', game);
    });

    socket.on('gameUpdated', (game) => {
        io.emit('gameUpdated', game);
    });

    socket.on('gameDeleted', (gameId) => {
        io.emit('gameDeleted', gameId);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});