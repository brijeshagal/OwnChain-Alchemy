import { useState } from "react";
import server from "./server";
import { signMessage } from './components/util';
// Transfer on OwnChain
function Transfer({ privateKey, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");


  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const msg = { amount: parseInt(sendAmount) };

    const [ signature, recoveryBit ] = await
      signMessage(msg, privateKey);

    const sign = JSON.stringify({
      sign: Array.from(signature)
    });

    const body = { msg, sign, recoveryBit, recipient };
    // console.log(body)
    try {
      const {
        data: { balance },
      } = await server.post(`send`, body);
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
          placeholder="Enter amount.."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type recipient's private key"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
