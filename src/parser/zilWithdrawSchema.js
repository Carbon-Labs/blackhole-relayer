const schema = require("./sharedSchema");
const json = {
    type: "object",
    properties: {
        amount: {type: "string"},
        ...schema
    },
    additionalProperties: false,
    required: ["amount", "nullifier", "recipient", "pi_a", "pi_b_1", "pi_b_2", "pi_b_3", "pi_c", "publicSignals", "treeIndex"]
};

module.exports = json;