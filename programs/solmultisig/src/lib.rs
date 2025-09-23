// use anchor_lang::prelude::*;

// declare_id!("2bNfvViroNQMkZ9b8GXoL7xgeoveBFDyc1BkLKjvpmPM");

// #[program]
// pub mod solmultisig {
//     use super::*;

//     pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
//         msg!("Greetings from: {:?}", ctx.program_id);
//         Ok(())
//     }
// }

// #[derive(Accounts)]
// pub struct Initialize {}

use anchor_lang::prelude::*;

declare_id!("2bNfvViroNQMkZ9b8GXoL7xgeoveBFDyc1BkLKjvpmPM");

#[program]
pub mod solmultisig {
    use super::*;

    // Initialize the multisig wallet with a list of signers and a threshold
    pub fn initialize(ctx: Context<Initialize>, signers: Vec<Pubkey>, threshold: u8) -> Result<()> {
        let multisig_account = &mut ctx.accounts.multisig_account;
        multisig_account.signers = signers;
        multisig_account.threshold = threshold;
        multisig_account.transaction_counter = 0;

        msg!("Multisig wallet initialized with signers: {:?}", signers);
        Ok(())
    }
}

// Add a new signer to the multisig wallet
pub fn add_signer(ctx: Context<AddSigner>, signer: Pubkey) -> Result<()> {
    let multisig_account = &mut ctx.accounts.multisig_account;
    multisig_account.signers.push(signer);
    msg!("Signer added: {:?}", signer);
    Ok(())
}

// Remove a signer from the multisig wallet
pub fn remove_signer(ctx: Context<RemoveSigner>, signer: Pubkey) -> Result<()> {
    let multisig_account = &mut ctx.accounts.multisig_account;
    if let Some(index) = multisig_account.signers.iter().position(|&x| s == signer) {
        multisig_account.signers.remove(index);
        msg!("Signer removed: {:?}", signer);
    } else {
        return Err(ErrorCode::SignerNotFound.into());
    }
    Ok(())
}

// Example of sending a transaction (you will expand this as needed)
pub fn submit_transaction(ctx: Context<SubmitTransaction>, transaction: Vec<u8>) -> Result {
    let multisig_account = &mut ctx.accounts.multisig_account;
    multisig_account.transaction_counter += 1;
    msg!("Transaction submitted. Counter: {}", multisig_account.transaction_counter);
    Ok(())
}

// Define the accounts for the multisig account
#[account]
pub struct MultisigAccount {
    pub signers: Vec<Pubkey>,
    pub threshold: u8,
    pub transaction_counter: u64,
}

// Define the accounts used in the program
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 32 * 10)]
    pub multisig_account: Account<'info, MultisigAccount>,
    #[account(signer)]
    pub user: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

