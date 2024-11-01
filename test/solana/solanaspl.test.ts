import {
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction,
    LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import {

    createTransferCheckedInstruction,
} from '@solana/spl-token';

export async function transferSolAndUsdtWithNonceGpt(
    connection: Connection,
    payer: Keypair,
    recipientPublicKey: PublicKey,
    amountSol: number,
    amountUsdt: number,
    nonceAccount: Keypair,
    usdtMint: PublicKey, // USDT 的 Mint 地址
    payerTokenAccount: PublicKey, // 支付者的 USDT 账户
    recipientTokenAccount: PublicKey // 接收者的 USDT 账户
) {
    const amountLamports = amountSol * LAMPORTS_PER_SOL;

    // 获取 nonce 账户的最近区块哈希
    const nonceInfo = await connection.getNonce(nonceAccount.publicKey);

    if (!nonceInfo) {
        throw new Error('Nonce account information is not available.');
    }

    console.log(nonceInfo.nonce);

    // 创建转账 SOL 的交易
    const transferSolInstruction = SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: recipientPublicKey,
        lamports: amountLamports,
    });

    // 创建转账 USDT 的交易
    const transferUsdtInstruction = createTransferCheckedInstruction(
        payerTokenAccount, // 支付者的 USDT 账户
        usdtMint, // USDT 的 Mint 地址
        recipientTokenAccount, // 接收者的 USDT 账户
        payer.publicKey, // 支付者的公钥
        amountUsdt * 10 ** 6, // USDT 的转账数量（假设 USDT 的精度为 6）
        6 // USDT 的精度
    );

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
        transferSolInstruction,
        transferUsdtInstruction
    );

    // 发送交易
    await sendAndConfirmTransaction(connection, transaction, [payer, nonceAccount]);
    console.log('Transaction sent using nonce account');
}