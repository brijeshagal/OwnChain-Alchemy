const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

const getHash = (message) => keccak256(utf8ToBytes(message));

const getHex = (publicKey) => {
  const tmp = keccak256(publicKey.slice(1));

  return tmp.slice(-20);
};

exports.signMsg = async (msg, privateKey) =>
  await secp.sign(getHash(JSON.stringify(msg)), privateKey, {
    recovered: true,
  });

exports.getAddress = (publicKey) => toHex(getHex(publicKey));

exports.recoverKey = async (message, signature, recoveryBit) => {
  const hex = toHex(getHash(message));

  return secp.recoverPublicKey(hex, signature, recoveryBit);
};
