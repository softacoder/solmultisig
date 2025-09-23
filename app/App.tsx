import React, { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, web3 } from "coral-xyz/anchor";
import { Solmultisig } from "../target/types/solmultisig";

const App: React.FC = () => {
  const [wallet, setWallet] = useState<any>(null);
  const [program, setProgram] = useState<Program<Solmultisig> | null>(null);
};
