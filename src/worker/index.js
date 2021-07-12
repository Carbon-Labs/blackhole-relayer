const queue = require("./queue");
const {status} = require("./constants");
const createWithdraw = require("../business/createWithdraw");
const blackhole = require("../business/blackhole");
const proxy = blackhole.client.proxy({});
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
    queue.withdrawJob.queue.process(async (job) => {
        currentJob = job;
        try {
            currentJob = job;
            const {data} = job;
            const params = data.isZRC2 ? createWithdraw.zrc2Withdraw(data) : createWithdraw.zilWithdraw(data);
            const tx = data.isZRC2 ? await proxy.WithdrawZil(params) : await proxy.WithdrawToken(params);
            await updateTxHash('0x' + tx.id);
            await updateStatus(status.ACCEPTED);
            pubSub.emit("RELAYE_COMPLETE", await queue.withdrawJob.getStatus(data.uuid));
        } catch (e) {
            throw new Error(e.message);
        }
    });
})();