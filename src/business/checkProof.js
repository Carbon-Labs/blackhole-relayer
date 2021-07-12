const blackhole = require("./blackhole");
const commits = async ({address, index}) => blackhole.client.share({address}).getCommitments(index);

const createTreePath = async ({address, index}) => {
    const merkleTree = new blackhole.MerkleTree(7, null, "blackhole");
    const all_leaf = await commits({address, index});
    for (let i = 0; i < all_leaf.length; i++) {
        await merkleTree.insert(all_leaf[i]);
    }
    return merkleTree.path(0);
};

module.exports = async ({proof, relayer}) => {
    let path = await createTreePath({address: proof.address, index: proof.index});
    if (path.root.toString() !== proof.publicSignals[0].toString()) {
        path = await createTreePath({address: proof.address, index: BigInt((proof.index + 1))});
    }
    const {root} = path;
    const proofData = {
        pi_a: proof.pi_a.map(p => p.toString()),
        pi_b: [proof.pi_b_1.map(p => p.toString()), proof.pi_b_2.map(p => p.toString()), proof.pi_b_3.map(p => p.toString())],
        pi_c: proof.pi_c.map(p => p.toString()),
        publicSignals: proof.publicSignals.map(e => e.toString())
    };
    return !(await blackhole.client.share({address: proof.address}).isExist(proof.nullifier)) &&
        blackhole.knownProof({
            nullifier: proof.nullifier,
            root,
            input: proofData,
            relayer: BigInt(relayer),
            recipient: BigInt(proof.recipient),
        }) &&
        await blackhole.snarkVerify(proofData);
};
