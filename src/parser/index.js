const Ajv = require("ajv");
const ajv = new Ajv();

const zilWithdrawSchema = require("./zilWithdrawSchema");
const zrc2WithdrawSchema = require("./zrc2WithdrawSchema");

const zilParser = ajv.compile(zilWithdrawSchema);
const zrc2Parser = ajv.compile(zrc2WithdrawSchema);

module.exports = Object.freeze({
    parseZil: (body) => {
        const isValid = zilParser(body);
        if (!isValid) {
            throw new Error("Invalid withdraw object");
        }
        return body;
    },
    parseZrc2: (body) => {
        const isValid = zrc2Parser(body);
        if (!isValid) {
            throw new Error("Invalid withdraw object");
        }
        return body;
    }
})