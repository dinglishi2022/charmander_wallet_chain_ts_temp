import { signDataV2 } from "../../mina/data/sign_data_v2";
import * as mina from "../../mina/mina";
describe('mina unit test case', () => {
    test('signPayment ', async () => {
        const signResult = await mina.signTransaction(
            signDataV2.testAccount.privateKey,
            {
                ...signDataV2.signPayment.mainnet.signParams,
            }
        );
        console.log('-----',signResult)

      //  expect(signResult).toEqual(signDataV2.signPayment.mainnet.signResult);

      })

test('stakeDelegation ', async () => {
    const signResult = await mina.signTransaction(
        signDataV2.testAccount.privateKey,
        {
            ...signDataV2.signStakeTransaction.mainnet.signParams,
        }
    );
    console.log('-----',signResult)

    //  expect(signResult).toEqual(signDataV2.signPayment.mainnet.signResult);

    })


    test('sign message', async () => {


        //  expect(signResult).toEqual(signDataV2.signPayment.mainnet.signResult);
        const signResult = await mina.signTransaction(
            signDataV2.testAccount.privateKey,
            {
                ...signDataV2.signMessage.mainnet.signParams,
            }
        );
        console.log('-----',signResult);

        const verifyResult = await mina.verifyMessage(
            signResult.publicKey,
            signResult.signature,
            signResult.data
        );
        console.log('-----',verifyResult)
    })


    test('signFeilds on mainnet', async () => {
        const signResult = await mina.signFieldsMessage(
            signDataV2.testAccount.privateKey,
            {
                ...signDataV2.signFileds.mainnet.signParams,
            }
        );

        console.log('-----',signResult)
        const verifyResult = await mina.verifyFieldsMessage(
            signResult.publicKey,
            signResult.signature,
            signResult.data,
        );
        console.log('-----',verifyResult)
    })

    test('create nullifier on mainnet', async () => {
        const signResult = await mina.createNullifier(
            signDataV2.testAccount.privateKey,
            {
                ...signDataV2.nullifierData.mainnet.signParams,
            }
        );
        console.log('-----',signResult)
    })


})



