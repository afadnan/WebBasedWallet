import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";

export function SolanaWallet({ mnemonic }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState([]);

  const addWallet = async () => {
    try {
      const seed = await mnemonicToSeed(mnemonic);
      const path = `m/44'/501'/${currentIndex}'/0'`;
      const derivedSeed = derivePath(path, seed.toString("hex")).key;
      const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
      const keypair = Keypair.fromSecretKey(secret);

      setPublicKeys([...publicKeys, keypair.publicKey.toBase58()]);
      setCurrentIndex(currentIndex + 1);
    } catch (error) {
      console.error("Error generating wallet:", error);
    }
  };

  return (
    <div>
      <button className="SolWalBut" onClick={addWallet}>
        Add Sol Wallet
      </button>
      {publicKeys.map((p, index) => (
        <div className="Address" key={index}>
          Solana Address: {p}
        </div>
      ))}
    </div>
  );
}
