import upload from './supabase/storage/upload'
import download from './supabase/storage/download'

export default function useStorage() {
    return {
        upload,
        download,
    }
}
