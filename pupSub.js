const NRP = require('node-redis-pubsub');

const config = {
    url: process.env.REDIS_URL
};

module.exports = new NRP(config);