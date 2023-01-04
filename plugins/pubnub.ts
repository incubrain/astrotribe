import PubNub from 'pubnub'

export default defineNuxtPlugin(async (nuxtApp) => {
    const pubnub = new PubNub({
        subscribeKey: 'sub-c-f0d32e93-19a4-48fa-8ae9-9e46ec1984f1',
        publishKey: 'pub-c-dae107d6-fda1-41e3-98a7-6037a8486316',
        logVerbosity: true,
        userId: 'drewMac234241',
        ssl: true,
        presenceTimeout: 130,
    })
    
    pubnub.addListener({
        presence: function (p) {
            console.log('presence', p)
            const action = p.action // Can be join, leave, state-change, or timeout
            const channelName = p.channel // Channel to which the message belongs
            const occupancy = p.occupancy // Number of users subscribed to the channel
            const state = p.state // User state
            const channelGroup = p.subscription //  Channel group or wildcard subscription match, if any
            const publishTime = p.timestamp // Publish timetoken
            const timetoken = p.timetoken // Current timetoken
            const uuid = p.uuid // UUIDs of users who are subscribed to the channel
        }
    })

    pubnub.subscribe({
        channels: ['my_channel'],
        withPresence: true,
    })


    pubnub.setState({
        state: {
            your: 'state',
        },
        channels: ['my_channel'],
    })

    console.log('pubnub', pubnub)

    nuxtApp.vueApp.use(pubnub)
})
