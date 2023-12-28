import {ElMessage} from 'element-plus'
import { toRaw } from 'vue'

export default {
  // 打印日志。 请使用 VITE_DEBUG && helper.Log()
  Log(...args) {
    let arr = []
    args.forEach(arg => {
      if (typeof arg === 'object') {
        arr.push(toRaw(arg))
      } else {
        arr.push(arg)
      }
    })
    console.log(...arr)
  },

  // 判断是否为空
  IsEmpty(val) {
    if (val === undefined || val === null || val === "" || val === 0 || val === false) {
      return true
    }
    if (Array.isArray(val)) {
      return val.length === 0
    }
    if (val instanceof Object) {
      return Object.keys(val).length === 0
    }
    return false
  },

  // 判断是否为对象
  IsObject(val) {
    return val instanceof Object && val.constructor == Object
  },

  // 合并对象
  MergeObject(...objs) {
    return Object.assign({}, ...objs)
  },

  // 拷贝数据
  Copy(val) {
    if (Array.isArray(val)) {
      return Array.from(val)
    }
    if (val instanceof Object) {
      return Object.assign({}, val)
    }
    return val
  },

  // 拷贝到粘贴板
  Clipboard(content) {
    navigator.clipboard.writeText(content).then(_=>{
      ElMessage.success('已复制')
    })
  },

  // 随机[0-max)的整数，不包含max本身
  Random(max) {
    return Math.floor(Math.random() * max)
  },

  // 带保留小数的除法
  Div(a, b, decimal = 0) {
    if (b == 0) {
      return 0
    }
    let v = a / b 
    return v.toFixed(decimal);
  },
  
  // 安全解析JSON字符串，防止因为报错直接阻塞
  ParseJSON(val) {
    try {
      return JSON.parse(val)
    } catch (e) {
      console.error(e, val)
      return {}
    }
  },

  // 修剪前边
  TrimPrefix(str, substr) {
    for (let i = 0; i < substr.length; i++) {
      if (str[i] !== substr[i]) {
        return str
      }
    }
    return str.slice(substr.length)
  },

  // 修剪后边
  TrimSuffix(str, substr) {
    let x = str.length - substr.length
    for (let i = substr.length - 1; i >= 0; i--) {
      console.log(str[x+i] , substr[i])
      if (str[x+i] !== substr[i]) {
        return str
      }
    }
    return str.slice(0, substr.length)
  },

  // 成功提示
  AlertSuccess(msg) {
    ElMessage.success(msg)
  },
  // 错误提示
  AlertError(msg) {
    ElMessage.error(msg)
  },
  // 警告提示
  AlertWarning(msg) {
    ElMessage.warning(msg)
  },

  // 模拟API请求
  Promise(val, sleep = 0) {
    return new Promise(resolve => {
      setTimeout(_=> {
        resolve(val instanceof Function ? val() : val)
      }, sleep)
    })
  },
  
  // 格式化金额
  FormatMoney(amount) {
    if (amount > 0) {
      return `$` + amount
    }
    return amount
  },


}

