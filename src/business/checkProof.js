const blackhole = require("./blackhole");
const {blockchain} = require("../../config");
const share = (token_address) => blackhole.client.share({
    address: token_address,
    blockchain,
});
const commits = async ({address, index}) => share(address).getCommitments(index);

const createTreePath = async ({address, index}) => {
    const merkleTree = new blackhole.MerkleTree(7, null, "blackhole");
    const all_leaf = await commits({address, index});
    for (let i = 0; i < all_leaf.length; i++) {
        await merkleTree.insert(all_leaf[i]);
    }
    return merkleTree.path(0);
};

module.exports = async ({proof, relayer}) => {
    let path = await createTreePath({address: proof.contract_amount, index: proof.treeIndex});
    if (path.root.toString() !== proof.publicSignals[0].toString()) {
        path = await createTreePath({address: proof.contract_amount, index: BigInt((proof.treeIndex + 1))});
    }
    const {root} = path;
    const proofData = {
        pi_a: proof.pi_a.map(p => p.toString()),
        pi_b: [proof.pi_b_1.map(p => p.toString()), proof.pi_b_2.map(p => p.toString()), proof.pi_b_3.map(p => p.toString())],
        pi_c: proof.pi_c.map(p => p.toString()),
        publicSignals: proof.publicSignals.map(e => e.toString())
    };
    return !(await share(proof.contract_amount).isSpent(proof.nullifier)) &&
        blackhole.knownProof({
            nullifier: BigInt(proof.nullifier),
            root,
            input: proofData,
            relayer: BigInt(relayer),
            recipient: BigInt(proof.recipient),
        }) && await blackhole.snarkVerify(proofData);
};
