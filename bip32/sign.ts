/*
 * @Author: dinglishi2022 dinglishi2022@gmail.com
 * @Date: 2024-10-01 12:32:13
 * @LastEditors: dinglishi2022 dinglishi2022@gmail.com
 * @LastEditTime: 2024-10-02 21:33:44
 * @FilePath: \the-web3-blockchain-operation\bip32\sign.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const ecc = require('tiny-secp256k1');
const { BIP32Factory } = require('bip32');
BIP32Factory(ecc);
const bitcoin = require('bitcoinjs-lib');
const bitcore = require('bitcore-lib');

bitcoin.initEccLib(ecc);
const bip32 = BIP32Factory(ecc);

/**
 * @returns
 * @param params
 */
export function buildAndSignTx (params: { privateKey: string; signObj: any; network: string; }): string {
  const { privateKey, signObj, network } = params;
  const net = bitcore.Networks[network];
  const inputs = signObj.inputs.map(input => {
    return {
      address: input.address,
      txId: input.txid,
      outputIndex: input.vout,
      // eslint-disable-next-line new-cap
      script: new bitcore.Script.fromAddress(input.address).toHex(),
      satoshis: input.amount
    };
  });
  const outputs = signObj.outputs.map(output => {
    return {
      address: output.address,
      satoshis: output.amount
    };
  });
  const transaction = new bitcore.Transaction(net).from(inputs).to(outputs);
  transaction.version = 2;
  transaction.sign(privateKey);
  return transaction.toString();
}

export function buildUnsignTxAndSign (params) {
  const { keyPair, signObj, network } = params;
  const psbt = new bitcoin.Psbt({ network });
  const inputs = signObj.inputs.map(input => {
    return {
      address: input.address,
      txId: input.txid,
      outputIndex: input.vout,
      // eslint-disable-next-line new-cap
      script: new bitcore.Script.fromAddress(input.address).toHex(),
      satoshis: input.amount
    };
  });
  psbt.addInput(inputs);

  const outputs = signObj.outputs.map(output => {
    return {
      address: output.address,
      satoshis: output.amount
    };
  });
  psbt.addOutput(outputs);
  psbt.toBase64();

  psbt.signInput(0, keyPair);
  psbt.finalizeAllInputs();

  const signedTransaction = psbt.extractTransaction().toHex();
  console.log('signedTransaction==', signedTransaction);
}

/**
 * 暂不支持taproot签名
 * @returns
 * @param params
 */
export function signBtcTransaction (params: { privateKey: string; signObj: any; network: string; }): string {
  const { privateKey, signObj, network } = params;
  const net = bitcore.Networks[network];
  const inputs = signObj.inputs.map(input => {
    return {
      address: input.address,
      txId: input.txid,
      outputIndex: input.vout,
      script: new bitcore.Script.fromAddress(input.address).toHex(),
      satoshis: input.amount
    }
  });
  const outputs = signObj.outputs.map(output => {
    return {
      address: output.address,
      satoshis: output.amount
    };
  });
  const transaction = new bitcore.Transaction(net).from(inputs).to(outputs);
  transaction.version = 2;
  transaction.sign(privateKey);
  return transaction.toString();
}

export function verifyBtcAddress (params) {
  const { address, network } = params;
  const net = bitcore.Networks[network];
  return bitcore.Address.isValid(address, net);
}

/**
 * import address
 * private key
 * network
 * @param params
 */
export function importBtcAddress (params: { privateKey: string; network: string; }) {
  const { privateKey, network } = params;
  const net = bitcore.Networks[network];
  if (!bitcore.PrivateKey.isValid(privateKey)) {
    throw new Error('PrivateKey is not valid.');
  }
  const address = bitcore.PrivateKey(privateKey, net).toAddress().toString('hex');
  return address;
}


export async function signBtcTaprootTransaction(params) {
  const { signObj, privateKey } = params
  const psbt = new bitcoin.Psbt({network: bitcoin.networks.bitcoin});

  const inputs = signObj.inputs.map(input => {
      return {
          hash: input.txid,
          index: 0,
          witnessUtxo: {value: input.amount, script: input.output!},
          tapInternalKey: bitcoin.toXOnly(input.publicKey),
      }
  });
  psbt.addInputs(inputs);

  const sendInternalKey = bip32.fromPrivateKey(privateKey, Buffer.from("0"));

  const output = signObj.inputs.map(output => {
      return {
          value: output.value,
          address: output.sendAddress!,
          tapInternalKey: output.sendPubKey,
      }
  });

  psbt.addInputs(output);

  const tweakedSigner = sendInternalKey.tweak(
      bitcoin.crypto.taggedHash('TapTweak', bitcoin.toXOnly(sendInternalKey.publicKey)),
  );
  await psbt.signInputAsync(0, tweakedSigner);
  psbt.finalizeAllInputs();
  const tx = psbt.extractTransaction();
  return tx.toBuffer().toString('hex');
}