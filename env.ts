/**
 * Config dotenv.
 *
 * Import this file at the app entry point e.g. index.ts as `import './env'` as early as possible. Then variables in .env can be accessed in all files as `process.env.VARIABLE`.
 *
 * See https://github.com/motdotla/dotenv/tree/master/examples/typescript for more details.
 */

import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '../.env') })
