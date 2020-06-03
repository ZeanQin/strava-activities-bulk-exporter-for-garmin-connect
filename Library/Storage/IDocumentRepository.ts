import { IIdentifiable } from '../IIdentifiable'

export interface IDocumentRepository {
  // write
  create<T extends IIdentifiable>(document: T): Promise<boolean>
  update<T extends IIdentifiable>(documentId: string, item: T): Promise<boolean>
  delete<T extends IIdentifiable>(documentId: string): Promise<boolean>

  // read
  get<T extends IIdentifiable>(documentId: string): Promise<T>
  getAll<T extends IIdentifiable>(): Promise<T[]>
}
