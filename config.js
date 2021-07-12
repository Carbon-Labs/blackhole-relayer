module.exports = Object.freeze({
    privateKey: process.env.PRIVATE_KEY,
    redisUrl: process.env.REDIS_URL,
    port: process.env.PORT,
    blockchain: {
        api: process.env.ZILLIQA_NODE_API,
        websocket: process.env.ZILLIQA_NODE_WEBSOCKET_API,
        chainId: process.env.ZILLIQA_CHAIN_ID,
        msgVersion: 1,
    },
    proxyContract: process.env.PROXY_CONTRACT
});