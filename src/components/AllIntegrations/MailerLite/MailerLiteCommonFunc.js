/* eslint-disable no-else-return */
import toast from 'react-hot-toast'
import { __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'

export const handleInput = (e, mailerLiteConf, setMailerLiteConf) => {
  const newConf = { ...mailerLiteConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  setMailerLiteConf({ ...newConf })
}



export const generateMappedField = (mailerLiteConf) => {
  const requiredFlds = mailerLiteConf?.mailerLiteFields.filter(fld => fld.required === true)
  return requiredFlds.length > 0 ? requiredFlds.map(field => ({ formField: '', mailerLiteFormField: field.key })) : [{ formField: '', mailerLiteFormField: '' }]
}

export const checkMappedFields = (mailerLiteConf) => {
  const mappedFields = mailerLiteConf?.field_map ? mailerLiteConf.field_map.filter(mappedField => (!mappedField.formField || !mappedField.mailerLiteFormField || (!mappedField.formField === 'custom' && !mappedField.customValue))) : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}
export const mailerliteRefreshFields = (confTmp, setConf, setError,setisAuthorized, setIsLoading, type) => {
  if (!confTmp.auth_token) {
    setError({ auth_token: !confTmp.auth_token ? __('Api Key can\'t be empty', 'bitform') : '' })
    return
  }
  setError({})
  setIsLoading(true)

  const requestParams = { auth_token: confTmp.auth_token }
  console.log('requestParams', requestParams)
  bitsFetch(requestParams, 'bitforms_mailerlite_refresh_fields')
    .then(result => {
      console.log('result', result)
      if (result && result.success) {
        const newConf = { ...confTmp }
        if (result.data) {
          newConf.mailerLiteFields = result.data
        }
        setConf(newConf)
        if (type === 'authorization') {
          setIsLoading(false)
          setisAuthorized(true)
          toast.success(__('Authorized successfully', 'bitform'))
        } else {
          setIsLoading(false)
          toast.success(__('Fields refresh successfully', 'bitform'))
        }
        return
      }
      if (type === 'authorization') {
        setIsLoading(false)
        setisAuthorized(false)
        toast.error(__(result.data, 'bitform'))
        toast.error(__('Authorized Failed', 'bitform'))
      } else {
        setIsLoading(false)
        toast.error(__('Fields refresh failed', 'bitform'))
      }
    })
}

export const getAllGroups = (confTmp, setConf, setIsLoading) => {
  setIsLoading(true)
  const requestParams = { auth_token: confTmp.auth_token }

  bitsFetch(requestParams, 'bitforms_mailerlite_fetch_all_groups')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        if (result.data) {
          newConf.groups = result.data
        }
        setConf(newConf)
        setIsLoading(false)
        toast.success(__('Group fetch successfully', 'bitform'))
        return
      }
      setIsLoading(false)
      toast.error(__('Group fetch failed', 'bitform'))
    })

}
