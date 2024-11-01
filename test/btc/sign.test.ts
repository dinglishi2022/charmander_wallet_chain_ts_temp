/*
 * @Author: dinglishi2022 dinglishi2022@gmail.com
 * @Date: 2024-10-02 20:17:31
 * @LastEditors: dinglishi2022 dinglishi2022@gmail.com
 * @LastEditTime: 2024-10-02 21:41:45
 * @FilePath: \the-web3-blockchain-operation\test\btc\sign.test.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { signBtcTransaction, verifyBtcAddress } from "../../bip32";

describe('btc unit test case', () => {

    test('sign', async () => {
        const data = {
            inputs: [
                {
                    address: "1H1oAqmdfTNECrrHFAJ4AhbTUyPcQjrf72", //账户地址
                    txid: "209706b97a9aed047df158bf57cfbdad94a5e9bd9ac5261034448ec4590bab8f",
                    amount: 9000000000000000,
                    vout: 0,
                },
            ],
            outputs: [
                {
                    amount: 9000000000000000,
                    address: "1H1oAqmdfTNECrrHFAJ4AhbTUyPcQjrf72",//目标地址
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
        console.log("ok=", ok)
    });





    
});