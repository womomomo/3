import { readFileSync } from 'fs';
import type { Contract } from 'fuels';
import { join } from 'path';

import { setup } from './utils';

/**
 * @group dan
 */
describe('small-bytes', () => {
  const cwd = process.cwd();
  console.log('here', join(cwd, '../test/fixtures/forc-projects/small-bytes/out/debug/small-bytes'));
  // const path = join(cwd, '../test/fixtures/forc-projects/small-bytes/out/debug/small-bytes');
  // const contractBytecode = readFileSync(join(path, 'small-bytes.bin'));
  // const abi = JSON.parse(readFileSync(join(path, 'small-bytes-abi.json'), 'utf8'));

  let contract: Contract;

  beforeAll(async () => {
    // contract = await setup({ contractBytecode, abi });
  });

  it('calls dans browser test', async () => {
    // const expected = [48, 63];
    // const res1 = await contract.functions.echo_u8_array().txParams({ gasLimit: 10_000 }).simulate();
    // expect(res1.value).toMatchObject(expected);
  });
});
