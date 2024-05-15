import { BaseRepository } from '../base.repository'
import { IAddressRepository } from './address.interface'
import { Address } from './address.model'

export class AddressRepository extends BaseRepository<Address> implements IAddressRepository {
  constructor() {
    super({ loggerPrefix: 'AddressRepository', Model: Address })
  }
}
