import React, { useEffect, useState } from "react";
import * as anchor from "@coral-xyz/anchor";
import idl from "../target/idl/solmultisig.json";
import type { Solmultisig } from "../target/types/solmultisig";

// Program ID
const PROGRAM_ID = new anchor.web3.PublicKey(
  "2bNfvViroNQMkZ9b8GXoL7xgeoveBFDyc1BkLKjvpmPM"
);

// Dummy wallet object with publicKey, connection, and payer
const dummyWallet = {
  publicKey: new anchor.web3.PublicKey("YourWalletPublicKeyHere"), // Replace with actual wallet public key
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
  connection: new anchor.web3.Connection(anchor.web3.clusterApiUrl("devnet")),
  payer: new anchor.web3.PublicKey("YourWalletPublicKeyHere"), // Add the payer here
};

// Fixing the wallet structure for Anchor
const wallet: anchor.Wallet = {
  publicKey: dummyWallet.publicKey,
  signTransaction: async <
    T extends anchor.web3.Transaction | anchor.web3.VersionedTransaction
  >(
    tx: T
  ): Promise<T> => {
    return dummyWallet.signTransaction(tx);
  },
  signAllTransactions: async <
    T extends anchor.web3.Transaction | anchor.web3.VersionedTransaction
  >(
    txs: T[]
  ): Promise<T[]> => {
    return dummyWallet.signAllTransactions(txs);
  },
  payer: dummyWallet.payer, // Include the payer
};

const App: React.FC = () => {
  const [program, setProgram] = useState<anchor.Program<Solmultisig> | null>(
    null
  );

  useEffect(() => {
    if (!wallet) return;

    // Create the provider using the wallet and connection
    const provider = new anchor.AnchorProvider(wallet.connection, wallet, {
      preflightCommitment: "processed", // Optional: Change commitment level if needed
    });

    // Initialize program instance with the provider
    const programInstance = new anchor.Program<Solmultisig>(
      idl as anchor.Idl,
      PROGRAM_ID,
      provider
    );
    setProgram(programInstance);
  }, [wallet]);

  const initializeMultisig = async () => {
    if (!program || !wallet) {
      console.error("Program or wallet not initialized");
      return;
    }

    const signers = [wallet.publicKey];
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

  const addSigner = async (newSigner: anchor.web3.PublicKey) => {
    if (!program || !wallet) {
      console.error("Program or wallet not initialized");
      return;
    }

    const [multisigPDA, _] = await anchor.web3.PublicKey.findProgramAddress(
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
        onClick={() =>
          addSigner(new anchor.web3.PublicKey("NewSignerPublicKeyHere"))
        }
      >
        Add Signer
      </button>
    </div>
  );
};

export default App;
