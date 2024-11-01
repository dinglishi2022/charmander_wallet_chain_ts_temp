const {derivePath, getPublicKey} = require("ed25519-hd-key");
const bip39 = require('bip39');
const polkdot = require("@polkadot/util-crypto");


function createDotAddress (seedHex, addressIndex, chain, network) {
    const { key } = derivePath("m/44'/354'/0'/0'/" + addressIndex + "'", seedHex);
    const keyword = `dot_main_net`;
    const pubKey = getPublicKey(key, false).toString('hex');
    console.log("publicKey==", pubKey)
    let publicKey = pubKey;
    if(typeof publicKey === "string" && publicKey.substring(0,2)!=="0x"){
        publicKey = "0x" + publicKey;
    }
    const address = polkdot.encodeAddress(publicKey,0)
    return {
        "privateKey": key.toString('hex') + publicKey,
        "publicKey": publicKey,
        "address": address
    }
}

const mnemonic = "champion junior glimpse analyst plug jump entire barrel slight swim hidden remove";
const seed = bip39.mnemonicToSeedSync(mnemonic)
const account =  createDotAddress(seed, 0, "dot", "main_net")
console.log(account)