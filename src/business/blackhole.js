const Blackhole = require("blackhole-sdk");
const fetchNode = require("./fetchCache");
const {blockchain, privateKey} = require("../../config");
module.exports = Blackhole({
    request: fetchNode,
    privateKey,
    blockchain,
    isTest: process.env.NODE_ENV !== "production"
});