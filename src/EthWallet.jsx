import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";

export const EthWallet = ({ mnemonic }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addresses, setAddresses] = useState([]);

  const addEthWallet = async () => {
    try {
      const seed = await mnemonicToSeed(mnemonic);
      const derivationPath = `m/44'/60'/${currentIndex}'/0'/0`;
      const hdNode = HDNodeWallet.fromSeed(seed);
      const child = hdNode.derivePath(derivationPath);
      const privateKey = child.privateKey;
      const wallet = new Wallet(privateKey);

      setAddresses((prevAddresses) => [...prevAddresses, wallet.address]);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } catch (error) {
      console.error("Error generating ETH wallet:", error);
    }
  };

  return (
    <div>
      <button className="EthWalBut" onClick={addEthWallet}>
        Add ETH Wallet
      </button>

      {addresses.map((address, index) => (
        <div className="Address" key={index}>
          Eth Address - {address}
        </div>
      ))}
    </div>
  );
};
