const bip39 = require('bip39');
import { ethers } from "ethers";
import {
    createEthAddress,
    signOpMainnetTransaction,
    ethSign
} from "../../eth/ethereum";
describe('ethereum wallet test', ()=> {
    test('mpc public key to address', () => {
        const pubKeyPoint = [
            2, 211, 154, 205, 237, 94, 172, 44, 10, 252, 232, 165, 187, 22, 53, 235, 218, 108, 26, 42, 122, 130, 38, 45, 110, 233, 154, 55, 141, 135, 170, 96, 220
        ]
        const address = ethers.utils.computeAddress("0x" + Buffer.from(pubKeyPoint).toString("hex"))
        console.log("wallet address:", address);
    });

    test('createAddress', () => {
        const mnemonic = "champion junior glimpse analyst plug jump entire barrel slight swim hidden ";
        const seed = bip39.mnemonicToSeedSync(mnemonic,'');
        const account = createEthAddress(seed.toString("hex"), "0")
        console.log(account)
    });

    test('sign eth', async () => {
        const rawHex = await signOpMainnetTransaction({
            "privateKey": "0cbb2ff952da876c4779200c83f6b90d73ea85a8da82e06c2276a11499922720",
            "nonce": 12,
            "from": "0x72fFaA289993bcaDa2E01612995E5c75dD81cdBC",
            "to": "0x35096AD62E57e86032a3Bb35aDaCF2240d55421D",
            "gasLimit": 21000,
            "amount": "0.01",
            "gasPrice": 3919237255,
            "decimal": 18,
            "chainId": 10,
            "tokenAddress": "0x00"
        })
        console.log(rawHex)
    });

    test('sign nft', async () => {
        const rawHex = await signOpMainnetTransaction({
            "privateKey": "0cbb2ff952da876c4779200c83f6b90d73ea85a8da82e06c2276a11499922720",
            "nonce": 46,
            "from": "0x72fFaA289993bcaDa2E01612995E5c75dD81cdBC",
            "to": "0x35096AD62E57e86032a3Bb35aDaCF2240d55421D",
            "gasLimit": 120000,
            "amount": "0",
            "gasPrice": 3919237255,
            "decimal": 1,
            "chainId": 1,
            "tokenAddress": "0x48C11b86807627AF70a34662D4865cF854251663",
            "tokenId": "2450"
        })
        console.log(rawHex)
    });

    test('sign eth eip1559', async () => {//测试钱包
        const rawHex = ethSign({
            "privateKey": "8fe12e38151401dca3c920bb2c46825c167d827572da05a309e9cbb4d86660df",
            "nonce": 0,
            "from": "0x7daf127764f3754638c8843879b1e7e7bd234a08",
            "to": "0x0bb4311eb2181df2bfaa0729625ffcd1365eebdc",
            "amount": "0.0001",
            "gasLimit": 21000,
            "maxFeePerGas": 2900000000,
            "maxPriorityFeePerGas": 2600000000,
            "decimal": 18,
            "chainId": 1,
            "tokenAddress": "0x00"
        })
        console.log(rawHex)
    });

    test('sign usdt eip1559', async () => {
        const rawHex = ethSign({
            "privateKey": "8fe12e38151401dca3c920bb2c46825c167d827572da05a309e9cbb4d86660df",
            "nonce": 1,
            "from": "0x7daf127764f3754638c8843879b1e7e7bd234a08",
            "to": "0x0bb4311eb2181df2bfaa0729625ffcd1365eebdc",
            "amount": "2",
            "gasLimit": 120000,  //gas
            "maxFeePerGas": 2900000000,         //  gas price
            "maxPriorityFeePerGas": 2600000000,
            "decimal": 6,
            "chainId": 1,
            "tokenAddress": "0xdAC17F958D2ee523a2206206994597C13D831ec7"
        })
        console.log(rawHex)
    });
});