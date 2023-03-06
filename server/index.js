const express = require("express");
const app = express();
const cors = require("cors");
const { getAddress, recoverKey } = require("./util");
const { balances } = require("./wallet");
const port = 3042;

app.use(cors());
app.use(express.json());

// const balances = {
//   "0x1": 100,
//   "0x2": 50,
//   "0x3": 75,
// };

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  // console.log(address);
  let balance = balances[address];
  if (balance === undefined) balance = 0;
  // console.log(balances);
  console.log(balances);
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  const { msg, sign, recoveryBit, recipient } = req.body;
  const signed = JSON.parse(sign);
  const signature = new Uint8Array(signed.sign);
  // console.log(signature);
  try {
    const { amount } = msg;
    const publicKey = await recoverKey(
      JSON.stringify(msg),
      signature,
      recoveryBit
    );
    console.log("publicKey: " + publicKey);
    const sender = getAddress(publicKey);
    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      if (balances[recipient] === undefined) {
        balances[recipient] = 0;
      }
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
    console.log(balances);
  } catch (e) {
    console.log(e.message);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
