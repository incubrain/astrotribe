import publicClient from './publicClient'

const client = publicClient()

const eventHandler = client.auth.onAuthStateChange((event, session) => {
    if (event == 'SIGNED_IN') return console.log('SIGNED_IN', session)
    if (event == 'USER_UPDATED') return console.log('USER_UPDATED', session)
    if (event == 'TOKEN_REFRESHED')
        return console.log('TOKEN_REFRESHED', session)
    if (event == 'SIGNED_OUT') return console.log('SIGNED_OUT', session)
    else console.log('unhandled event: ', event, session)
})

export default eventHandler
