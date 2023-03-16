import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [publicKey, setPublicKey] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        publicKey={publicKey}
        setPublicKey={setPublicKey}
      />
      <Transfer
        setBalance={setBalance}        
        publicKey={publicKey}
      />
    </div>
  );
}

export default App;
