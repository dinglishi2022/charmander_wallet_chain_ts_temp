// @ts-ignore
import { encodeAddress } from '@polkadot/util-crypto';
//import { CHAINS_SS58FORMAT } from './constants';
const { derivePath, getPublicKey } = require('ed25519-hd-key');

/**
 * Get address from seed
 * @param seedHex
 * @param addressIndex
 * @returns
 */
export async function createDotAddress (seedHex: string, addressIndex: number, chain: string, network: string) {
  const { key } = derivePath("m/44'/354'/0'/0'/" + addressIndex + "'", seedHex);
  //const keyword = `dot_main_net`;
  const pubKey = getPublicKey(key, false).toString('hex');
  console.log("publicKey==", pubKey)
  let publicKey = pubKey;
  if(typeof publicKey === "string" && publicKey.substring(0,2)!=="0x"){
      publicKey = "0x" + publicKey;
  }
  const address = encodeAddress(publicKey,0)
  return {
      "privateKey": key.toString('hex') + publicKey,
      "publicKey": publicKey,
      "address":address
    }
}
//   const { key } = derivePath("m/44'/354'/1'/" + addressIndex + "'", seedHex);
//  // const keyword = `${chain}_${network}`;
//  // if (CHAINS_SS58FORMAT[keyword] === undefined) throw Error('INCORRECT INPUT: network');
//   const publicKey = getPublicKey(<Buffer> new Uint8Array(key), false).toString('hex');
//   console.log('encodeAddress(publicKey)==', encodeAddress(publicKey, 0));
//   return '';


/**
 * sign transaction
 * @param params
 * @returns
 */
export async function signDotTransaction (params: any): Promise<string> {
  return '';
}

/**
 * address
 * network type
 * @param params
 */
export function verifyDotAddress (params: any) {

}

/**
 * import address
 * private key
 * network
 * @param privateKey
 */
export function importDotAddress (privateKey: string) {

}
