import { BaseRepository } from '../base.repository'
import { IContactRepository } from './contact.interface'
import { Contact } from './contact.model'

export class ContactRepository extends BaseRepository<Contact> implements IContactRepository {
  constructor() {
    super({ loggerPrefix: 'ContactRepository', Model: Contact })
  }
}
