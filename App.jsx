import { useState } from "react";
import MnemonicGenerator from "./MnemonicGenerator.jsx";
import { SolanaWallet } from "./SolanaWallet.jsx";
import { EthWallet } from "./EthWallet.jsx";

function App() {
  const [mnemonic, setMnemonic] = useState("");

  return (
    <>
      <h1 className="heading">Crypto Wallet</h1>
      <hr />

      <MnemonicGenerator />
      <br />
      <br />
      <div className="SolEth">
        <div>
          <SolanaWallet />
        </div>
        <div>
          <EthWallet />
        </div>
      </div>
    </>
  );
}

export default App;
