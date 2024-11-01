/*
 * @Author: dinglishi2022 dinglishi2022@gmail.com
 * @Date: 2024-06-07 23:42:45
 * @LastEditors: dinglishi2022 dinglishi2022@gmail.com
 * @LastEditTime: 2024-10-08 16:51:35
 * @FilePath: \the-web3-blockchain-operation\test\btc.test.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {mnemonicToSeed} from "../../wallet/bip/bip";
import {createBtcAddress, importBtcAddress, signBtcTransaction, verifyBtcAddress } from "../../wallet/btc";
//git版本重新同步
const bip39 = require('bip39');
const crypto_ts = require('crypto');



describe('btc unit test case', () => {


    
    test('generateMnemonic', async () => {
        // 1. 生成 128 位随机熵 12 15 18 21 24
        const entropy = crypto_ts.randomBytes(24); // 128 位是 16 字节

        // 2. 计算校验和 (SHA-256)
        const hash = crypto_ts.createHash('sha256').update(entropy).digest();
        const checksum = hash[0] >> 6; // 取前 4 位

        // 3. 组合熵和校验和
        let bits = '';
        for (let i = 0; i < entropy.length; i++) {
            bits += entropy[i].toString(2).padStart(8, '0');
        }
        bits += checksum.toString(2).padStart(4, '0');

        // 4. 分割为助记词索引
        const indices: number[] = []; 
        for (let i = 0; i < bits.length; i += 11) {
            const index = parseInt(bits.slice(i, i + 11), 2);
            indices.push(index);
        }

        // 5. 映射为助记词
        const wordlist = bip39.wordlists.english;
        const mnemonic = indices.map(index => wordlist[index]).join(' ');

        console.log(mnemonic);

    });

    test('test create mnemonic', async () => {
        const english_mnemonic = bip39.generateMnemonic(128, null, bip39.wordlists.english)
        // const chinese_mnemonic = createMnemonic(12, "chinese_simplified")
        // const jap_mnemonic = createMnemonic(12, "japanese")
        console.log(english_mnemonic);
        // console.log(chinese_mnemonic);
        // console.log(jap_mnemonic);

        const encrpyt_code =bip39.mnemonicToEntropy(english_mnemonic,bip39.wordlists.english)
        console.log(encrpyt_code);

        const decode_code = bip39.entropyToMnemonic(encrpyt_code,bip39.wordlists.english)
        console.log(decode_code)

        const words_str = english_mnemonic
        const is_ok = bip39.validateMnemonic(words_str, "english")

    

        console.log(is_ok)
        const encrpyt_code_1 = bip39.mnemonicToEntropy(words_str, bip39.wordlists.english)
        console.log(encrpyt_code_1);
    });

    test('createAddress', () => {
        const mnemonic = "lounge face pattern cinnamon shrug average spend rapid field cheese wrist weather";
        const params_1 = {
            mnemonic: mnemonic, 
            password: ""  
        }
        const seed = mnemonicToSeed(params_1)
        const account = createBtcAddress(seed.toString("hex"), "0", "0", "mainnet")
        console.log(account)  // 1H7AcqzvVQunYftUcJMxF9KUrFayEnf83T  // bc1qgdqma0vzwa9ay49h7pcp87nu7velm5fjudhw0t
    });

    test('importBtcAddress', () => {
        const params = {
            privateKey: "60164bec9512d004af7f71e7ed868c8e9ac2cc6234d8b682037ec80547595f2e",
            network: "mainnet"
        }
        const account = importBtcAddress(params);
        console.log(account)
    });

    test('sign', async () => {
        const data = {
            inputs: [
                {
                    address: "1H1oAqmdfTNECrrHFAJ4AhbTUyPcQjrf72",
                    txid: "209706b97a9aed047df158bf57cfbdad94a5e9bd9ac5261034448ec4590bab8f",
                    amount: 9000000000000000,
                    vout: 0,
                },
            ],
            outputs: [
                {
                    amount: 9000000000000000,
                    address: "1H1oAqmdfTNECrrHFAJ4AhbTUyPcQjrf72",
                },
            ],
        };
        const rawHex = signBtcTransaction({
            privateKey: "60164bec9512d004af7f71e7ed868c8e9ac2cc6234d8b682037ec80547595f2e",
            signObj: data,
            network: "mainnet"
        });
        console.log(rawHex);
    });

    test('verifyBtcAddress', () => {
        const params = {
            address: "1H1oAqmdfTNECrrHFAJ4AhbTUyPcQjrf72",
            network: "mainnet"
        }
       const ok = verifyBtcAddress(params)
        console.log("ok=",  ok)
     });
});
