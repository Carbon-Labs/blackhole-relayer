const path = require("path");
require('dotenv').config({
    path: path.resolve(__dirname, "../../.env")
});
const queue = require("./queue");
const {status} = require("./constants");
const createWithdraw = require("../business/createWithdraw");
const blackhole = require("../business/blackhole");
const {blockchain, privateKey, proxyContract} = require("../../config");
const proxy = blackhole.client.proxy({
    privateKey,
    blockchain,
    isTest: process.env.NODE_ENV !== "production",
    proxyContract
});
const pubSub = require("../../pupSub");
let currentJob;

const updateTxHash = async (txHash) => {
    console.log(`A new successfully sent tx ${txHash}`);
    currentJob.data.txHash = txHash;
    await currentJob.update(currentJob.data);
}

const updateStatus = async (status) => {
    console.log(`Job status updated ${status}`);
    currentJob.data.status = status;
    await currentJob.update(currentJob.data);
};

(async () => {
    console.log(`Start relayer worker`);
    queue.withdrawJob.queue.process(async (job) => {
        currentJob = job;
        console.log(`Start sent withdraw transaction ${job.data.uuid}`);
        currentJob = job;
        const {data} = job;
        try {
            const params = data.token_address ? createWithdraw.zrc2Withdraw(data) : createWithdraw.zilWithdraw(data);
            const tx = data.isZRC2 ? await proxy.WithdrawToken(params) : await proxy.WithdrawZil(params);
            await updateTxHash('0x' + tx.id);
            await updateStatus(status.ACCEPTED);
            pubSub.emit("RELAYE_COMPLETE", await queue.withdrawJob.getStatus(data.uuid));
        } catch (e) {
            console.log(e);
            pubSub.emit("RELAYE_FAILED", await queue.withdrawJob.getStatus(data.uuid));
            throw new Error(e.message);
        }
    });
})();