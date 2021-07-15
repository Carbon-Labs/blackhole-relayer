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
    currentJob.data.lastUpdateDate = new Date().toISOString();
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
            await updateStatus(status.QUEUED);
            const params = data.token_address ? createWithdraw.zrc2Withdraw(data) : createWithdraw.zilWithdraw(data);
            const callback = async (tx) => {
                await updateTxHash('0x' + tx);
                data.txHash = "0x" + tx;
                pubSub.emit("RELAYE_START", await queue.withdrawJob.getStatus(data.uuid));
            };
            data.isZRC2 ? await proxy.WithdrawToken(params, callback) : await proxy.WithdrawZil(params, callback);
            await updateStatus(status.ACCEPTED);
            pubSub.emit("RELAYE_COMPLETE", await queue.withdrawJob.getStatus(data.uuid));
        } catch (e) {
            await updateStatus(status.FAILED);
            console.log(e);
            pubSub.emit("RELAYE_FAILED", await queue.withdrawJob.getStatus(data.uuid));
            throw new Error(e.message);
        }
        await queue.withdrawJob.queue.clean(1000 * 60 * 60 * 24);
        await queue.withdrawJob.queue.clean(1000 * 60 * 60 * 24, 'failed');
    });
})();