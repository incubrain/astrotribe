import { single } from './supabase/storage/upload'
import { folder, avatar} from './supabase/storage/download'

export default function useStorage() {
    return {
        upload: {
            single,
        },
        download: {
            folder,
            avatar
        },
    }
}
