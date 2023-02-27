import * as z from 'zod'
import useData from '../composables/useData'

const UserSchema = z.object({
    id: z.number(),
    email: z.string().nullable(),
    given_name: z.string().nullable(),
    surname: z.string().nullable(),
    username: z.string().nullable(),
    dob: z.number(),
    gender_id: z.number(),
    location_id: z.number(),
    role_id: z.number(),
    created_at: z.date(),
    updated_at: z.date(),
    last_seen: z.date(),
})

export const useUsersStore = defineStore('users', {
    //...
    state: () => {
        return {
            users: [] as typeof UserSchema[],
        }
    },
    actions: {
        async storageCheck(dataType: string) {
            const Schema = UserSchema
            // if in state, return state
            if (this[dataType].length) return this[dataType]
            // if in localStorage, update state
            const localStore = localStorage.getItem(dataType)
            console.log(`${dataType} local storage check `)
            if (!localStore) return false

            try {
                const parsedStore = JSON.parse(localStore)
                const data = Schema.parse(parsedStore[1])
                console.log(`${dataType} local data is valid: `, data)
                this[dataType] = parsedStore
                return parsedStore
            } catch (error) {
                createError(`Error validating ${dataType} local data: `, error)
                return false
            }
        },
        async getUsers() {
            // check if posts are in localStorage or state
            let users = await this.storageCheck('users')
            console.log('localStorage users', users)
            if (!users) {
                const { data, error } = await useData().users.many()
                console.log('get users from supabase', data)
                if (error) throw createError(error)
                this.users = data
                localStorage.setItem('users', JSON.stringify(data))
            }
        },
    },
    getters: {
        userById: (state) => {
            return (id: number) => state.users.find(user => user.id === id)
        }
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUsersStore, import.meta.hot))
}
