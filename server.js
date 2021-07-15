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
        socket.on('JOIN_RELAYER', ({txId}) => {
            console.log("client join relayer: ", txId);
            socket.join(txId);
        });
    });

    pubSub.on("RELAYE_START", ({txHash, uuid}) => {
        io.to(uuid).emit("RELAYE_START", {txHash});
    });

    pubSub.on("RELAYE_COMPLETE", ({txHash, uuid}) => {
        io.to(uuid).emit("RELAYE_COMPLETE", {txHash});
    });

    pubSub.on("RELAYE_FAILED", ({txHash, uuid}) => {
        io.to(uuid).emit("RELAYE_FAILED", {txHash});
    });

    httpServer.listen(process.env.PORT, (error) => {
        if (error) {
            return console.log(error);
        }
        console.log("Server started at port:", process.env.PORT);
    });
})();