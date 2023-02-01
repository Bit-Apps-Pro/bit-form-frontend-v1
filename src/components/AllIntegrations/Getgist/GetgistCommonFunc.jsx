import toast from 'react-hot-toast'
import { __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'

// eslint-disable-next-line import/no-extraneous-dependencies
export const handleInput = (e, getgistConf, setGetgistConf, setIsLoading) => {
  const newConf = { ...getgistConf }
  newConf.name = e.target.value
  setGetgistConf({ ...newConf })
}

export const checkMappedFields = (getgistConf) => {
  const mappedFields = getgistConf?.field_map ? getgistConf.field_map.filter(mappedField => (!mappedField.formField || !mappedField.getgistFormField || (!mappedField.formField === 'custom' && !mappedField.customValue))) : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}

export const getAllTags = (getgistConf, setGetgistConf, setIsLoading) => {
  setIsLoading(true)
  const queryParams = { apiKey: getgistConf.api_key }
  const loadPostTypes = bitsFetch(queryParams, 'bitforms_getgist_tags')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...getgistConf }
        if (!newConf.default) newConf.default = {}
        newConf.default.tags = result.data
        setGetgistConf({ ...newConf })
        setIsLoading(false)
        return 'Tags refreshed successfully'
      }
      setIsLoading(false)
      return 'Tags refresh failed. Please, try again'
    })
  toast.promise(loadPostTypes, {
    success: data => data,
    error: __('Error Occurred', 'bitform'),
    loading: __('Loading Tags...'),
  })
}

export const generateMappedField = (getgistConf) => {
  const requiredFlds = getgistConf?.gistFields.filter(fld => fld.required === true)
  return requiredFlds.length > 0 ? requiredFlds.map(field => ({ formField: '', getgistFormField: field.key })) : [{ formField: '', getgistFormField: '' }]
}
