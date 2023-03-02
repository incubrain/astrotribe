import * as upload from './supabase/storage/upload'
import { folder, avatar} from './supabase/storage/download'

export default function useStorage() {
    return {
        upload: {
            avatar: upload.profileSingle,
            cover: upload.profileSingle,
        },
        download: {
            folder,
            avatar
        },
    }
}
