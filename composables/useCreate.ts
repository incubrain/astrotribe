import * as users from './supabase/post/postUsers'

export default function useData() {
    return {
        users: {
            many: users.createManyUsers,
        },
    }
}
