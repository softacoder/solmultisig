import React, { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, web3 } from "@coral-xyz/anchor";
import { Solmultisig } from "../target/types/solmultisig";

const App: React.FC = () => {
  const [wallet, setWallet] = useState<any>(null); // Set up wallet here
  const [program, setProgram] = useState<Program<Solmultisig> | null>(null);

  useEffect(() => {
    const initAnchorProgram = async () => {
      const connection = new Connection("https://api.devnet.solana.com");
      const provider = new AnchorProvider(connection, wallet, {});
      const program = new Program<Solmultisig>(
        new PublicKey("2bNfvViroNQMkZ9b8GXoL7xgeoveBFDyc1BkLKjvpmPM"), // Replace with your actual program ID
        programId,
        provider
      );
      setProgram(program);
    };

    initAnchorProgram();
  }, [wallet]);

  const initializeMultisig = async () => {
    if (program) {
      const signers = [wallet.publicKey];
      const threshold = 2;
      try {
        const tx = await program.methods.initialize(signers, threshold).rpc();
        console.log("Multisig initialized!", tx);
      } catch (error) {
        console.error("Error initializing multisig:", error);
      }
    }
  };

  return (
    <div>
      <h1>Multisig Wallet</h1>
      <button onClick={initializeMultisig}>Initialize Multisig</button>
    </div>
  );
};

export default App;
