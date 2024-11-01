import * as SPLToken from '@solana/spl-token';
// import {Keypair, NONCE_ACCOUNT_LENGTH, PublicKey, SystemProgram,} from '@solana/web3.js';
// import {Connection, Transaction} from "@solana/web3.js";

import {
  Connection,
  Keypair, LAMPORTS_PER_SOL,
  NONCE_ACCOUNT_LENGTH,
  //NonceAccount,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction
} from '@solana/web3.js';


const bs58 = require('bs58');
const { derivePath, getPublicKey } = require('ed25519-hd-key');
const BigNumber = require('bignumber.js');

export function createSolAddress (seedHex: string, addressIndex: string) {
  const { key } = derivePath("m/44'/501'/0'/" + addressIndex + "'", seedHex);
  const publicKey = getPublicKey(new Uint8Array(key), false).toString('hex');
  const buffer = Buffer.from(getPublicKey(new Uint8Array(key), false).toString('hex'), 'hex');
  const address = bs58.encode(buffer);
  const hdWallet = {
    privateKey: key.toString('hex') + publicKey,
    publicKey,
    address
  };
  return JSON.stringify(hdWallet);
}

export async function signSolTransaction (params:any) {
  const { from, amount, nonceAccount, to, mintAddress, nonce, decimal, privateKey } = params;
  const fromAccount = Keypair.fromSecretKey(new Uint8Array(Buffer.from(privateKey, 'hex')), { skipValidation: true });
  const calcAmount = new BigNumber(amount).times(new BigNumber(10).pow(decimal)).toString();
  if (calcAmount.indexOf('.') !== -1) throw new Error('decimal 无效');
  const tx = new Transaction();
  const toPubkey = new PublicKey(to);
  const fromPubkey = new PublicKey(from);
  tx.recentBlockhash = nonce;
  if (mintAddress) {
    const mint = new PublicKey(mintAddress);
    const fromTokenAccount = await SPLToken.Token.getAssociatedTokenAddress(
      SPLToken.ASSOCIATED_TOKEN_PROGRAM_ID,
      SPLToken.TOKEN_PROGRAM_ID,
      mint,
      fromPubkey
    );
    const toTokenAccount = await SPLToken.Token.getAssociatedTokenAddress(
      SPLToken.ASSOCIATED_TOKEN_PROGRAM_ID,
      SPLToken.TOKEN_PROGRAM_ID,
      mint,
      toPubkey
    );
    tx.add(
        SystemProgram.nonceAdvance({
          noncePubkey: new PublicKey(nonceAccount),
          authorizedPubkey: fromAccount.publicKey
        }),
        SPLToken.Token.createTransferInstruction(
          SPLToken.TOKEN_PROGRAM_ID,
          fromTokenAccount,
          toTokenAccount,
          fromPubkey,
          [fromAccount],
          calcAmount
      )
    );
  } else {
    tx.add(
      SystemProgram.nonceAdvance({
          noncePubkey: new PublicKey(nonceAccount),
          authorizedPubkey: fromAccount.publicKey
      }),
      SystemProgram.transfer({
        fromPubkey: fromAccount.publicKey,
        toPubkey: new PublicKey(to),
        lamports: calcAmount
      })
    );
  }
  tx.sign(fromAccount);

  const connection =  new Connection('https://go.getblock.io/0c0008adc0f147bca34d6d007d063d1b', 'confirmed');
  console.log(await connection.sendTransaction(tx,[fromAccount]));
  return tx.serialize().toString('base64');
}


export function prepareAccount(params:any){
  const {
    authorAddress, from, recentBlockhash, minBalanceForRentExemption, privs,
  } = params;

  const authorPrivateKey = (privs?.find((ele: { address: any; })=>ele.address===authorAddress))?.key;
  if(!authorPrivateKey) throw new Error("authorPrivateKey 为空");
  const nonceAcctPrivateKey = (privs?.find((ele: { address: any; })=>ele.address===from))?.key;
  if(!nonceAcctPrivateKey) throw new Error("nonceAcctPrivateKey 为空");

  const author = Keypair.fromSecretKey(new Uint8Array(Buffer.from(authorPrivateKey, "hex")));
  const nonceAccount = Keypair.fromSecretKey(new Uint8Array(Buffer.from(nonceAcctPrivateKey, "hex")));


  let tx = new Transaction();
  tx.add(
      SystemProgram.createAccount({
        fromPubkey: author.publicKey,
        newAccountPubkey: nonceAccount.publicKey,
        lamports: minBalanceForRentExemption,
        space: NONCE_ACCOUNT_LENGTH,
        programId: SystemProgram.programId,
      }),

      SystemProgram.nonceInitialize({
        noncePubkey: nonceAccount.publicKey,
        authorizedPubkey: author.publicKey,
      })
  );
  tx.recentBlockhash = recentBlockhash;


  tx.sign(author, nonceAccount);

  return tx.serialize().toString("base64");
}


/**
 * address
 * network type
 * @param params
 */
export function verifySolAddress (params: any) {
  const { address } = params;
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

export function importSolAddress (params: any) {
  const { privateKey } = params;
  const keyPairs = Keypair.fromSecretKey(Buffer.from(privateKey, 'hex'));
  return bs58.encode(keyPairs.publicKey);
}


// @ts-ignore
export function pubKeyToAddress({pubKey}): string {
  if (pubKey.length !== 64) {
    throw new Error("public key length Invalid");
  }
  const buffer = Buffer.from(pubKey, "hex");
  return bs58.encode(buffer);
}

// @ts-ignore
export function privateKeyToAddress({privateKey}): string {
  const bufferPriv = Buffer.from(privateKey, "hex");
  const keypairs = Keypair.fromSecretKey(bufferPriv);
  return bs58.encode(keypairs.publicKey);
}



// function uint8ArrayToHex(uint8Array: Uint8Array) {
//   return Array.from(uint8Array)
//       .map(byte => byte.toString(16).padStart(2, '0'))
//       .join('');
// }
function hexToUint8Array(hexString: string) {
  return new Uint8Array(Buffer.from(hexString, "hex"));
}

const connection = new Connection('https://go.getblock.io/0b210f6491324f969c052746cce6c0dd');

/**
 * 使用 nonce 进行 SOL 转账 colin代码
 */
export async function transferSolWithNonce(
    payerPrivateKey: string,
    recipientPublicKey: string,
    amountSol: number,
    noncePrivateKey?: string  // 将 noncePrivateKey 设为可选参数
) {
  const payerAccount = Keypair.fromSecretKey(hexToUint8Array(payerPrivateKey));
  const amountLamports = amountSol * LAMPORTS_PER_SOL; // 将 SOL 转换为 lamports（1 SOL = 10^9 lamports）
  let recentBlockhash: string;
  let transaction: Transaction;
  let signers: Keypair[] = [payerAccount];

  if (noncePrivateKey) {
    // 使用提供的 noncePrivateKey
    const nonceAccount = Keypair.fromSecretKey(hexToUint8Array(noncePrivateKey));
    transaction = new Transaction({
      recentBlockhash: nonceAccount.publicKey.toBase58()
    }).add(SystemProgram.nonceAdvance({
          noncePubkey: nonceAccount.publicKey,
          authorizedPubkey: payerAccount.publicKey,
        }),
        SystemProgram.transfer({
          fromPubkey: payerAccount.publicKey,
          toPubkey: new PublicKey(recipientPublicKey),
          lamports: amountLamports,
        })
    );
    signers.push(nonceAccount); // 添加 nonceAccount 到签名者列表
  } else {
    // 不使用 nonce，获取最新的 blockhash
    const latestBlockhashInfo = await connection.getLatestBlockhash('confirmed');
    recentBlockhash = latestBlockhashInfo.blockhash;
    transaction = new Transaction({recentBlockhash}).add(
        SystemProgram.transfer({
          fromPubkey: payerAccount.publicKey,
          toPubkey: new PublicKey(recipientPublicKey),
          lamports: amountLamports,
        })
    );
  }

  const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      signers
  );
  console.log('Transaction successful with signature:', signature);
}











// 创建一个新的 nonce 账户
export async function createNonceAccountGpt(
    connection: Connection,
    payer: Keypair,
    nonceAccount: Keypair,
    amountSol: number
) {
  const amountLamports = amountSol * LAMPORTS_PER_SOL;

  // 创建 nonce 账户的交易
  const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: nonceAccount.publicKey,
        lamports: amountLamports,
        space: 80, // Nonce account space
        programId: SystemProgram.programId,
      }),
      SystemProgram.nonceInitialize({
        noncePubkey: nonceAccount.publicKey,
        authorizedPubkey: payer.publicKey,
      })
  );

  // 发送交易
  await sendAndConfirmTransaction(connection, transaction, [payer, nonceAccount]);
  console.log('Nonce account created:', nonceAccount.publicKey.toBase58());
}



// 使用 nonce 账户进行交易
export async function transferSolWithNonceGpt(
    connection: Connection,
    payer: Keypair,
    recipientPublicKey: PublicKey,
    amountSol: number,
    nonceAccount: Keypair
) {
  const amountLamports = amountSol * LAMPORTS_PER_SOL;

  // 获取 nonce 账户的最近区块哈希
  const nonceInfo = await connection.getNonce(nonceAccount.publicKey);

  if (!nonceInfo) {
    throw new Error('Nonce account information is not available.');
  }//2JhuPsuLN98W5k4J6UcavPghRkJZ59S9Dvv8ic3TMuDn  BfQchgBRtirtJieW344giKsM7Sk6xmQEdjPfK5LNsKz3
  console.log(nonceInfo.nonce);
  // 创建交易，使用 nonce
  const transaction = new Transaction({
    feePayer: payer.publicKey,
    nonceInfo: {
      nonce: nonceInfo.nonce, // 这是一个字符串类型的区块哈希
      nonceInstruction: SystemProgram.nonceAdvance({
        noncePubkey: nonceAccount.publicKey,
        authorizedPubkey: payer.publicKey,
      }),
    },
  }).add(
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: recipientPublicKey,
        lamports: amountLamports,
      })
  );
  // 发送交易
  await sendAndConfirmTransaction(connection, transaction, [payer, nonceAccount]);
  console.log('Transaction sent using nonce account');
}
