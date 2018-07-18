import { EventServer } from '../model/event'
const HTTP_UNAUTHORIZED = 401
const isProduction: boolean = process.env.NODE_ENV === 'production'

class PrivateEventsService {
  private _uri: string = isProduction ? 'https://events.engineers.my/v1/events' : 'http://localhost:3000/v1/events'
  // Fetch all events that can viewed by authorized users only
  async all (): Promise<any> {
    const body: any = await window.fetch(this._uri, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
        'Content-Type': 'application/json'
      }
    })

    if (body.status === HTTP_UNAUTHORIZED) {
      throw new Error('User is not authorized to access the endpoint')
    }
    return body.json()
  }
  // Delete an event by id and returns a boolean to indicate success or failure
  async delete (id): Promise<boolean> {
    const body: any = await window.fetch([this._uri, id].join('/'), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.getToken()}`
      }
    })
    if (body.status === HTTP_UNAUTHORIZED) {
      throw new Error('User is not authorized to access the endpoint')
    }
    const res = await body.json()
    return res && res.ok
  }
  async bulkDelete (ids): Promise<any> {
    const promises = ids.map(id => this.delete(id))
    return Promise.all(promises)
  }
  // Create a new event
  async create (payload): Promise<any> {
    const body = await window.fetch(this._uri, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: payload
      })
    })
    if (body.status === HTTP_UNAUTHORIZED) {
      throw new Error('User is not authorized to access the endpoint')
    }
    return body.json()
  }
  // Update an event
  async update (payload: EventServer): Promise<boolean> {
    const body = await window.fetch([this._uri, payload.id].join('/'), {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: payload
      })
    })
    if (body.status === HTTP_UNAUTHORIZED) {
      throw new Error('User is not authorized to access the endpoint')
    }
    const res = await body.json()
    return res && res.ok
  }
  private getToken (): string {
    return window.localStorage.getItem('access_token')
  }
}

export default () => {
  return new PrivateEventsService()
}
