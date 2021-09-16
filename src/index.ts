import { fileURLToPath } from 'url';
import { dirname } from 'path';
process.chdir(dirname(fileURLToPath(import.meta.url)));

import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '../.env' });

import Sibyl from './lib';

await new Sibyl().start(process.env.DISCORD_API_KEY as string);

console.log('Running!');
