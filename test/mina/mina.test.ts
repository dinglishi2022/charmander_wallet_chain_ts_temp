import assert from 'assert'
import * as Account from "../../mina/background/accountService"
import { describe, it } from 'mocha';


describe('Account Util Test', function () {
    describe('generate Mnemonic', function () {
        it('generate & validate mnemonic', async function () {
            let mne = Account.generateMne()
            console.log(mne);//助记词生成    silly denial absurd truck hour possible vote bomb taste picture shoulder become
            let result = Account.validateMnemonic(mne)
            assert.ok(result)
        })
    })

    describe('import Wallet By Mnemonic', function () {
        it('importWalletByMnemonic', async function () {
            let account = await Account.importWalletByMnemonic('execute budget flip enemy dust loop curious captain since drum switch behind')
            console.log(account);
            // assert.strictEqual(
            //     JSON.stringify(account),
            //     JSON.stringify(accountData.importWalletByMnemonic)
            // );
        })
    })

    describe('import Wallet', function () {
        // it('importWalletByKeystore', async function () {
        //     let account = await Account.importWalletByKeystore(
        //         JSON.stringify(accountData.importWalletByKeystore.keystore),
        //         accountData.importWalletByKeystore.password)
        //     assert.strictEqual(
        //         JSON.stringify(account),
        //         JSON.stringify(accountData.importWalletByKeystore.result)
        //     );
        // })
        it('importWalletByPrivateKey', async function () {
            let account = await Account.importWalletByPrivateKey('EKF5zDkMJbJxKBxh1qBgEchfmAgSFXoWXZ6sxaVoQF2qc4yAnRgx')
            assert.strictEqual(
                JSON.stringify(account.priKey),
                JSON.stringify('EKF5zDkMJbJxKBxh1qBgEchfmAgSFXoWXZ6sxaVoQF2qc4yAnRgx')
            );
        })
    })
        describe('import Wallet2', function () {
        it('importWalletBymnemonicOrPrivateKey', async function () {
            let account = await Account.importWallet('silly denial absurd truck hour possible vote bomb taste picture shoulder become','mnemonic')
            console.log(account);
        })
        })
    describe('import Wallet3', function () {
        it('importWalletBymnemonicOrPrivateKey', async function () {
            let account = await Account.importWallet('silly denial absurd truck hour possible vote bomb taste picture shoulder become','mnemonic')
            console.log(account);
        })
    })
   })