import { StorageType } from './StorageType'

export interface IStorage {
  storageType: StorageType
  save(filename: string, content: NodeJS.ReadableStream | string): void
  read(filename: string): string
}
