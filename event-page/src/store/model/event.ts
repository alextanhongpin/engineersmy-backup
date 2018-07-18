// Represents the interface for the event model
export interface IEvent {
  id: string, // The unique id of the event
  name: string, // The name of the event
  startDate: string, // The start date of the event
  uri: string, // The uri of the event
  tags: string, // The tags of the event
}

// Represents the interface for the service request
export interface EventServer {
  name: string, // The name of the event
  start_date: string, // The start date of the event
  uri: string, // The uri of the event
  tags: string[], // The tags of the event
  is_published?: boolean,
  id?: string
}

export const Event = {
  id: '', // The unique id of the event
  name: '', // The name of the event
  startDate: '', // The start date of the event
  uri: '', // The uri of the event
  tags: '' // The tags of the event
}

export const Events = {
  collection: []
}