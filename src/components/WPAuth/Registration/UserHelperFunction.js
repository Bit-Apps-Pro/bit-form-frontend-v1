/* eslint-disable no-param-reassign */
// eslint-disable-next-line no-unused-vars
import produce from 'immer'
import { __ } from '../../../Utils/i18nwrap'

export const addFieldMap = (authType, fldProp, i, confTmp, setConf) => {
  setConf(tmpConf => produce(tmpConf, draft => {
    draft[authType][fldProp].splice(i, 0, {})
  }))
}

export const delFieldMap = (authType, fldProp, i, confTmp, setConf) => {
  setConf(tmpConf => produce(tmpConf, draft => {
    if (draft[authType][fldProp].length > 1) {
      draft[authType][fldProp].splice(i, 1)
    }
  }))
}

export const handleFieldMapping = (authType, fldProp, event, index, conftTmp, setConf, formFields, setSnackbar) => {
  const newConf = { ...conftTmp }

  const fldEmail = formFields?.find(f => f.key === event.target.value)

  if (newConf[authType][fldProp][index].userField === 'user_email' && fldEmail?.typ !== 'email') {
    setSnackbar({ show: true, msg: 'should be selected email field..' })
    return
  }

  setConf(tmpConf => produce(tmpConf, draft => {
    draft[authType][fldProp][index][event.target.name] = event.target.value
  }))
}

export const checkMappedUserFields = (data, type, field) => {
  const mappedFields = data[type] ? data[type].filter(mappedField => !mappedField.formField && mappedField[field] && mappedField.required) : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}
