// import * as anchor from "@coral-xyz/anchor";
// import { Solmultisig } from "../target/types/solmultisig";

// module.exports = async function (provider: anchor.AnchorProvider) {
//   anchor.setProvider(provider);

//   const program = anchor.workspace.solmultisig as anchor.Program<Solmultisig>;

//   const signers: anchor.web3.PublicKey[] = [
//     /* array of signers */
//   ];
//   const threshold = 2; // Example threshold

//   // Generate the multisig PDA (Program Derived Address) if required
//   const [multisigPDA, bump] = await anchor.web3.PublicKey.findProgramAddress(
//     [Buffer.from("multisig"), provider.wallet.publicKey.toBuffer()],
//     program.programId
//   );

//   try {
//     const tx = await program.methods
//       .initialize(signers, threshold) // Pass signers and threshold as arguments
//       .accounts({
//         multisigAccount: multisigPDA,
//         user: provider.wallet.publicKey,
//         systemProgram: anchor.web3.SystemProgram.programId,
//       })
//       .rpc();

//     console.log("Program deployed:", tx);
//   } catch (error) {
//     console.error("Error deploying program:", error);
//   }
// };

// // import * as anchor from "@coral-xyz/anchor";
// // import { Solmultisig } from "../target/types/solmultisig";

// // module.exports = async function (provider: anchor.AnchorProvider) {
// //   anchor.setProvider(provider);

// //   // Initialize program using anchor.workspace and the proper typing
// //   const program = anchor.workspace.solmultisig as anchor.Program<Solmultisig>;

// //   // Deploy program (for example, initialize)
// //   try {
// //     const tx = await program.methods
// //       .initialize(/* params */) // Pass necessary parameters for your method
// //       .rpc(); // Make sure to use the rpc method here

// //     console.log("Program deployed:", tx);
// //   } catch (error) {
// //     console.error("Error deploying program:", error);
// //   }
// // };

import * as anchor from "@coral-xyz/anchor";
import { Solmultisig } from "../target/types/solmultisig";

module.exports = async function (provider: anchor.AnchorProvider) {
  anchor.setProvider(provider);

  const program = anchor.workspace.solmultisig as anchor.Program<Solmultisig>;

  const signers: anchor.web3.PublicKey[] = [
    /* array of signers */
  ];
  const threshold = 2; // Example threshold

  // Generate the multisig PDA (Program Derived Address) if required
  const [multisigPDA, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("multisig"), provider.wallet.publicKey.toBuffer()],
    program.programId
  );

  try {
    const tx = await program.methods
      .initialize(signers, threshold) // Pass signers and threshold as arguments
      .accounts({
        multisigAccount: multisigPDA,
        user: provider.wallet.publicKey,
        // Remove systemProgram from accounts
      })
      .rpc();

    console.log("Program deployed:", tx);
  } catch (error) {
    console.error("Error deploying program:", error);
  }
};
