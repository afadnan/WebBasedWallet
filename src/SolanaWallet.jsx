import { useState, useEffect } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import {
  Keypair,
  Connection,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  PublicKey,
} from "@solana/web3.js";
import nacl from "tweetnacl";

// Replace with your Alchemy Solana Mainnet or Devnet RPC URL
const ALCHEMY_RPC_URL =
  "https://solana-mainnet.g.alchemy.com/v2/https://solana-devnet.g.alchemy.com/v2/FwdhXwz5TEVKoa5nxDNfKq49nb7-YHFO";

const connection = new Connection(ALCHEMY_RPC_URL);

export function SolanaWallet({ mnemonic }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState([]);
  const [balances, setBalances] = useState({});
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  // Function to add a wallet and store the public key
  const addWallet = async () => {
    const seed = await mnemonicToSeed(mnemonic); // Ensure this is awaited
    const path = `m/44'/501'/${currentIndex}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keypair = Keypair.fromSecretKey(secret);
    setCurrentIndex(currentIndex + 1);
    setPublicKeys([...publicKeys, keypair.publicKey]);

    // Fetch and update the balance for the new wallet
    await fetchBalance(keypair.publicKey);
  };

  // Function to check and update the balance of a specific public key
  const fetchBalance = async (publicKey) => {
    try {
      const balance = await connection.getBalance(publicKey);
      setBalances((prevBalances) => ({
        ...prevBalances,
        [publicKey.toBase58()]: balance / LAMPORTS_PER_SOL, // Convert Lamports to SOL
      }));
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  // Function to send SOL
  const sendSol = async (publicKey) => {
    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(recipient),
          lamports: amount * LAMPORTS_PER_SOL, // Convert SOL to lamports
        })
      );

      const { blockhash } = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Find the corresponding secret key for the public key
      const keypair = Keypair.fromSecretKey(
        publicKeys.find((p) => p.equals(publicKey)).secretKey
      );
      await transaction.sign(keypair);

      const signature = await connection.sendRawTransaction(
        transaction.serialize()
      );
      await connection.confirmTransaction(signature);
      alert("Transaction successful: " + signature);

      // Refresh the balance after sending SOL
      await fetchBalance(publicKey);
    } catch (error) {
      console.error("Error sending SOL:", error);
      alert("Transaction failed: " + error.message);
    }
  };

  return (
    <div>
      <button className="SolWalBut" onClick={addWallet}>
        Add Solana wallet
      </button>
      {publicKeys.map((p, index) => (
        <div key={index}>
          <div className="publictext">Solana Public Address: {p.toBase58()}</div>
          <div>Balance: {balances[p.toBase58()] || 0} SOL</div>
          <div>
            <input
              className="Address"
              type="text"
              placeholder="Recipient Address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <input
              className="Address"
              type="number"
              placeholder="Amount (SOL)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={() => sendSol(p)}>Send SOL</button>
          </div>
        </div>
      ))}
    </div>
  );
}
