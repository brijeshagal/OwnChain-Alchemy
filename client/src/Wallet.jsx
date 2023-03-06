import server from './server';
import { getAddress } from './components/util';
import axios from 'axios';

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
}) {
  async function onChange(e) {
    const privateKey = e.target.value;
    setPrivateKey(privateKey);
    const temp_address = getAddress(privateKey);
    setAddress(temp_address);
    if (temp_address) {       
      const {
        data: { balance },
      } = await server.get(`/balance/${temp_address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input
          placeholder="Type a private key"
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>
      <>PublicKey: {address}</>

      <div className="balance">Your Balance: {balance}</div>
    </div>
  );
}

export default Wallet;