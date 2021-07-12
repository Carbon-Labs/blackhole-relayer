module.exports = {
    nullifier: {type: "string"},
    recipient: {type: "string"},
    pi_a: {
        type: "array",
        items: {
          type: "string"
        },
        maxItems: 2,
        minItems: 2,
    },
    pi_b_1: {
        type: "array",
        items: {
            type: "string"
        },
        maxItems: 2,
        minItems: 2
    },
    pi_b_2: {
        type: "array",
        items: {
            type: "string"
        },
        maxItems: 2,
        minItems: 2
    },
    pi_b_3: {
        type: "array",
        items: {
            type: "string"
        },
        maxItems: 2,
        minItems: 2
    },
    pi_c: {
        type: "array",
        items: {
            type: "string"
        },
        maxItems: 2,
        minItems: 2
    },
    publicSignals: {
        type: "array",
        items: {
            type: "string"
        },
        maxItems: 6,
        minItems: 6
    },
    treeIndex: {type: "string"}
}