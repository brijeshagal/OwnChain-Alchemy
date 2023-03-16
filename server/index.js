const express = require("express");
const app = express();
const multer = require("multer");
const upload = multer();
const bodyParser = require("body-parser");
const cors = require("cors");
const { getAddress, recoverKey } = require("./util");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const port = 3042;
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

let balances = {
  "04366a8afe5f35133d4cc1c96e4ca230cc5b3236789893b3d4bfa53818ff4a35ac7ea73fbaedc95f5d8abe3bfcfda3cb5293e9d21e0dc43414297b04acc6a723a1": 100,
  "04673f89b5656cdb7d094392a85e8d228a324c9a0ff1435e5a2731092fd8cd6132e38800cf89e502163e5a2a1cd93b5e9aa4b33cbf81a7962b722ee46f5863897f": 50,
  "04e8d2b79d53e3c64c9b817336ade2d4af80888832bfb881e44daebb0c161f58bb4d6e33b5e4ee2bce3d90f203cc645d8d6773834a05a88119a61d75a7daa65c09": 75,
};
//2936806fbb242248b0b731a5b761b8aec18af82c3dfcee838f713731a6e80f5b
//c88f93cab5df04444daffc73718e749af8f6cbdde42ed04c26a21673dd11254a
//13344c8f2597830680fd1f04b71baeaff615f0ee355080a3feec11063794933a

app.post("/getBalance", async (req, res) => {
  const { publicKey } = req.body;
  // console.log(publicKey);
  if (!balances[publicKey]) balances[publicKey] = 0;
  console.log(balances[publicKey]);
  res.send({ balance: balances[publicKey] });
});

app.post("/send", upload.none(), async (req, res) => {
  const { signature, recoveryBit, amount, recepient, publicKey } = req.body;
  const sign = new Uint8Array(signature.split(","));
  const recovery = parseInt(recoveryBit);
  console.log(sign);
  const sender = await recoverKey(amount, sign, recovery);
  try {
    if (publicKey !== sender) {
      res.status(400).send({ message: "Unauthorized" });
      return;
    }
    if (!balances[sender]) balances[sender] = 0;
    if (!balances[recepient]) balances[recepient] = 0;
    let amt = parseInt(amount);
    console.log("Balance of sender: ", balances[sender]);
    console.log("Sender: ", sender);
    if (balances[sender] < amt) {
      res.status(400).send({ message: "Not enough funds!" });
      return;
    } else {
      balances[sender] -= amt;
      console.log("Amount: ", amt);
      balances[recepient] += amt;
      res.send({ balance: balances[sender] });
    }
  } catch (e) {
    console.log(e.message);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
