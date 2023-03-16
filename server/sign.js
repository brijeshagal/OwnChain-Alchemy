const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

const PRIVATE_KEY =
  "a36cf0c41ba82bd3d67540dfa0f3bec6b448454beb69243bbaa1a88ced2c12ed";
function getHash(message) {
  return keccak256(utf8ToBytes(message));
}
async function signMessage(msg) {
  const hashed = getHash(msg);
  console.log(await secp.sign(hashed, PRIVATE_KEY, { recovered: true }));
}
signMessage("helloworld");
