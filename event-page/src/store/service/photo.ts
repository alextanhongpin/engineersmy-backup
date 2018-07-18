import { IPhoto } from '../model/photo'
const isProduction: boolean = process.env.NODE_ENV === 'production'

class PhotoService {
  private _uri: string = isProduction ? 'https://events.engineers.my/v1/photos' : 'http://localhost:3000/v1/photos'
  async all (): Promise<any> {
    const body = await window.fetch(this._uri)
    return body.json()
  }
  async create (payload): Promise<any> {
    const res = await window.fetch(this._uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      },
      body: JSON.stringify(payload)
    })
    if (res.status === 401) {
      throw new Error('PhotoService.createError: User is not authorized to perform the action')
    }
    const body = await res.json()
    return body
  }
  async delete (payload): Promise<any> {
    const body = await window.fetch([this._uri, payload].join('/'), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      }
    })
    const res = await body.json()
    return res
  }
  private getToken (): string {
    return window.localStorage.getItem('access_token')
  }
} 

export default () => {
  return new PhotoService()
}