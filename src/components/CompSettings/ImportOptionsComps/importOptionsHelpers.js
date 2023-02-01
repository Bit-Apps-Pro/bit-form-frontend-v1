/* eslint-disable no-nested-ternary */
import { isType } from '../../../Utils/Helpers'

const trim = str => (str ? (typeof str === 'string' ? str.trim() : str.toString().trim()) : '')
const generateSeparatorPattern = separator => (separator === 'comma' ? ',' : (separator === 'space' ? /[ ]+/ : /\r?\n/))

// eslint-disable-next-line no-undef
const isPro = typeof bits !== 'undefined' && bits.isPro

export const generateNewFileUploadedOptions = (importOpts, lblKey, valKey) => {
  if (!isPro) return []
  const { data, dataTyp, separator, lbl, vlu } = importOpts
  let opts = []

  if (dataTyp === 'txt') {
    const hasColonKeyVlu = checkIfHasColonLblVlu(separator, importOpts)
    if (!separator || (hasColonKeyVlu && (!lbl || !vlu))) return []

    const pattern = generateSeparatorPattern(separator)
    const keyIndx = (lbl === 'value') ? 1 : 0
    const valIndx = (vlu === 'key') ? 0 : 1
    opts = data.split(pattern).filter(opt => trim(opt).length).map(op => {
      const opt = hasColonKeyVlu ? op.split(':') : op.split()
      const label = trim(opt[keyIndx])
      const value = trim(opt?.[valIndx] || label)
      return { [lblKey]: label, [valKey]: value }
    })
  }

  if (dataTyp === 'json') {
    if (isType('object', data) || (isType('array', data) && data.length === 1 && isType('object', data[0]))) {
      if (!lbl || !vlu) return []
      const data2 = isType('array', data) ? data[0] : data
      const keyIndx = (lbl === 'value') ? 1 : 0
      const valIndx = (vlu === 'key') ? 0 : 1
      opts = Object.entries(data2).map(op => ({ [lblKey]: trim(op[keyIndx]), [valKey]: trim(op[valIndx]) }))
    } else if (isType('array', data)) {
      if (data.length > 1 && isType('object', data[0])) {
        if (!lbl || !vlu) return []
        opts = data.map(op => ({ [lblKey]: trim(op[lbl]), [valKey]: trim(op[vlu]) }))
      } else {
        opts = data.filter(opt => trim(opt).length > 0).map(op => ({ [lblKey]: trim(op), [valKey]: trim(op) }))
      }
    }
  }

  if (dataTyp === 'xlsx' || dataTyp === 'xls' || dataTyp === 'csv' || dataTyp === 'tsv') {
    if (!lbl || !vlu) return []
    opts = data.map(opt => ({ [lblKey]: trim(opt[lbl]), [valKey]: trim(opt[vlu]) }))
  }

  return opts
}

export const checkIfHasColonLblVlu = (separator, importOpts) => {
  let hasColonKeyVlu = 1
  const pattern = generateSeparatorPattern(separator)
  const data = importOpts?.data?.split(pattern) || []
  const { length } = data
  if (length) {
    for (let i = 0; i < (length <= 10 ? length : 10); i += 1) {
      if (trim(data[i]) && data[i].split(':').length <= 1) {
        hasColonKeyVlu = 0
        break
      }
    }
  }

  return hasColonKeyVlu
}

export const generateNewPresetsOptions = (importOpts, lblKey, valKey) => {
  const { data, preset, lbl, vlu } = importOpts
  if (!preset || !lbl || !vlu) return []
  const presets = data[preset]
  return presets.map(op => ({ [lblKey]: trim(op[lbl]), [valKey]: trim(op[vlu]) }))
}
