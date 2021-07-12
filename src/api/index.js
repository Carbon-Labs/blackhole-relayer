const express = require("express");
const Router = express.Router();
const Controller = require("../controller");

module.exports = (controller = Controller()) => {
    Router.post("/withdraw/zil", async ({body}, res) => {
        try {
            const id = await controller.withdraw({body, type: "ZIL"});
            res.json({id});
        } catch (err) {
            res.status(400).json({message: err && err.message ? err.message : "Error"});
        }
    });
    Router.post("/withdraw/zrc2", async ({body}, res) => {
        try {
            const id = await controller.withdraw({body, type: "ZRC2"});
            res.json({id});
        } catch (err) {
            res.status(400).json({message: err && err.message ? err.message : "Error"});
        }
    });
    Router.get("/tx/status/:txId", async ({params}, res) => {
        try {
            const status = await controller.getTxStatus({txId: params.txId});
            res.json(status);
        } catch (err) {
            res.status(400).json({message: err && err.message ? err.message : "Error"});
        }
    });
    return Router;
};