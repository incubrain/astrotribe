import publicClient from '../publicClient'

const client = publicClient()

export const eventById = async (eventId: string) => {
    const { data, error } = await client.from('users').select('*').eq('id', 4)
    console.log('eventById', data, error)
    return {
        data,
        error,
    }
}

export const eventsMany = async () => {
    const { data, error } = await client.from('events').select(`
            id,
            title,
            body,
            date,
            venues(
                id,
                name,
                location(
                    country,
                    state_province,
                    city
                )
            ),
            event_hosts(
                users(
                    id,
                    given_name
                )
            )
        `)
    const events = data?.map(item => {
        const hosts = item.event_hosts?.flatMap(host => host?.users) || [];
        return {
            ...item,
            event_hosts: hosts,
        }
    })

    console.log('eventsMany', events)

    return {
        data: events,
        error,
    }
}
