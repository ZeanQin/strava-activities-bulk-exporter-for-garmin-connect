import { IIdentifiable } from '../IIdentifiable'

export class Link implements IIdentifiable {
  constructor(public id: string, public name: string, public url: string) {}
}
