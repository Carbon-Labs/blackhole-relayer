require('dotenv').config();
const winston = require('winston');
const expressWinston = require('express-winston');
const Controller = require("./src/controller");
const Router = require("./src/api");

const http = require('http');
const express = require('express');
const rateLimit = require("express-rate-limit");
const app = express();
const cors = require('cors');
const {Server} = require("socket.io");
const pubSub = require("./pupSub");

app.set('trust proxy', 1);

const whitelist = ["http://localhost:8081", "https://blackhole.carbontoken.info"];
const corsOptionsDelegate = (req, callback) => {
    let corsOptions = {origin: false};
    const isDomainAllowed = whitelist.indexOf(req.header('origin') || req.get('origin')) !== -1;
    console.log(req.header('origin') || req.get('origin'), "isDomainAllowed:", isDomainAllowed);
    if (isDomainAllowed) {
        // Enable CORS for this request
        corsOptions = {origin: true}
    }
    callback(null, corsOptions)
};
app.use(cors(corsOptionsDelegate));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    ),
    meta: false,
    msg: "HTTP  {{req.method}} {{req.url}} {{req.body}}",
    expressFormat: true,
    colorize: false,
    ignoreRoute: function (req, res) {
        return false;
    }
}));

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:8081", "https://blackhole.carbontoken.info"],
        methods: ["GET", "POST"],
        credentials: true
    },
    pingTimeout: 60000,
});

(async () => {
    const controller = Controller(io);
    const router = Router(controller);
    app.use("/", router);

    io.on('connection', (socket) => {
        socket.on('JOIN_RELAYER', async ({txId}) => {
            socket.join(txId);
            console.log("client join relayer: ", txId);
        });
        socket.on('disconnect', () => io.sockets.connected[socket.id].disconnect());
    });

    pubSub.on("RELAYE_COMPLETE", (data) => {
        io.to(data.uuid).emit("RELAYE_COMPLETE", data);
    });

    pubSub.on("RELAYE_FAILED", (data) => {
        io.to(data.uuid).emit("RELAYE_FAILED", data);
    });

    httpServer.listen(process.env.PORT, (error) => {
        if (error) {
            return console.log(error);
        }
        console.log("Server started at port:", process.env.PORT);
    });
})();