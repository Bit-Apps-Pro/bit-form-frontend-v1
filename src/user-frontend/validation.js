/* eslint-disable no-continue */
let contentId
let fields
export default function validateForm({ form, input }) {
  if (form) contentId = form
  else if (input?.form?.id) [, contentId] = input.form.id.split('form-')
  if (typeof window[contentId] === 'undefined') return false
  let formEntries = {}
  fields = window[contentId].fields
  if (form) {
    formEntries = generateFormEntries()
  } else if (input) {
    if (!window[contentId].validateFocusLost) return true
    const name = generateFieldKey(input.name)
    formEntries = { [name]: input.value }
    fields = { [name]: fields[name] }
  }

  let formCanBeSumbitted = true
  const flds = Object.entries(fields)
  let { length } = flds
  // eslint-disable-next-line no-plusplus
  while (length--) {
    const [fldKey, fldData] = flds[length]
    const fldType = fldData.typ
    const fldValue = typeof formEntries[fldKey] === 'string' ? formEntries[fldKey].trim() : formEntries[fldKey]

    const fldDiv = document.querySelector(`#form-${contentId} .${fldKey}`)
    if (window.getComputedStyle(fldDiv).display === 'none') {
      generateErrMsg('', fldKey)
      continue
    }

    let errKey = ''

    if (!fldValue) {
      if (fldType === 'check') errKey = checkFldValidation(fldValue, fldData)
      if (fldData?.valid?.req) errKey = 'req'
      generateErrMsg(errKey, fldKey, fldData)
      if (errKey) formCanBeSumbitted = false
      continue
    }

    if (fldType === 'number') errKey = nmbrFldValidation(fldValue, fldData)
    else if (fldType === 'email') errKey = emailFldValidation(fldValue, fldData)
    else if (fldType === 'url') errKey = urlFldValidation(fldValue, fldData)
    else if (fldType === 'decision-box') errKey = dcsnbxFldValidation(fldValue, fldData)
    else if (fldType === 'check' || fldType === 'select') errKey = checkMinMaxOptions(fldValue, fldData)
    else if (fldType === 'file-up') errKey = fileupFldValidation(fldValue, fldData)

    if (fldData?.valid?.regexr) {
      errKey = regexPatternValidation(fldValue, fldData)
      if (errKey) {
        generateErrMsg(errKey, fldKey, fldData)
        formCanBeSumbitted = false
        continue
      }
    }

    generateErrMsg(errKey, fldKey, fldData)
    if (errKey) formCanBeSumbitted = false
  }
  return formCanBeSumbitted
}

const generateFieldKey = fldKey => (fldKey.slice(-2) === '[]' ? fldKey.slice(0, fldKey.length - 2) : fldKey)

const generateFormEntries = () => {
  const formData = new FormData(document.getElementById(`form-${contentId}`))
  const formEntries = {}
  for (const [key, value] of formData.entries()) {
    const fldKey = generateFieldKey(key)
    if (!(fldKey in fields)) continue
    if (formEntries[fldKey]) {
      if (!Array.isArray(formEntries[fldKey])) formEntries[fldKey] = [formEntries[fldKey]]
      formEntries[fldKey].push(value)
    } else formEntries[fldKey] = value
  }

  return formEntries
}

const generateErrMsg = (errKey, fldKey, fldData) => {
  const errFld = document.querySelector(`#form-${contentId} #${fldKey}-error`)
  if (errFld && 'err' in (fldData || {})) {
    if (errKey && fldData?.err?.[errKey]?.show) {
      errFld.innerHTML = fldData.err[errKey].custom ? fldData.err[errKey].msg : fldData.err[errKey].dflt
      errFld.parentElement.style.marginTop = '5px'
      errFld.parentElement.style.height = `${errFld.offsetHeight}px`
      scrollToFld(fldKey)
    } else {
      errFld.parentElement.style.marginTop = 0
      errFld.parentElement.style.height = 0
    }
  }
}

const scrollToFld = fldKey => {
  const fld = document.querySelector(`#form-${contentId} .btcd-fld-itm.${fldKey}`)
  const bodyRect = document.body.getBoundingClientRect()
  const fldRect = fld.getBoundingClientRect()
  const offsetTop = fldRect.top - bodyRect.top
  if (!isElementInViewport(fld)) window.scroll({ top: offsetTop, behavior: 'smooth' })
}

const isElementInViewport = elm => {
  const rect = elm.getBoundingClientRect()

  return (
    rect.top >= 0
    && rect.left >= 0
    && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    && rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

const generateBackslashPattern = str => (str || '').split('$_bf_$').join('\\')

// eslint-disable-next-line no-nested-ternary
const nmbrFldValidation = (fldValue, fldData) => ((fldData.mn && (Number(fldValue) < Number(fldData.mn))) ? 'mn' : (fldData.mx && (Number(fldValue) > Number(fldData.mx))) ? 'mx' : '')

const emailFldValidation = (fldValue, fldData) => {
  if (fldData.err.invalid.show) {
    return (!new RegExp(generateBackslashPattern(fldData.pattern)).test(fldValue) ? 'invalid' : '')
  }
  return ''
}

const urlFldValidation = (fldValue, fldData) => {
  if (fldData.err.invalid.show) {
    return (!new RegExp(generateBackslashPattern(fldData.attr.pattern)).test(fldValue) ? 'invalid' : '')
  }
  return ''
}

const dcsnbxFldValidation = (fldValue, fldData) => ((fldData.valid.req && (fldValue !== fldData.msg.checked)) ? 'req' : '')

const checkFldValidation = (fldValue, fldData) => (fldData?.opt?.find(opt => opt.req && !((fldValue || []).includes(opt.lbl))) ? 'req' : '')

const fileupFldValidation = (fldValue, fldData) => ((fldData.valid.req && !Array.isArray(fldValue) && !fldValue.name) ? 'req' : '')

const regexPatternValidation = (fldValue, fldData) => (!new RegExp(generateBackslashPattern(fldData.valid.regexr), fldData.valid.flags || '').test(fldValue) ? 'regexr' : '')

const checkMinMaxOptions = (fldValue, fldData) => {
  const val = Array.isArray(fldValue) ? fldValue : (fldValue || '').split(',')
  const mn = Number(fldData.mn) || 0
  const mx = Number(fldData.mx) || fldData.opt.length
  if (val.length < mn) return 'mn'
  if (val.length > mx) return 'mx'
  return fldData.typ === 'check' ? checkFldValidation(fldValue, fldData) : ''
}
