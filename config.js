module.exports = Object.freeze({
    privateKey: process.env.PRIVATE_KEY,
    redisUrl: process.env.REDIS_URL,
    port: process.env.PORT,
    blockchain: {
        api: process.env.ZILLIQA_NODE_API
    }
});