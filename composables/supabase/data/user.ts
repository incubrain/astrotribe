import publicClient from '../publicClient'


const userData = ref({
    auth: {},
    profile: {},
})


const client = publicClient()

const byId = async (userId: string) => {
    const { data, error } = await client.auth.admin.getUserById(userId)
    return {
        data,
        error,
    }
}

const current = async (userId: string) => {
    // Check app state
    // console.log('fire')
    // if (userData.value.auth) return

    // console.log('fire2')
    // // check local storage, if logged out return
    // const localAuth = JSON.parse(window.localStorage.getItem('authUser') || '')
    // if (localAuth) return console.log('local auth', localAuth)
    // console.log('fire3')

    // console.log('test client', client)

    // if nothing stored, get data
    const {
        data: { user },
        error,
    } = await client.auth.getUser()

    return {
        user,
        error,
    }
}

const many = async () => {
    // Check app state
    // if (!userData.value.auth) return
    
    // console.log('fire2')
    // // check local storage, if logged out return
    // const localAuth = JSON.parse(window.localStorage.getItem('authUser') || '')
    // if (localAuth) return console.log('local auth', localAuth)
    // console.log('fire3')
    
    // console.log('test client', client)
    console.log('fire')
    
    // if nothing stored, get data
    const {
        data,
        error,
    } = await client.from('users').select('*')
    
    return {
        data,
        error,
    }
}



export {
    current,
    many,
    byId,
}
