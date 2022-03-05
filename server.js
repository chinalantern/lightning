const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");   // cross origin requests

const io = require("socket.io")(server, {
	cors: {
		origin: "*",    // allow access from all origins
		methods: [ "GET", "POST" ]
	}
});

app.use(cors());

const PORT = process.env.PORT || 5000;  // or localhost 5000

app.get('/', (req, res) => {
	res.send('Running');
});

io.on("connection", (socket) => {   // realtime data transmission
    socket.emit("me", socket.id);   // local user

    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded")
    });

    socket.on("callUser", ({ userToCall, signalData, from, name }) => { // data from front end
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));