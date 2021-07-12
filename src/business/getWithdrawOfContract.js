const blackhole = require("./blackhole");

module.exports = async ({isZRC2, contract_amount, nullifier}) => {
    const client = isZRC2 ? blackhole.client.zrc2 : blackhole.client.zil;
    const contract = client({address: contract_amount});
    return contract.getWithdraw(nullifier);
};