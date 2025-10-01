import React, { useEffect, useState } from "react";
import * as anchor from "@coral-xyz/anchor";
import idl from "../target/idl/solmultisig.json";
import type { Solmultisig } from "../target/types/solmultisig";

// Program ID (replace with your actual deployed program address)
const PROGRAM_ID = new anchor.web3.PublicKey(
  "2bNfvViroNQMkZ9b8GXoL7xgeoveBFDyc1BkLKjvpmPM"
);

// Set up the connection (Devnet in this case)
const connection = new anchor.web3.Connection(
  anchor.web3.clusterApiUrl("devnet")
);

// Create a dummy wallet with publicKey and mock signing methods
// NOTE: This will NOT work for real signing; use a wallet adapter (like Phantom) in production
const dummyPublicKey = new anchor.web3.PublicKey("YourWalletPublicKeyHere"); // 🔁 Replace with actual public key

const wallet: anchor.Wallet = {
  publicKey: dummyPublicKey,
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
  payer: anchor.web3.Keypair.generate(), // Only needed in Node environments
};

const App: React.FC = () => {
  const [program, setProgram] = useState<anchor.Program<Solmultisig> | null>(
    null
  );

  useEffect(() => {
    // Set up provider
    const provider = new anchor.AnchorProvider(connection, wallet, {
      preflightCommitment: "processed",
    });

    // Optionally set provider globally
    anchor.setProvider(provider);

    // Create program instance using the IDL and provider
    const programInstance = new anchor.Program<Solmultisig>(
      idl as anchor.Idl,
      PROGRAM_ID,
      provider
    );

    setProgram(programInstance);
  }, []);

  // Initialize a multisig account
  const initializeMultisig = async () => {
    if (!program) {
      console.error("Program not initialized");
      return;
    }

    const signers = [wallet.publicKey]; // Initial signers
    const threshold = 2;

    const [multisigPDA, bump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("multisig"), wallet.publicKey.toBuffer()],
      PROGRAM_ID
    );

    try {
      const tx = await program.methods
        .initialize(signers, threshold)
        .accounts({
          multisigAccount: multisigPDA,
          user: wallet.publicKey,
        })
        .rpc();

      console.log("Multisig initialized!", tx);
    } catch (error) {
      console.error("Error initializing multisig:", error);
    }
  };

  // Add a new signer to the multisig
  const addSigner = async (newSigner: anchor.web3.PublicKey) => {
    if (!program) {
      console.error("Program not initialized");
      return;
    }

    const [multisigPDA] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("multisig"), wallet.publicKey.toBuffer()],
      PROGRAM_ID
    );

    try {
      const tx = await program.methods
        .addSigner(newSigner)
        .accounts({
          multisigAccount: multisigPDA,
          user: wallet.publicKey,
        })
        .rpc();

      console.log("Signer added!", tx);
    } catch (error) {
      console.error("Error adding signer:", error);
    }
  };

  return (
    <div>
      <h1>Multisig Wallet</h1>
      <button onClick={initializeMultisig}>Initialize Multisig</button>
      <button
        onClick={
          () => addSigner(new anchor.web3.PublicKey("NewSignerPublicKeyHere")) // 🔁 Replace with valid public key
        }
      >
        Add Signer
      </button>
    </div>
  );
};

export default App;
