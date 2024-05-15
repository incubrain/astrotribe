import { ContactService } from '../contact/contact.service'
import { AddressService } from '../address/address.service'
import { SocialService } from '../social/social.service'
import { Company } from './company.model'
import { CompanyRepository } from './company.repository'

export class CompanyService {
  private companyRepository = new CompanyRepository()
  private contactService = new ContactService()
  private addressService = new AddressService()
  private socialService = new SocialService()

  public validateCompany(company: Company) {
    // we first validate the data is in the correct shape then map to class
    // if there's any issue an error is thrown, which should cause the function to exit, correct?
    return new Company(company)
  }

  public validateCompanyWithDetails(data: any) {
    const company = this.validateCompany(data.company)
    let contacts
    let addresses
    let socials

    if (data.addresses && data.addresses.length) {
      addresses = this.addressService.validateAddress(data.addresses)
    }

    if (data.contacts && data.contacts.length) {
      contacts = this.contactService.validateContact(data.contacts)
    }

    if (data.socials) {
      socials = this.socialService.validateSocial(data.socials)
    }

    return {
      company,
      contacts,
      addresses,
      socials
    }
  }

  async createCompanyWithDetails(data: any) {
    const newCompany = await this.companyRepository.insertCompany(data.company)

    if (data.addresses && data.addresses.length) {
      await Promise.all(
        data.addresses.map((address) =>
          this.addressService.addAddressToEntity(address, newCompany.id, 'Company')
        )
      )
    }

    if (data.contacts && data.contacts.length) {
      await Promise.all(
        data.contacts.map((contact) =>
          this.contactsService.addContactToEntity(contact, newCompany.id, 'Company')
        )
      )
    }

    if (data.socials) {
      await this.socialService.addSocialsToEntity(socials, newCompany.id, 'Company')
    }
  }
}
