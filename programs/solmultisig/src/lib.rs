use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

declare_id!("2bNfvViroNQMkZ9b8GXoL7xgeoveBFDyc1BkLKjvpmPM");

#[program]
pub mod solmultisig {
    use super::*;

    // Initialize the multisig account with the provided signers and threshold
    pub fn initialize(ctx: Context<Initialize>, signers: Vec<Pubkey>, threshold: u8) -> Result<()> {
        let multisig_account = &mut ctx.accounts.multisig_account;
        multisig_account.signers = signers;
        multisig_account.threshold = threshold;
        multisig_account.transaction_counter = 0;
        Ok(())
    }

    // Add a new signer to the multisig account
    pub fn add_signer(ctx: Context<AddSigner>, new_signer: Pubkey) -> Result<()> {
        let multisig_account = &mut ctx.accounts.multisig_account;
        multisig_account.signers.push(new_signer);
        Ok(())
    }
}

// Structs for account data
#[account]
pub struct MultisigAccount {
    pub signers: Vec<Pubkey>,       // List of signers
    pub threshold: u8,              // Threshold for multisig approval
    pub transaction_counter: u64,   // Counter for transactions
}

// Context for initializing the multisig account
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 32 * 10 + 1 + 8)]  // Calculate appropriate space for 10 signers
    pub multisig_account: Account<'info, MultisigAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(address = system_program::ID)]  // Ensure correct system program address
    pub system_program: Program<'info, System>,
}

// Context for adding a signer
#[derive(Accounts)]
pub struct AddSigner<'info> {
    #[account(mut)]
    pub multisig_account: Account<'info, MultisigAccount>,
    pub user: Signer<'info>,
}
