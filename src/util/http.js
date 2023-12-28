import { ElMessage } from 'element-plus'


const base = '/api'

const Get = (url, params = null, headers = {}) => {
  if (params) {
    url += '?' + buildQuery(params)
  }
  return Request("GET", url, null, headers)
}


const Post = (url, data, headers = {}) => {
  headers = Object.assign({"Content-Type": "application/json"}, headers)
  return Request("POST", url, JSON.stringify(data), headers)
}


const Put = (url, data, headers = {}) => {
  headers = Object.assign({"Content-Type": "application/json"}, headers)
  return Request("PUT", url, JSON.stringify(data), headers)
}

const Delete = (url, data, headers = {}) => {
  headers = Object.assign({"Content-Type": "application/json"}, headers)
  return Request("DELETE", url, JSON.stringify(data), headers)
}

const buildQuery = (data) => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&')
}

var beforeHooks = []

const UseBefore = (...hooks) => {
  beforeHooks.push(...hooks)
}


const Request = async (method, url, body, headers, args) => {
  const controller = new AbortController()

  let req = {
    method: method,
    headers: headers,
    body: body,
    signal: controller.signal,
    ...args,
  }

  beforeHooks.forEach(hook => {
    hook(url, req)
  })

  let resp = await fetch(base + url, req)

  if (resp.status !== 200) {
    if (resp.status == 401) {
      setTimeout(_=>{
        location.href = "/login"
      }, 1000)
    } else if (resp.status == 404) {
      ElMessage.error("接口不存在")
    }

    return {}
  }

  if (resp.headers.get("Content-Type").indexOf("application/json") == -1) {
    return resp
  }

  try {
    resp = await resp.json()
  } catch (e) {
    return {}
  }
  

  // 做字段兼容 code -> success, message -> msg
  if (resp.code != undefined) {
    resp.success = resp.code == 0
  }
  if (resp.message != undefined) {
    resp.msg = resp.message
  }

  if (!resp.success && resp.msg) {
    ElMessage.error(resp.msg)
  }

  return resp
}

export default {
  Get,
  Post,
  Put,
  Delete,
  Request,
  UseBefore,
}