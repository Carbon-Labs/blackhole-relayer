const parser = require("../parser");
const checkProof = require("../business/checkProof");
const queue = require("../worker/queue");
const blackhole = require("../business/blackhole");
const {privateKey, blockchain, proxyContract} = require("../../config");
const proxy = blackhole.client.proxy({proxyContract, blockchain});
module.exports = (io) => Object.freeze({
    withdraw: async ({body, type}) => {
        const proof = type === "ZIL" ? parser.parseZil(body) : parser.parseZrc2(body);
        const zils = await proxy.getZilBlackhole();
        const zilBlackhole = type === "ZIL" && zils.find(({amount}) => proof.amount.toString() === amount.toString());
        if (await checkProof({
            proof: {
                ...proof,
                contract_amount: zilBlackhole && type === "ZIL" ? zilBlackhole.contract_address : proof.contract_amount,
            },
            relayer: blackhole.client.share({privateKey, blockchain}).getWalletAddress(),
        })) {
            proof.isZRC2 = type !== "ZIL";
            return queue.withdrawJob.add(proof);
        } else {
            throw new Error("Invalid withdraw proof");
        }
    },
    getTxStatus: async ({txId}) => {
        return queue.withdrawJob.getStatus(txId);
    }
});