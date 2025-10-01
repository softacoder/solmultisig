import React, { useEffect, useState } from "react";
import * as anchor from "@coral-xyz/anchor";
import idl from "../target/idl/solmultisig.json"; // Your IDL JSON file
import type { Solmultisig } from "../target/types/solmultisig"; // TypeScript IDL types

// ✅ Replace this with your actual deployed program ID
const PROGRAM_ID = new anchor.web3.PublicKey(
  "2bNfvViroNQMkZ9b8GXoL7xgeoveBFDyc1BkLKjvpmPM"
);

// ✅ Set up Solana connection (e.g., to Devnet)
const connection = new anchor.web3.Connection(
  anchor.web3.clusterApiUrl("devnet"),
  "confirmed"
);

// ✅ Dummy keypair wallet for development — DO NOT use in production!
const dummyKeypair = anchor.web3.Keypair.generate();

const dummyWallet: anchor.Wallet = {
  publicKey: dummyKeypair.publicKey,
  signTransaction: async <
    T extends anchor.web3.Transaction | anchor.web3.VersionedTransaction
  >(
    tx: T
  ): Promise<T> => tx,
  signAllTransactions: async <
    T extends anchor.web3.Transaction | anchor.web3.VersionedTransaction
  >(
    txs: T[]
  ): Promise<T[]> => txs,
  payer: dummyKeypair, // Needed for AnchorProvider in local/Node context
};

const App: React.FC = () => {
  const [program, setProgram] = useState<anchor.Program<Solmultisig> | null>(
    null
  );

  useEffect(() => {
    // ✅ Create an AnchorProvider with connection and dummy wallet
    const provider = new anchor.AnchorProvider(connection, dummyWallet, {
      preflightCommitment: "processed",
    });

    // ✅ Set this provider globally so Anchor uses it for everything
    anchor.setProvider(provider);

    // ✅ Create program instance using IDL + program ID
    const programInstance = new anchor.Program<Solmultisig>(
      idl as anchor.Idl,
      // PROGRAM_ID,
      provider
    );

    setProgram(programInstance);
  }, []);

  // ✅ Handler: Initialize multisig account
  const initializeMultisig = async () => {
    if (!program) {
      console.error("Program not initialized");
      return;
    }

    const signers = [dummyWallet.publicKey];
    const threshold = 2;

    const [multisigPDA] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("multisig"), dummyWallet.publicKey.toBuffer()],
      PROGRAM_ID
    );

    try {
      const txSig = await program.methods
        .initialize(signers, threshold)
        .accounts({
          multisigAccount: multisigPDA,
          user: dummyWallet.publicKey,
        })
        .rpc();

      console.log("✅ Multisig initialized:", txSig);
    } catch (error) {
      console.error("❌ Error initializing multisig:", error);
    }
  };

  // ✅ Handler: Add signer to existing multisig
  const addSigner = async (newSigner: anchor.web3.PublicKey) => {
    if (!program) {
      console.error("Program not initialized");
      return;
    }

    const [multisigPDA] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("multisig"), dummyWallet.publicKey.toBuffer()],
      PROGRAM_ID
    );

    try {
      const txSig = await program.methods
        .addSigner(newSigner)
        .accounts({
          multisigAccount: multisigPDA,
          user: dummyWallet.publicKey,
        })
        .rpc();

      console.log("✅ Signer added:", txSig);
    } catch (error) {
      console.error("❌ Error adding signer:", error);
    }
  };

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>🧾 Multisig Wallet</h1>

      <button onClick={initializeMultisig} style={{ marginBottom: 12 }}>
        Initialize Multisig
      </button>

      <button
        onClick={
          () => addSigner(new anchor.web3.PublicKey("NewSignerPublicKeyHere")) // Replace with actual signer pubkey
        }
      >
        Add Signer
      </button>
    </div>
  );
};

export default App;
