import { IStorage } from './IStorage'
import { StorageType } from './StorageType'
import path from 'path'
import fs from 'fs'

export class LocalhostFileStorage implements IStorage {
  public storageType = StorageType.Localhost

  constructor(public path: string) {}

  save(filename: string, content: NodeJS.ReadableStream | string) {
    // create path
    if (!fs.existsSync(this.path)) {
      fs.mkdirSync(this.path, { recursive: true })
    }

    const filePath = path.join(this.path, filename)

    if (typeof content === 'string') {
      fs.writeFile(filePath, content, () => {})
    } else {
      let readableStream = <NodeJS.ReadStream>content
      const filestream = fs.createWriteStream(filePath)
      readableStream.pipe(filestream)
    }

    return
  }

  read(filename: string): string {
    const filePath = path.join(this.path, filename)
    return fs.readFileSync(filePath, 'utf8')
  }
}
