import { randomBytes } from '@fuel-ts/crypto';

import type { Account } from '../account';
import { coinQuantityfy, ScriptTransactionRequest } from '../providers';
import type { CoinQuantityLike } from '../providers';
import { WalletUnlocked } from '../wallet';

export const seedTestWallet = async (wallet: Account, quantities: CoinQuantityLike[]) => {
  const genesisWallet = new WalletUnlocked(
    process.env.GENESIS_SECRET || randomBytes(32),
    wallet.provider
  );

  // Connect to the same Provider as wallet
  const resources = await genesisWallet.getResourcesToSpend(quantities);

  // Create transaction
  const request = new ScriptTransactionRequest({
    maxFee: 1000,
  });

  request.addResources(resources);

  quantities
    .map(coinQuantityfy)
    .forEach(({ amount, assetId }) => request.addCoinOutput(wallet.address, amount, assetId));
  await genesisWallet.sendTransaction(request, { awaitExecution: true });
};
