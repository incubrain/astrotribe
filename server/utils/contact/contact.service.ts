import { Contact } from './contact.model'
import { ContactRepository } from './contact.repository'

export class ContactService {
  private contactRepository = new ContactRepository()

  public validateContact(contact: Contact | Contact[]) {
    if (Array.isArray(contact)) {
      return contact.map((c) => new Contact(c))
    }
    return new Contact(contact)
  }

  async getContactById(id: number) {
    const contact = await this.contactRepository.selectOne<'contacts'>(id)
    return this.validateContact(contact[0])
  }

  async getCompanyContacts(companyId: number) {
    const contacts = await this.contactRepository.selectOne<'contacts'>(companyId)
    return this.validateContact(contacts)
  }

  async getUserContacts(userId: string) {
    const contacts = await this.contactRepository.selectOne<'contacts'>(userId)
    return this.validateContact(contacts)
  }
}
