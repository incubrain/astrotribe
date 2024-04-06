import { User } from './user.model'

export interface IUserRepository {
  findById(id: string): Promise<User | null>
  create(user: User): Promise<User>
  update(user: User): Promise<User>
  delete(id: string): Promise<void>
}
