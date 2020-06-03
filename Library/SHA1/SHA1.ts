import sha1 from 'sha1'
import { ISHA1 } from './ISHA1'

export class SHA1 implements ISHA1 {
  hash(message: string): string {
    return sha1(message)
  }
}
