import React, { useState } from "react";
import { generateMnemonic } from "bip39";

function MnemonicGenerator() {
  
  const [mnemonic, setMnemonic] = useState("");

  const handleGenerateMnemonic = async () => {
    try {
      const mn = await generateMnemonic();
      setMnemonic(mn);
    } catch (error) {
      console.error("Error generating mnemonic:", error);
    }
  };

  return (
    <div>
      <button className="button-input" onClick={handleGenerateMnemonic}>
        Create Seed Phrase
      </button>

      {mnemonic && (
        <>
          <p className="seedtext">Your seed phrase:</p>
          <input className="seed-input" type="text" value={mnemonic} readOnly />
        </>
      )}
    </div>
  );
}

export default MnemonicGenerator;
