import { Address } from './address.model'
import { AddressRepository } from './address.repository'

export class AddressService {
  private addressRepository = new AddressRepository()

  public validateAddress(address: Address | Address[]) {
    if (Array.isArray(address)) {
      return address.map((c) => new Address(c))
    }
    return new Address(address)
  }

  async getAddressById(id: number) {
    const address = await this.addressRepository.selectOne<'addresses'>({
      tableName: 'addresses',
      selectStatement: '*',
      filterBy: {
        columnName: 'id',
        operator: 'eq',
        value: id
      }
    })
    return this.validateAddress(address[0])
  }

  async getCompanyAddresses(companyId: number) {
    const addresss = await this.addressRepository.selectMany<'addresses'>({
      tableName: 'addresses',
      selectStatement: '*',
      filterBy: {
        columnName: 'company_id',
        operator: 'eq',
        value: companyId
      }
    })
    return this.validateAddress(addresss)
  }

  async getPrimaryCompanyAddress(companyId: number) {
    const address = await this.addressRepository.selectPrimaryAddress({
      selectStatement: '*',
      filterBy: {
        columnName: 'company_id',
        operator: 'eq',
        value: companyId
      }
    })
    return this.validateAddress(address)
  }

  async getPrimaryUserAddress(userId: string) {
    const address = await this.addressRepository.selectPrimaryAddress({
      selectStatement: '*',
      filterBy: {
        columnName: 'user_id',
        value: userId
      }
    })
    return this.validateAddress(address)
  }

  async getUserAddresses(userId: string) {
    const addresss = await this.addressRepository.selectMany<'addresses'>({
      tableName: 'addresses',
      selectStatement: '*',
      filterBy: {
        columnName: 'user_id',
        operator: 'eq',
        value: userId
      }
    })
    return this.validateAddress(addresss)
  }
}
