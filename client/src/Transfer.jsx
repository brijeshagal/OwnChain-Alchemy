import { useState } from "react";
import server from "./server";
import { signMessage } from "./util";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";

// Transfer on OwnChain
function Transfer({ publicKey, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recepient, setRecepient] = useState("");
  // const [signature, setSignature] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  // const [message, setMessage] = useState("");
  // const [recoveryBit, setRecoveryBit] = useState("");
  // const signMsg = async () => {
  //   const [sig, recoverybit] = await signMessage(message);
  //   setSignature(sig);
  //   setRecoveryBit(recoverybit);
  // };
  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    const hash = keccak256(utf8ToBytes(sendAmount));
    const [signature, recoveryBit] = await signMessage(hash, privateKey);
    console.log(signature);    
    setPrivateKey('');    
    const form = new FormData();
    form.set("signature", signature);
    form.set("recoveryBit", recoveryBit);
    form.set("amount", sendAmount);
    form.set("recepient", recepient);
    form.set("publicKey", publicKey);
    try {
      const {
        data: { balance },
      } = await server.post(
        "/send",
        form
        //  {
        //   headers: { "Content-Type": "multipart/form-data" },
        // }
      );
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>
      <label>
        Send Amount
        <input
          placeholder="Enter the amount"
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>
      <label>
        Recipient
        <input
          placeholder="Enter recipient's public key"
          value={recepient}
          onChange={setValue(setRecepient)}
        ></input>
      </label>
      <label>
        Signature
        <input
          placeholder="Enter privateKey"
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
        ></input>
      </label>
      <input
        type="submit"
        onClick={transfer}
        className="button"
        value="Sign and Transfer"
      />
    </form>
  );
}

export default Transfer;
