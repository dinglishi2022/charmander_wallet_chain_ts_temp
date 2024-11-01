const ecc = require('tiny-secp256k1');
const { BIP32Factory } = require('bip32');
const bip32 = BIP32Factory(ecc);
import * as bip39 from 'bip39';
import { generateMnemonic } from "bip39";
import bs58check from "bs58check";
import { Buffer } from 'safe-buffer';
import Client from 'mina-signer';

export function validateMnemonic(mnemonic) {
    return bip39.validateMnemonic(mnemonic);
}

export function getHDpath(account = 0) {
    let purpose = 44
    let index = 0
    let charge = 0
    let hdPath = "m/" + purpose + "'/" + "12586" + "'/" + account + "'/" + charge + "/" + index
    return hdPath
}

export function generateMne() {
    let mne = generateMnemonic(192);
    return mne
}

export function decodeAddress(address) {
    try {
        const decodedAddress = bs58check.decode(address).toString('hex');
        return decodedAddress;
    } catch (ex) {
        return null
    }
}

function reverse(bytes) {
    const reversed = new Buffer(bytes.length);
    for (let i = bytes.length; i > 0; i--) {
        reversed[bytes.length - i] = bytes[i - 1];
    }
    return reversed;
}
export async function importWalletByMnemonic(mnemonic, index = 0) {
    const seed = await bip39.mnemonicToSeedSync(mnemonic)
    const masterNode = bip32.fromSeed(seed)
    let hdPath = getHDpath(index)
    const child0 = masterNode.derivePath(hdPath)
    // @ts-ignore
    child0.privateKey[0] &= 0x3f;
    const childPrivateKey = reverse(child0.privateKey)
    // const privateKeyHex = `5a01${childPrivateKey.toString('hex')}`
    //
    // const privateKeyBytes = Uint8Array.from(Buffer.from(privateKeyHex, 'hex'))
    // const privateKey = bs58check.encode(privateKeyBytes)
    //
    const privateKeyHex = `5a01${childPrivateKey.toString('hex')}`
    const buffer = Buffer.from(privateKeyHex, 'hex')
    const privateKeyBytes = Uint8Array.from(buffer.toJSON().data)
    const privateKey = bs58check.encode(privateKeyBytes)



    const client = new Client({ network: "mainnet" })
    const publicKey = client.derivePublicKey(privateKey)
    return {
        priKey: privateKey,
        pubKey: publicKey,
        hdIndex: index
    }
}

export async function importWalletByKeystore(keyfile, keyfilePassword) {
    try {
        if (typeof keyfile === 'string') {
            keyfile = JSON.parse(keyfile)
        }
        const _sodium = (await import('libsodium-wrappers')).default
        await _sodium.ready
        const sodium = _sodium
        let key = await sodium.crypto_pwhash(
            32,
            keyfilePassword,
            bs58check.decode(keyfile.pwsalt).slice(1),
            keyfile.pwdiff[1],
            keyfile.pwdiff[0],
            sodium.crypto_pwhash_ALG_ARGON2I13
        )
        const ciphertext = bs58check.decode(keyfile.ciphertext).slice(1)
        const nonce = bs58check.decode(keyfile.nonce).slice(1)
        const privateKeyHex = '5a' + sodium.crypto_secretbox_open_easy(ciphertext, nonce, key, 'hex')



        const buffer = Buffer.from(privateKeyHex, 'hex')
        const privateKeyBytes = Uint8Array.from(buffer.toJSON().data)
        const privateKey = bs58check.encode(privateKeyBytes)

        // const privateKeyBuffer = Buffer.from(privateKeyHex, 'hex')
        // const privateKey = bs58check.encode(privateKeyBuffer )
        //


        const client = new Client({ network: "mainnet" })
        const publicKey = client.derivePublicKey(privateKey)
        return {
            priKey: privateKey,
            pubKey: publicKey,
        }
    }
    catch (e) {
        return  {error: 'keystoreError' , type:"local"}
    }
}
export async function importWalletByPrivateKey(privateKey) {
    const client = new Client({ network: "mainnet" })
    const publicKey = client.derivePublicKey(privateKey)
    return {
        priKey: privateKey,
        pubKey: publicKey,
    }
}

export function importWallet(mnemonicOrPrivateKey, keyType) {
    switch (keyType) {
        case 'mnemonic':
            return importWalletByMnemonic(mnemonicOrPrivateKey)
        case 'priKey':
            return importWalletByPrivateKey(mnemonicOrPrivateKey)
    }
}