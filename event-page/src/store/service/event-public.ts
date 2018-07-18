import { EventServer } from '../model/event'
const isProduction: boolean = process.env.NODE_ENV === 'production'

class PublicEventsService {
  private _uri: string = isProduction ? 'https://events.engineers.my/v1/events' : 'http://localhost:3000/v1/events'
  // Returns all events that public users can view
  async published (): Promise<any> {
    const body = await window.fetch([this._uri, 'filter=published'].join('?'))
    return body.json()
  }
  async all (): Promise<any> {
    const body = await window.fetch(this._uri)
    return body.json()
  }
  // Allows public user to suggest events, which will then be approved by the admin
  async suggest (payload: EventServer): Promise<any> {
    const body = await window.fetch(this._uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: payload
      })
    })
    return body.json()
  }
}

export default () => {
  return new PublicEventsService()
}
