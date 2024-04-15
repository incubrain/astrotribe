import type { FuncConfig, GenericReturn } from '../base.interface'
import { User } from './user.model'

export interface IUserRepository {
  selectUserCards(config: FuncConfig<{}>): GenericReturn<User>
  selectUserProfile(config: FuncConfig<{}>): GenericReturn<User>
  selectUserSettings(config: FuncConfig<{}>): GenericReturn<User>
  updateUserProfile(config: FuncConfig<User>): GenericReturn<User>
}
