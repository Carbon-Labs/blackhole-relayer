const blackhole = require("./blackhole");

module.exports = async (privateKey) => blackhole.client.proxy().getToProof(blackhole.client.share({privateKey}).getWalletAddress());