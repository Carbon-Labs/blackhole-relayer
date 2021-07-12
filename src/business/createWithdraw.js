const proofDataParams = (nullifier,
                         recipient,
                         pi_a,
                         pi_b_1,
                         pi_b_2,
                         pi_b_3,
                         pi_c,
                         publicSignals,
                         treeIndex) => [
    {
        vname: 'nullifier',
        type: 'Uint256',
        value: `${nullifier}`,
    },
    {
        vname: 'recipient',
        type: 'ByStr20',
        value: `${recipient}`,
    },
    {
        vname: 'pi_a',
        type: 'List Uint256',
        value: pi_a.map(point => point.toString()),
    },
    {
        vname: 'pi_b_1',
        type: 'List Uint256',
        value: pi_b_1.map(point => point.toString()),
    },
    {
        vname: 'pi_b_2',
        type: 'List Uint256',
        value: pi_b_2.map(point => point.toString()),
    },
    {
        vname: 'pi_b_3',
        type: 'List Uint256',
        value: pi_b_3.map(point => point.toString()),
    },
    {
        vname: 'pi_c',
        type: 'List Uint256',
        value: pi_c.map(point => point.toString()),
    },
    {
        vname: 'publicSignals',
        type: 'List Uint256',
        value: publicSignals.map(point => point.toString()),
    },
    {
        vname: 'treeIndex',
        type: 'Uint256',
        value: `${treeIndex}`,
    },
];
module.exports = Object.freeze({
    zilWithdraw: ({
                      amount,
                      nullifier,
                      recipient,
                      pi_a,
                      pi_b_1,
                      pi_b_2,
                      pi_b_3,
                      pi_c,
                      publicSignals,
                      treeIndex
                  }) => {
        return [
            {
                vname: 'amount',
                type: 'Uint128',
                value: `${amount}`,
            },
            ...proofDataParams(nullifier,
                recipient,
                pi_a,
                pi_b_1,
                pi_b_2,
                pi_b_3,
                pi_c,
                publicSignals,
                treeIndex)
        ];

    },
    zrc2Withdraw: ({
                       token_address,
                       contract_amount,
                       nullifier,
                       recipient,
                       pi_a,
                       pi_b_1,
                       pi_b_2,
                       pi_b_3,
                       pi_c,
                       publicSignals,
                       treeIndex
                   }) => {
        return [
            {
                vname: 'token_address',
                type: 'ByStr20',
                value: `${token_address}`,
            },
            {
                vname: 'contract_amount',
                type: 'ByStr20',
                value: `${contract_amount}`,
            },
            ...proofDataParams(nullifier,
                recipient,
                pi_a,
                pi_b_1,
                pi_b_2,
                pi_b_3,
                pi_c,
                publicSignals,
                treeIndex)
        ];
    }
});