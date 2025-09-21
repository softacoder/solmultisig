use anchor_lang::prelude::*;

declare_id!("2bNfvViroNQMkZ9b8GXoL7xgeoveBFDyc1BkLKjvpmPM");

#[program]
pub mod solmultisig {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
