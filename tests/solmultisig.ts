// import * as anchor from "@coral-xyz/anchor";
// import { Program } from "@coral-xyz/anchor";
// import { Solmultisig } from "../target/types/solmultisig";
// import { expect } from "chai";

// describe("solmultisig", () => {
//   anchor.setProvider(anchor.AnchorProvider.env());
//   const provider = anchor.getProvider();
//   const program = anchor.workspace.Solmultisig as Program<Solmultisig>;

//   const userKeypair = anchor.web3.Keypair.generate();
//   const signers = [userKeypair.publicKey];
//   const threshold = 1;

//   let multisigPDA: anchor.web3.PublicKey;
//   let bump: number;

//   before(async () => {
//     [multisigPDA, bump] = await anchor.web3.PublicKey.findProgramAddress(
//       [Buffer.from("multisig"), userKeypair.publicKey.toBuffer()],
//       program.programId
//     );

//     const signature = await provider.connection.requestAirdrop(
//       userKeypair.publicKey,
//       1e9
//     );
//     await provider.connection.confirmTransaction(signature);
//   });

//   it("Is initialized!", async () => {
//     await program.methods
//       .initialize(signers, threshold)
//       .accounts({
//         multisigAccount: multisigPDA,
//         user: userKeypair.publicKey,
//         systemProgram: anchor.web3.SystemProgram.programId,
//       })
//       .signers([userKeypair])
//       .rpc();

//     const multisigAccount = await program.account.multisigAccount.fetch(
//       multisigPDA
//     );

//     expect(
//       multisigAccount.signers.map((k: anchor.web3.PublicKey) => k.toBase58())
//     ).to.deep.equal(signers.map((k) => k.toBase58()));
//     expect(multisigAccount.threshold).to.equal(threshold);
//   });

//   it("Should add a signer", async () => {
//     const newSigner = anchor.web3.Keypair.generate().publicKey;

//     await program.methods
//       .addSigner(newSigner)
//       .accounts({
//         multisigAccount: multisigPDA,
//         user: userKeypair.publicKey,
//       })
//       .signers([userKeypair])
//       .rpc();

//     const updatedAccount = await program.account.multisigAccount.fetch(
//       multisigPDA
//     );
//     expect(
//       updatedAccount.signers.map((k: anchor.web3.PublicKey) => k.toBase58())
//     ).to.include(newSigner.toBase58());
//   });
// });

import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Solmultisig } from "../target/types/solmultisig";
import { expect } from "chai";

describe("solmultisig", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider();
  const program = anchor.workspace.Solmultisig as Program<Solmultisig>;

  const userKeypair = anchor.web3.Keypair.generate();
  const signers = [userKeypair.publicKey];
  const threshold = 1;

  let multisigPDA: anchor.web3.PublicKey;
  let bump: number;

  before(async () => {
    [multisigPDA, bump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("multisig"), userKeypair.publicKey.toBuffer()],
      program.programId
    );

    const signature = await provider.connection.requestAirdrop(
      userKeypair.publicKey,
      1e9
    );
    await provider.connection.confirmTransaction(signature);
  });

  it("Is initialized!", async () => {
    await program.methods
      .initialize(signers, threshold)
      .accounts({
        multisigAccount: multisigPDA,
        user: userKeypair.publicKey,
        // Remove systemProgram
      })
      .signers([userKeypair])
      .rpc();

    const multisigAccount = await program.account.multisigAccount.fetch(
      multisigPDA
    );

    expect(
      multisigAccount.signers.map((k: anchor.web3.PublicKey) => k.toBase58())
    ).to.deep.equal(signers.map((k) => k.toBase58()));
    expect(multisigAccount.threshold).to.equal(threshold);
  });

  it("Should add a signer", async () => {
    const newSigner = anchor.web3.Keypair.generate().publicKey;

    await program.methods
      .addSigner(newSigner)
      .accounts({
        multisigAccount: multisigPDA,
        user: userKeypair.publicKey,
        // Remove systemProgram
      })
      .signers([userKeypair])
      .rpc();

    const updatedAccount = await program.account.multisigAccount.fetch(
      multisigPDA
    );
    expect(
      updatedAccount.signers.map((k: anchor.web3.PublicKey) => k.toBase58())
    ).to.include(newSigner.toBase58());
  });
});
