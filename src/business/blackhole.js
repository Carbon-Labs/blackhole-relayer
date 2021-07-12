const Blackhole = require("blackhole-sdk");
const fetchNode = require("node-fetch");
module.exports = Blackhole(fetchNode);