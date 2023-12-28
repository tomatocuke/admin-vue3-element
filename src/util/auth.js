
const authKey =  VITE_APP_NAME + '_auth'

const auth = {
  Set(obj, expires_at) {
    if (expires_at === undefined || expires_at < 1700000000) {
      alert("必须设置截至的过期时间戳(秒)")
      return
    }
    let v = JSON.stringify([obj, expires_at])
    localStorage.setItem(authKey, v)
  },
  Get() {
    let v = localStorage.getItem(authKey)
    if (!v) {
      return null
    }

    let auth = JSON.parse(v)
    if (auth[1] < Date.now() / 1000) {
      this.Remove()
      return null
    }
    return auth[0]
  },
  Remove() {
    localStorage.removeItem(authKey)
  },
  IsLogin() {
    return this.Get() !== null
  }
}




export default auth