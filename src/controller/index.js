const parser = require("../parser");
const checkProof = require("../business/checkProof");
const queue = require("../worker/queue");
const blackhole = require("../business/blackhole");
const {privateKey, blockchain} = require("../../config");

module.exports = (io) => Object.freeze({
    withdraw: async ({body, type}) => {
        const proof = type === "ZIL" ? parser.parseZil(body) : parser.parseZrc2(body);
        if (await checkProof({
            proof,
            relayer: blackhole.client.share({privateKey, blockchain}).getWalletAddress(),
        })) {
            return queue.withdrawJob.add(proof);
        } else {
            throw new Error("Invalid withdraw proof");
        }
    },
    getTxStatus: async ({txId}) => {
        return queue.withdrawJob.getStatus(txId);
    }
});