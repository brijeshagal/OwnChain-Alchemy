import server from "./server";

function Wallet({ balance, setBalance, publicKey, setPublicKey }) {
  async function onChange(e) {
    const pubKey = e.target.value;
    await setPublicKey(pubKey);
    console.log(pubKey);
    const {
      data: { balance },
    } = await server.post("/getBalance", {
      publicKey: pubKey,
    });
    console.log(balance);
    setBalance(balance);
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Public Key
        <input
          placeholder="Enter your public key"
          value={publicKey}
          onChange={onChange}
        ></input>
      </label>
      <div className="balance">Your Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
