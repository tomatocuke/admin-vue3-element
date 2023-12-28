
// 本地浏览器数据存储

export default {
  Set(key, value) {
    localStorage.setItem(key, value);
  },
  Get(key) {
    return localStorage.getItem(key);
  },
  SetJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  GetJson(key) {
    let val = this.Get(key)
    if (!val) {
      return null
    }

    try {
      return JSON.parse(val)
    } catch (e) {
      console.error(e, val)
      return null
    }
  },
  Remove(key) {
    localStorage.removeItem(key);
  }
}