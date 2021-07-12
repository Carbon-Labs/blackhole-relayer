const Ajv = require("ajv");
const ajv = new Ajv();

const zilWithdrawSchema = require("./zilWithdrawSchema");
const zrc2WithdrawSchema = require("./zrc2WithdrawSchema");

const zilParser = ajv.compile(zilWithdrawSchema);
const zrc2Parser = ajv.compile(zrc2WithdrawSchema);

module.exports = Object.freeze({
    parseZil: (body) => {
        const data = zilParser(body);
        if (!data) {
            throw new Error("Invalid withdraw object");
        }
        return data;
    },
    parseZrc2: (body) => {
        const data = zrc2Parser(body);
        if (!data) {
            throw new Error("Invalid withdraw object");
        }
        return data;
    }
})