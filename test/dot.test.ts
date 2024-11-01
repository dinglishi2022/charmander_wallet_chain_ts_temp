/*
 * @Author: dinglishi2022 dinglishi2022@gmail.com
 * @Date: 2024-06-07 23:42:45
 * @LastEditors: dinglishi2022 dinglishi2022@gmail.com
 * @LastEditTime: 2024-06-09 14:16:41
 * @FilePath: \the-web3-blockchain-operation\test\dot.test.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { mnemonicToSeed } from "../wallet/bip/bip";
import { createDotAddress } from "../wallet/dot/index";

describe('dot unit test case', () => {
    test('createDotAddress', () => {
        const mnemonic = "around dumb spend sample oil crane plug embrace outdoor panel rhythm salon";
        const params_1 = {
            mnemonic: mnemonic,
            password: ""
        }
        const seed = mnemonicToSeed(params_1)
        const account = createDotAddress(seed, 0, "", "")
        console.log(account)
    });

    // test('import atom address', async () => {
    //     const params = {
    //         privateKey: "629f05de625221275c92c0bc07dc16060b4c642e971a8858c54e73191eb31c6d",
    //     }
    //     const account = await importAtomAddress(params)
    //     console.log(account)
    // });
    //
    // test('verify atom address', async () => {
    //     const params = {
    //         address: "cosmos16j52zqaeykz3qfdjw9ssys7ktaz3x7nple2mze",
    //         network: "mainnet"
    //     }
    //     let verifyRes = verifyAtomAddress(params)
    //     console.log(verifyRes);
    // });
    // /*
    //  const {
    //     txObj:{ chainId, from, to, memo, amount, fee, gas, accountNumber, sequence, decimal },
    //     privs
    // } = params;
    //  */
    // test('sign atom transaction', async () => {
    //     const params = {
    //         privateKey: "629f05de625221275c92c0bc07dc16060b4c642e971a8858c54e73191eb31c6d",
    //         chainId: 1,
    //         from: "cosmos16j52zqaeykz3qfdjw9ssys7ktaz3x7nple2mze",
    //         to: "cosmos16j52zqaeykz3qfdjw9ssys7ktaz3x7nple2mzm",
    //         memo: "1010",
    //         amount: 10,
    //         fee: 1,
    //         accountNumber: 1,
    //         sequence:1,
    //         decimal: 6
    //     }
    //     let signTx = await signAtomTransaction(params)
    //     console.log(signTx);
    // });
});
