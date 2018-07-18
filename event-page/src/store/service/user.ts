class UserService {
  private _uri: string = "https://engineersmy.auth0.com/api/v2/users"

  async getUsers() {
    const body = await window.fetch(this._uri, {
      headers: {
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

export default() => new UserService()
