import * as secp from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

const hashMessage = (message) => keccak256(utf8ToBytes(message));
const getHash = (message) => keccak256(utf8ToBytes(message));
export const getAddressHex = (publicKey) => {
  const pre = keccak256(publicKey.slice(1));
  return pre.slice(-20);
};

export const signMessage = async (msg, privateKey) =>
  await secp.sign(msg, privateKey, {
    recovered: true,
  });

export const getAddress = (privateKey) =>
  toHex(getAddressHex(secp.getPublicKey(privateKey)));
