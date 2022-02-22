const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");   // cross origin requests

const io = require("socket.io")(server, {
    cors: {
        origin: "*",    // allow access from all origins
        methods: ["GET", "POST"]
    }
});

app.use(cors());

const PORT = process.env.PORT || 5000;   // or localhost 5000

app.get("/", (req, res) => {    // route
    res.send('Server is running.')
});

io.on('connection', (socket) => {   // realtime data transmission
    socket.emit('me', socket.id);  // local user
    socket.on('disconnect', () => {
        socket.broadcast.emit("callended")
    });
    
    socket.on("calluser", (userToCall, signalData, from, name) => {   // data from front end
        io.to(userToCall).emit("calluser", { signal: signalData, from, name });
    });

    socket.on("answercall", (data) => {
        io.to(data.to).emit("callaccepted", data.signal);
    });
});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));