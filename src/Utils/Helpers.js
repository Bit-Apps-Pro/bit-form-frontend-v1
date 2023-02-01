/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
export const hideWpMenu = () => {
  document.getElementsByTagName('body')[0].style.overflow = 'hidden'
  document.getElementsByClassName('wp-toolbar')[0].style.paddingTop = 0
  document.getElementById('wpadminbar').style.display = 'none'
  document.getElementById('adminmenumain').style.display = 'none'
  document.getElementById('adminmenuback').style.display = 'none'
  document.getElementById('adminmenuwrap').style.display = 'none'
  document.getElementById('wpfooter').style.display = 'none'
  document.getElementById('wpcontent').style.marginLeft = 0
}

export const showWpMenu = () => {
  document.getElementsByTagName('body')[0].style.overflow = 'auto'
  document.getElementsByClassName('wp-toolbar')[0].style.paddingTop = '32px'
  document.getElementById('wpadminbar').style.display = 'block'
  document.getElementById('adminmenumain').style.display = 'block'
  document.getElementById('adminmenuback').style.display = 'block'
  document.getElementById('adminmenuwrap').style.display = 'block'
  document.getElementById('wpcontent').style.marginLeft = null
  document.getElementById('wpfooter').style.display = 'block'
}

export const getNewId = flds => {
  let largestNumberFld = 0
  let num = 0
  for (const fld in flds) {
    if (fld !== null && fld !== undefined) {
      num = Number(fld.match(/-[0-9]+/g)?.[0]?.match(/[0-9]+/g))
      if (typeof num === 'number' && num > largestNumberFld) {
        largestNumberFld = num
      }
    }
  }
  return largestNumberFld + 1
}

export const assign = (obj, keyPath, value) => {
  const lastKeyIndex = keyPath.length - 1
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < lastKeyIndex; ++i) {
    const key = keyPath[i]
    if (!(key in obj)) {
      obj[key] = {}
    }
    obj = obj[key]
  }
  obj[keyPath[lastKeyIndex]] = value
  return value
}

export const multiAssign = (obj, assignArr) => {
  for (let i = 0; i < assignArr.length; i += 1) {
    if (assignArr[i].delProp) {
      delete obj?.[assignArr[i].cls]?.[assignArr[i].property]
      if (obj[assignArr[i]?.cls]?.constructor === Object && Object.keys(obj?.[assignArr[i]?.cls]).length === 0) {
        delete obj[assignArr[i].cls]
      }
    } else {
      assign(obj, [assignArr[i].cls, assignArr[i].property], assignArr[i].value)
    }
  }
}
const forEach = (array, iteratee) => {
  let index = -1
  const { length } = array
  // eslint-disable-next-line no-plusplus
  while (++index < length) {
    iteratee(array[index], index)
  }
  return array
}
export const deepCopy = (target, map = new WeakMap()) => {
  if (typeof target !== 'object' || target === null) {
    return target
  }
  const isArray = Array.isArray(target)
  const cloneTarget = isArray ? [] : {}

  if (map.get(target)) {
    return map.get(target)
  }
  map.set(target, cloneTarget)

  if (isArray) {
    forEach(target, (value, index) => {
      cloneTarget[index] = deepCopy(value, map)
    })
  } else {
    forEach(Object.keys(target), key => {
      cloneTarget[key] = deepCopy(target[key], map)
    })
  }
  return cloneTarget
}

export const sortArrOfObj = (data, sortLabel) => data.sort((a, b) => {
  if (a?.[sortLabel]?.toLowerCase() < b?.[sortLabel]?.toLowerCase()) return -1
  if (a?.[sortLabel]?.toLowerCase() > b?.[sortLabel]?.toLowerCase()) return 1
  return 0
})

export const dateTimeFormatter = (dateStr, format) => {
  const newDate = new Date(dateStr)

  if (newDate.toString() === 'Invalid Date') {
    return 'Invalid Date'
  }

  const allFormatObj = {}

  // Day
  allFormatObj.d = newDate.toLocaleDateString('en-US', { day: '2-digit' })
  allFormatObj.j = newDate.toLocaleDateString('en-US', { day: 'numeric' })
  let S = Number(allFormatObj.j)
  if (S % 10 === 1 && S !== 11) {
    S = 'st'
  } else if (S % 10 === 2 && S !== 12) {
    S = 'nd'
  } else if (S % 10 === 3 && S !== 13) {
    S = 'rd'
  } else {
    S = 'th'
  }
  allFormatObj.S = S
  // Weekday
  allFormatObj.l = newDate.toLocaleDateString('en-US', { weekday: 'long' })
  allFormatObj.D = newDate.toLocaleDateString('en-US', { weekday: 'short' })
  // Month
  allFormatObj.m = newDate.toLocaleDateString('en-US', { month: '2-digit' })
  allFormatObj.n = newDate.toLocaleDateString('en-US', { month: 'numeric' })
  allFormatObj.F = newDate.toLocaleDateString('en-US', { month: 'long' })
  allFormatObj.M = newDate.toLocaleDateString('en-US', { month: 'short' })
  // Year
  allFormatObj.Y = newDate.toLocaleDateString('en-US', { year: 'numeric' })
  allFormatObj.y = newDate.toLocaleDateString('en-US', { year: '2-digit' })
  // Time
  allFormatObj.a = newDate.toLocaleTimeString('en-US', { hour12: true }).split(' ')[1].toLowerCase()
  // eslint-disable-next-line prefer-destructuring
  allFormatObj.A = newDate.toLocaleTimeString('en-US', { hour12: true }).split(' ')[1]
  // Hour
  // eslint-disable-next-line prefer-destructuring
  allFormatObj.g = newDate.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric' }).split(' ')[0]
  // eslint-disable-next-line prefer-destructuring
  allFormatObj.h = newDate.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit' }).split(' ')[0]
  allFormatObj.G = newDate.toLocaleTimeString('en-US', { hour12: false, hour: 'numeric' })
  allFormatObj.H = newDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit' })
  // Minute
  allFormatObj.i = newDate.toLocaleTimeString('en-US', { minute: '2-digit' })
  // Second
  allFormatObj.s = newDate.toLocaleTimeString('en-US', { second: '2-digit' })
  // Additional
  // eslint-disable-next-line prefer-destructuring
  allFormatObj.T = newDate.toLocaleTimeString('en-US', { timeZoneName: 'short' }).split(' ')[2]
  allFormatObj.c = newDate.toISOString()
  allFormatObj.r = newDate.toUTCString()
  allFormatObj.U = newDate.valueOf()
  let formattedDate = ''

  const allFormatkeys = Object.keys(allFormatObj)

  for (let v = 0; v < format.length; v += 1) {
    if (format[v] === '\\') {
      v += 1
      formattedDate += format[v]
    } else {
      const formatKey = allFormatkeys.find(key => key === format[v])
      formattedDate += formatKey ? format[v].replace(formatKey, allFormatObj[formatKey]) : format[v]
    }
  }

  return formattedDate
}

const cipher = salt => {
  const textToChars = text => text.split('').map(c => c.charCodeAt(0))
  const byteHex = n => (`0${Number(n).toString(16)}`).substr(-2)
  // eslint-disable-next-line no-bitwise
  const applySaltToChar = code => textToChars(salt).reduce((a, b) => a ^ b, code)

  return text => text
    .split('')
    .map(textToChars)
    .map(applySaltToChar)
    .map(byteHex)
    .join('')
}

const decipher = salt => {
  const textToChars = text => text.split('').map(c => c.charCodeAt(0))
  // eslint-disable-next-line no-bitwise
  const applySaltToChar = code => textToChars(salt).reduce((a, b) => (a ^ b), code)
  return encoded => encoded
    .match(/.{1,2}/g)
    .map(hex => parseInt(hex, 16))
    .map(applySaltToChar)
    .map(charCode => String.fromCharCode(charCode))
    .join('')
}

export const bitCipher = cipher('btcd')
export const bitDecipher = decipher('btcd')

export function spreadIn4Value(value) {
  if (!value) return undefined
  const valArr = value.split(' ')
  if (valArr.length === 4) return value
  if (valArr.length === 1) return Array(4).fill(valArr[0]).join(' ')
  if (valArr.length === 2) return [valArr[0], valArr[1], valArr[0], valArr[1]].join(' ')
  if (valArr.length === 3) return [valArr[0], valArr[1], valArr[2], valArr[1]].join(' ')
  return value
}

export const checkValidEmail = email => {
  if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true
  }
  return false
}
export const makeFieldsArrByLabel = (fields, labels) => {
  const fldArrByLabel = Object.entries(fields).filter(fld => fld[1].typ !== 'button').map(([fldKey, fld]) => {
    const fldByLabel = labels.find(lbl => lbl.key === fldKey)
    return {
      ...fld,
      key: fldKey,
      type: fld.typ,
      name: fldByLabel?.adminLbl
        || fldByLabel?.name
        || fld.lbl
        || fld.adminLbl
        || fld.txt // for submit button
        || fldKey,
    }
  })

  return sortArrOfObj(fldArrByLabel, 'name')
}

export const getFileExts = filename => filename.split('.').pop()

export const csvToJson = (string, delimiter = ',') => {
  const regex = new RegExp(`\\s*(")?(.*?)\\1\\s*(?:${delimiter}|$)`, 'gs')
  const match = str => [...str.matchAll(regex)].map(matc => matc[2])
    .filter((_, i, a) => i < a.length - 1)

  const lines = string.split('\n')
  const heads = match(lines.splice(0, 1)[0])

  return lines.map(line => match(line).reduce((acc, cur, i) => ({
    ...acc,
    [heads[i] || `extra_${i}`]: ((cur.length > 0) ? (Number(cur) || cur) : '').trim(),
  }), {}))
}

export const isType = (type, val) => !!(val?.constructor && val.constructor.name.toLowerCase() === type.toLowerCase())

export const getFormsByPhpVar = () => {
  let allForms = []
  if (typeof bits !== 'undefined'
    //  eslint-disable-next-line no-undef
    && bits.allForms !== null) {
    //  eslint-disable-next-line no-undef
    allForms = bits?.allForms?.map(form => (
      { formID: form.id, status: form.status !== '0', formName: form.form_name, shortcode: `bitform id='${form.id}'`, entries: form.entries, views: form.views, created_at: form.created_at }))
  }
  return allForms
}
export const getNewFormId = (allForms) => {
  let max = 0
  allForms.map(frm => {
    const fid = Number(frm.formID)
    if (fid > max) {
      max = fid
    }
  })
  return max + 1
}

export const sortByField = (array, fieldKey, typ) => array.sort((a, b) => {
  const x = a[fieldKey]
  const y = b[fieldKey]
  if (typ === 'ASC') {
    return ((x < y) ? -1 : ((x > y) ? 1 : 0))
  }
  return ((y < x) ? -1 : ((y > x) ? 1 : 0))
})

const divide = (dividend, divisor) => {
  let returnValue = ''
  let remainder = 0
  let currentDividend = 0
  let currentQuotient

  dividend.split('').forEach((digit, index) => {
    // use classical digit by digit division
    if (currentDividend !== 0) {
      currentDividend *= 10
    }
    currentDividend += Number(digit)

    if (currentDividend >= divisor) {
      currentQuotient = Math.floor(currentDividend / divisor)
      currentDividend -= currentQuotient * divisor
      returnValue += currentQuotient.toString()
    } else if (returnValue.length > 0) {
      returnValue += '0'
    }

    if (index === dividend.length - 1) {
      remainder = currentDividend
    }
  })

  return {
    quotient: returnValue.length === 0 ? '0' : returnValue,
    remainder,
  }
}

/**
 * It converts an IP address from a number to a string
 * @returns A string of the IP address.
 */
export const number2Ipv4 = ipNumber => {
  let ipAddr = ipNumber % 256
  for (let i = 3; i > 0; i -= 1) {
    ipNumber = Math.floor(ipNumber / 256)
    ipAddr = `${ipNumber % 256}.${ipAddr}`
  }
  return ipAddr
}

export const number2Ipv6 = ipNumber => {
  const base = 16
  const blocks = []
  const blockSize = Math.pow(2, 16)

  while (blocks.length < 8) {
    const divisionResult = divide(ipNumber, blockSize)

    blocks.unshift(divisionResult.remainder.toString(base))

    ipNumber = divisionResult.quotient
  }

  return blocks.join(':')
}

export const formatIpNumbers = ipNumber => {
  const ipNumStr = ipNumber.toString()
  if (ipNumber.length <= 11) return number2Ipv4(ipNumStr)
  return number2Ipv6(ipNumStr)
}

export const compareBetweenVersions = (ver1, ver2) => {
  //   0: ver1 & ver2 are equal
  //   1: ver1 is greater than ver2
  //  -1: ver2 is greater than ver1
  try {
    const num1 = typeof ver1 === 'number' ? ver1.toString() : ver1
    const num2 = typeof ver2 === 'number' ? ver2.toString() : ver2

    return num1.localeCompare(num2, undefined, { numeric: true, sensitivity: 'base' })
  } catch (_) {
    return -1
  }
}
