// // Migrations are an early feature. Currently, they're nothing more than this
// // single deploy script that's invoked from the CLI, injecting a provider
// // configured from the workspace's Anchor.toml.

// import * as anchor from "@coral-xyz/anchor";

// module.exports = async function (provider: anchor.AnchorProvider) {
//   // Configure client to use the provider.
//   anchor.setProvider(provider);

//   // Add your deploy script here.
// };

import * as anchor from "@coral-xyz/anchor";
import { Solmultisig } from "../target/types/solmultisig";

module.exports = async function (provider: anchor.AnchorProvider) {
  anchor.setProvider(provider);

  const program = anchor.workspace.solmultisig as Program<Solmultisig>;

  // Deploy program
  const tx = await program.rpc.initialize(/* params */);
  console.log("Program deployed:", tx);
};
