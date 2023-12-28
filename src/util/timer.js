
const timezoneOffset = new Date().getTimezoneOffset();

class timer {
  constructor() {
    this.date = new Date()
  }
  Date() {
    return this.date
  }
  Unix() {
    return parseInt(this.date.getTime() / 1000)
  }
  DateTime() {
    return Datetime(this.Unix())
  }
  Format(format) {
    return Format(format, this.Unix())
  }
  // 加减日
  AddDay(n) {
    this.date.setTime(this.date.getTime() + 86400 * 1000 * n)
    return this
  }
  // 日始
  DayStart() {
    this.date.setHours(0, 0, 0, 0)
    return this
  }
  // 日终
  DayEnd() {
    this.date.setHours(23, 59, 59, 999)
    return this
  }
  // 月初
  MonthStart() {

  }
  


}


function New() {
  return new timer()
}

// 当前时间戳
function Unix() {
  return parseInt(new Date() / 1000)
}

// 日期时间
function Datetime(timestamp) {
  return Format('Y-m-d H:i:s', timestamp)
}

// 格式化时间戳
function Format(format, timestamp) {
  let s = '';
  let t;
  if (timestamp) {
    // 兼容毫秒和秒
    if (timestamp < 1e12) {
      timestamp *= 1000
    }
    t = new Date(timestamp)
  } else {
    t = new Date()
  }
  for (let i = 0; i < format.length; i++) {
    switch (format[i]) {
      case 'Y':
        s += t.getFullYear()
        break
      case 'm':
        s += pad0(t.getMonth() + 1)
        break
      case 'd':
        s += pad0(t.getDate())
        break
      case 'H':
        s +=  pad0(t.getHours())
        break
      case 'i':
        s +=  pad0(t.getMinutes())
        break
      case 's':
        s +=  pad0(t.getSeconds())
        break
      default:
        s += format[i]
        break
    }
  }
  return s;
}



function pad0(v) {
  if (v < 10) {
    return '0' + v
  }
  return v
}


export default {
  New,
  Unix,
  Datetime,
  Format,
}