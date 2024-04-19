// import { EventEmitter } from 'events'
// import { createEventStream, sendEventStream } from 'h3'

// Event Listener Registration Strategy
// Selective Registration: Instead of registering a listener for every possible event upfront,
//  consider a model where listeners are registered dynamically as needed. For instance, only register listeners
// relevant to currently logged-in users or active entities.
// Event Aggregation: If possible, aggregate multiple events into a single, less frequent event.
// This can reduce the number of event handlers firing, thus saving CPU and memory resources.

// extend to an event service like RabbitMQ, Apache Kafka, or Redis Pub/Sub when we scale

const globalEmitter = new EventEmitter()

// probably convert to a class
// class MyEmitter extends EventEmitter {}

// Universal event creation function
// export function createEvent(type: string, payload: any) {
//   globalEmitter.emit(type, payload)
// }

// Set up a universal event handler stream
export function setupEventStream(event) {
  const eventStream = createEventStream(event)

  // Dynamic event handler
  // extend to allow payload augmentation
  const handleEvent = (type) => {
    globalEmitter.on(type, async (payload) => {
      await eventStream.push(JSON.stringify({ event: type, details: payload }))
    })
  }

  // Example to set up handlers for expected event types
  // probably define all events in each domain event file, import and use a for loop to setup handlers
  handleEvent('user:created')
  handleEvent('news:published')
  handleEvent('company:updated')

  // Cleanup on connection close
  eventStream.onClosed(async () => {
    globalEmitter.eventNames().forEach((type) => globalEmitter.removeAllListeners(type))
    await eventStream.close()
  })

  // return sendEventStream(event, eventStream)
}

// example of what I would have in each domain
// extend the base events class, then initialiise in the User Repository
// handle start and finish on individual api endpoints
// should be robust enough to work throught function lifecycle
// export class UserEvents {
//   public userCreated(user) {
//     createEvent('user:created', user)
//   }

//   public userUpdated(user) {
//     createEvent('user:updated', user)
//   }
// }
