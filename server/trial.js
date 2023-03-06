const secp = require("ethereum-cryptography/secp256k1");
// const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");
const { getAddress } = require("./util");

const privateKey = secp.utils.randomPrivateKey();

console.log("The PrivateKey is: ", toHex(privateKey));

const publicKey = secp.getPublicKey(privateKey);

console.log("The corresponding PublicKey is: ", toHex(getAddress(publicKey)));
