const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

function getAddress(publicKey) {
  return keccak256(publicKey.slice(1, publicKey.length)).slice(-20);
}

function getPublicKey(privateKey){
  return secp.getPublicKey(privateKey);
}

async function recoverKey (message, signature, recoveryBit){
  const hash = keccak256(utf8ToBytes(message))
  return toHex(secp.recoverPublicKey(hash, signature, recoveryBit));
};

module.exports = {recoverKey};
