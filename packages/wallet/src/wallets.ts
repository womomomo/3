//
// Because WalletLocked and WalletUnlocked has a cycle dependency
// it's not possible to split the two classes in different files
//
/* eslint-disable max-classes-per-file */
import { HDWallet } from '@fuel-ts/hdwallet';
import { Mnemonic } from '@fuel-ts/mnemonic';
import type { Provider } from '@fuel-ts/providers';
import { Signer } from '@fuel-ts/signer';
import type { BytesLike } from 'ethers';

import { Account } from './account';
import { BaseWalletUnlocked } from './base-unlocked-wallet';
import { decryptKeystoreWallet } from './keystore-wallet';
import type { GenerateOptions } from './types/GenerateOptions';

/**
 * `WalletLocked` provides the functionalities for a locked  wallet.
 */
export class WalletLocked extends Account {
  /**
   * Unlocks the wallet using the provided private key and returns an instance of WalletUnlocked.
   *
   * @param privateKey - The private key used to unlock the wallet.
   * @returns An instance of WalletUnlocked.
   */
  unlock(privateKey: BytesLike): WalletUnlocked {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return new WalletUnlocked(privateKey, this._provider);
  }
}

/**
 * `WalletUnlocked` provides the functionalities for an unlocked wallet.
 */
export class WalletUnlocked extends BaseWalletUnlocked {
  /**
   * Locks the wallet and returns an instance of WalletLocked.
   *
   * @returns An instance of WalletLocked.
   */
  lock(): WalletLocked {
    this.signer = () => new Signer('0x00');
    return new WalletLocked(this.address, this._provider);
  }

  /**
   * Generate a new Wallet Unlocked with a random key pair.
   *
   * @param generateOptions - Options to customize the generation process (optional).
   * @returns An instance of WalletUnlocked.
   */
  static generate(generateOptions?: GenerateOptions): WalletUnlocked {
    const privateKey = Signer.generatePrivateKey(generateOptions?.entropy);

    return new WalletUnlocked(privateKey, generateOptions?.provider);
  }

  /**
   * Create a Wallet Unlocked from a seed.
   *
   * @param seed - The seed phrase.
   * @param provider - A Provider instance (optional).
   * @param path - The derivation path (optional).
   * @returns An instance of WalletUnlocked.
   */
  static fromSeed(seed: string, provider?: Provider, path?: string): WalletUnlocked {
    const hdWallet = HDWallet.fromSeed(seed);
    const childWallet = hdWallet.derivePath(path || WalletUnlocked.defaultPath);

    return new WalletUnlocked(<string>childWallet.privateKey, provider);
  }

  /**
   * Create a Wallet Unlocked from a mnemonic phrase.
   *
   * @param mnemonic - The mnemonic phrase.
   * @param provider - A Provider instance (optional).
   * @param path - The derivation path (optional).
   * @param passphrase - The passphrase for the mnemonic (optional).
   * @returns An instance of WalletUnlocked.
   */
  static fromMnemonic(
    mnemonic: string,
    provider?: Provider,
    path?: string,
    passphrase?: BytesLike
  ): WalletUnlocked {
    const seed = Mnemonic.mnemonicToSeed(mnemonic, passphrase);
    const hdWallet = HDWallet.fromSeed(seed);
    const childWallet = hdWallet.derivePath(path || WalletUnlocked.defaultPath);

    return new WalletUnlocked(<string>childWallet.privateKey, provider);
  }

  /**
   * Create a Wallet Unlocked from an extended key.
   *
   * @param extendedKey - The extended key.
   * @param provider - A Provider instance (optional).
   * @returns An instance of WalletUnlocked.
   */
  static fromExtendedKey(extendedKey: string, provider?: Provider): WalletUnlocked {
    const hdWallet = HDWallet.fromExtendedKey(extendedKey);

    return new WalletUnlocked(<string>hdWallet.privateKey, provider);
  }

  /**
   * Create a Wallet Unlocked from an encrypted JSON.
   *
   * @param jsonWallet - The encrypted JSON keystore.
   * @param password - The password to decrypt the JSON.
   * @param provider - A Provider instance (optional).
   * @returns An unlocked wallet instance.
   */
  static async fromEncryptedJson(
    jsonWallet: string,
    password: string,
    provider?: Provider
  ): Promise<WalletUnlocked> {
    const privateKey = await decryptKeystoreWallet(jsonWallet, password);

    return new WalletUnlocked(privateKey, provider);
  }
}
