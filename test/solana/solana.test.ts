 // import { NonceAccount} from "@solana/web3.js";

import {Connection, Keypair,PublicKey} from "@solana/web3.js";

 const  bip39 = require('bip39')

import {
    createNonceAccountGpt,
    createSolAddress,
    prepareAccount,
    transferSolWithNonce,
    transferSolWithNonceGpt,
    verifySolAddress

} from "../../solana";
 import {signSolTransaction} from "../../wallet/sol";

//import  {NonceAccount} from "@solana/web3.js";

describe('solana unit test case', () => {
    test('createAddress', () => {
     //  const seed =  bip39.mnemonicToSeedSync('scatter antenna awesome rabbit sphere elevator rebel exchange scorpion exact hub grid')
        const seed =  bip39.mnemonicToSeedSync('face defy torch paper dial goddess floor wage nephew floor million belt')

       const  account = createSolAddress(seed.toString('hex'),"0");
       console.log(account);//AaWEWZJZq2M4AUytd9XQGUTUXSpD85qERzbVEfXRjF7B
    })

/*    {"privateKey":"2ad2b038d5b65869427add97ef29e8af560d440e7e722f40f014611054fa2cbb8e4e671e844148506b3c58e501a008e36c608a2fdb36845b2dd2c410029c002e",
        "publicKey":                                                                "8e4e671e844148506b3c58e501a008e36c608a2fdb36845b2dd2c410029c002e",
        "address":"AaWEWZJZq2M4AUytd9XQGUTUXSpD85qERzbVEfXRjF7B"}*/

// test('signTransaction', async() =>{
//     const params = {
//         from :"AaWEWZJZq2M4AUytd9XQGUTUXSpD85qERzbVEfXRjF7B",
//         amount:"0.01",
//         to:"4wHd9tf4x4FkQ3JtgsMKyiEofEHSaZH5rYzfFKLvtESD",
//         nonce:"2pQjXNTd3S4ouGx8nH1DdENZKuT8NMRo6NNUELHAikH9",//最新区块
//         decimal:9,
//         privateKey:"2ad2b038d5b65869427add97ef29e8af560d440e7e722f40f014611054fa2cbb8e4e671e844148506b3c58e501a008e36c608a2fdb36845b2dd2c410029c002e",
//         mintAddress:""
//     }
//     let tx_msg = await transferSolWithNonce(params);
//     console.log(tx_msg)
//     })
//

    test('transfer', async () => {
        await transferSolWithNonce(
            "55a70321542da0b6123f37180e61993d5769f0a5d727f9c817151c1270c290963a7b3874ba467be6b81ea361e3d7453af8b81c88aedd24b5031fdda0bc71ad32",
            "AaWEWZJZq2M4AUytd9XQGUTUXSpD85qERzbVEfXRjF7B",
            0.02,
           // "698d4eb0a0ed678e55d3ec774a2d6ca39c9f378073c12c3f24c941c7660cde1b502768dab1305e1ccaffa0a3aed2b5abe3abd674c24ce97eda4f3ef7bd681c77"
        )
    });

test('prepareAccount',async() =>{
    const params = {
        authorAddress: "AaWEWZJZq2M4AUytd9XQGUTUXSpD85qERzbVEfXRjF7B",
        from: "AaWEWZJZq2M4AUytd9XQGUTUXSpD85qERzbVEfXRjF7B",
        recentBlockhash: "BHgzBqb8VwJeHd4kmmpTdnVvvt38hLAAVhoqRLFWZe76",
        minBalanceForRentExemption:1647680,
        privs:[
            {
                address:"AaWEWZJZq2M4AUytd9XQGUTUXSpD85qERzbVEfXRjF7B",
                key:"2ad2b038d5b65869427add97ef29e8af560d440e7e722f40f014611054fa2cbb8e4e671e844148506b3c58e501a008e36c608a2fdb36845b2dd2c410029c002e"

            }
        ]

    }
    let tx_msg = await prepareAccount(params);
    console.log("tx_msg===", tx_msg);
})
// test('decode nonce',async() =>{
//
//     const base58Data = "df8aQUMTjFpKK2cwmaeJaGzBFKgXYcjdLvS1nZDrZH3BQvsUvQLLW9LpE5JUgUy66FYCWhWihfdow5WQvspUmrT38TM6HmznsG9TfNgLc79H";
//     console.log(NonceAccount.fromAccountData(Buffer.from(base58Data))) ;
//
//
// })

    test('verifyAddress',async() =>{
        const params = {
            address:"",
        }
        console.log("tx_msg==",verifySolAddress(params)) ;
    })




// 假设您有一个十六进制格式的私钥字符串
    const privateKeyHex = '2ad2b038d5b65869427add97ef29e8af560d440e7e722f40f014611054fa2cbb8e4e671e844148506b3c58e501a008e36c608a2fdb36845b2dd2c410029c002e';

// 将十六进制私钥转换为 Uint8Array
    const privateKeyUint8Array = Uint8Array.from(Buffer.from(privateKeyHex, 'hex'));

// 从私钥创建 Keypair
    const payer = Keypair.fromSecretKey(privateKeyUint8Array);


/*
    [
        9,  94, 222, 224, 154, 96, 158,  36,  97, 191, 155,
        34, 158, 142, 245, 233, 60, 225,  61,  73, 252, 115,
        121, 120,  14,  43, 228, 34, 117,  57,  54, 165, 160,
        170,  48,  65,  15,  78, 97,  79, 195,  19,  57,  76,
        223, 184,  24, 179, 195, 77, 186, 147, 161, 190, 240,
        238, 148, 122,  80,  54,  5, 171, 196, 103
        BpAkLc9x7RLimStRZPczqkWSakJYWQd9SidNaWZ76Lyc
    ]*/
    test('nonceAccount',async() =>{
        const connection = new Connection('https://go.getblock.io/0c0008adc0f147bca34d6d007d063d1b', 'confirmed');

         const nonceAccount = Keypair.generate();

        console.log(nonceAccount)
        // 创建 nonce 账户  GPm7M8Qsk9RCxpTTfBqbNDPJi6CMdW1w5FrcovYrv2mn
       await createNonceAccountGpt(connection, payer, nonceAccount, 0.002); // 0.001 SOL 用于创建 nonce 账户

        // 使用 nonce 账户进行转账
      //  await transferSolWithNonceGpt(connection, payer, recipientPublicKey, 0.01, "GPm7M8Qsk9RCxpTTfBqbNDPJi6CMdW1w5FrcovYrv2mn"); // 0.01 SOL 转账;
    })


    const secretKey = Uint8Array.from([
        9,  94, 222, 224, 154, 96, 158,  36,  97, 191, 155,
        34, 158, 142, 245, 233, 60, 225,  61,  73, 252, 115,
        121, 120,  14,  43, 228, 34, 117,  57,  54, 165, 160,
        170,  48,  65,  15,  78, 97,  79, 195,  19,  57,  76,
        223, 184,  24, 179, 195, 77, 186, 147, 161, 190, 240,
        238, 148, 122,  80,  54,  5, 171, 196, 103
    ]);

// 从 secretKey 创建 Keypair
    const noncekeypair = Keypair.fromSecretKey(secretKey);
//	nonce BpAkLc9x7RLimStRZPczqkWSakJYWQd9SidNaWZ76Lyc
    test('transferSolWithNonceGpt1',async() =>{
    console.log(   noncekeypair.secretKey.keys(),'==========',noncekeypair.publicKey.toBase58(),'===', new PublicKey('AaWEWZJZq2M4AUytd9XQGUTUXSpD85qERzbVEfXRjF7B'))
    }
    )
    const connection = new Connection('https://go.getblock.io/0b210f6491324f969c052746cce6c0dd', 'confirmed');

    test('transferSolWithNonceGpt',async() =>{

        // const nonceAccount = Keypair.generate();
        const recipientPublicKey = new PublicKey('4wHd9tf4x4FkQ3JtgsMKyiEofEHSaZH5rYzfFKLvtESD'); // 替换为接收者的公钥
        //console.log(nonceAccount)
        // 创建 nonce 账户  GPm7M8Qsk9RCxpTTfBqbNDPJi6CMdW1w5FrcovYrv2mn
        //await createNonceAccountGpt(connection, payer, nonceAccount, 0.002); // 0.001 SOL 用于创建 nonce 账户

        // 使用 nonce 账户进行转账
        await transferSolWithNonceGpt(connection, payer, recipientPublicKey, 0.002, noncekeypair); // 0.01 SOL 转账;
    })

  //                       BpAkLc9x7RLimStRZPczqkWSakJYWQd9SidNaWZ76Lyc 8e4e671e844148506b3c 58e501a008e36c608a2fdb36845b2dd2c410029c002e
   // 2ad2b038d5b65869427add97ef29e8af560d440e7e722f40f014611054fa2cbb 8e4e671e844148506b3c5 8e501a008e36c608a2fdb36845b2dd2c410029c002e



    test('signSolTransactionUsdt111',async() =>{

        // const nonceAccount = Keypair.generate();
      //  const recipientPublicKey = new PublicKey('4wHd9tf4x4FkQ3JtgsMKyiEofEHSaZH5rYzfFKLvtESD'); // 替换为接收者的公钥
        //console.log(nonceAccount)
        // 创建 nonce 账户  GPm7M8Qsk9RCxpTTfBqbNDPJi6CMdW1w5FrcovYrv2mn
        //await createNonceAccountGpt(connection, payer, nonceAccount, 0.002); // 0.001 SOL 用于创建 nonce 账户
        const toPubkey =   new PublicKey('AaWEWZJZq2M4AUytd9XQGUTUXSpD85qERzbVEfXRjF7B');
        const fromPubkey = new PublicKey('4wHd9tf4x4FkQ3JtgsMKyiEofEHSaZH5rYzfFKLvtESD');
        console.log(toPubkey,fromPubkey)
        const privateKeyUint8 = new Uint8Array(Buffer.from('55a70321542da0b6123f37180e61993d5769f0a5d727f9c817151c1270c290963a7b3874ba467be6b81ea361e3d7453af8b81c88aedd24b5031fdda0bc71ad32', 'hex'));
        const keypair = Keypair.fromSecretKey(privateKeyUint8);
        // 使用 nonce 账户进行转账
        console.log(await signSolTransaction({

             amount:'0.1'
            , to:'AaWEWZJZq2M4AUytd9XQGUTUXSpD85qERzbVEfXRjF7B'
            , mintAddress:'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'
            , nonce:'hsuXVct3kUjH1uxj1Wi8z93TkLTJo7YrHV5hzV61gYe'
            , decimal:6
            , privateKey:'55a70321542da0b6123f37180e61993d5769f0a5d727f9c817151c1270c290963a7b3874ba467be6b81ea361e3d7453af8b81c88aedd24b5031fdda0bc71ad32'
            ,from:'4wHd9tf4x4FkQ3JtgsMKyiEofEHSaZH5rYzfFKLvtESD'
            ,fromAccount:keypair
        }))
        ; // 0.01 SOL 转账;
    })
})
