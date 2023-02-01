// eslint-disable-next-line no-unused-vars
import toast from 'react-hot-toast'
import { __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'

export const addFieldMap = (fldProp, i, confTmp, setConf) => {
  const newConf = { ...confTmp }
  newConf[fldProp].splice(i, 0, {})

  setConf({ ...newConf })
}

export const refreshMetaboxFields = (metaboxeConf, setMetaboxFields, setMetaboxFile) => {
  const loadMetaboxFields = bitsFetch({ post_type: metaboxeConf?.post_type }, 'bitforms_get_metabox_fields').then((res) => {
    if (res !== undefined && res.success) {
      if (res?.data?.metaboxFields) {
        setMetaboxFields(res.data.metaboxFields)
      }
      if (res?.data?.metaboxFile) {
        setMetaboxFile(res.data.metaboxFile)
      }
    }
    if (res?.data?.metaboxFields.length !== 0 || res?.data?.metaboxFile.length !== 0) return 'Successfully refresh MetaBox Fields.'
    return 'MetaBox Fields not found'
  })
  toast.promise(loadMetaboxFields, {
    success: data => data,
    error: __('Error Occured', 'bitform'),
    loading: __('Loading MetaBox Fields...'),
  })
}

export const delFieldMap = (fldProp, i, confTmp, setConf) => {
  const newConf = { ...confTmp }
  if (newConf[fldProp].length > 1) {
    newConf[fldProp].splice(i, 1)
  }

  setConf({ ...newConf })
}

export const handleFieldMapping = (fldProp, event, index, conftTmp, setConf) => {
  const newConf = { ...conftTmp }
  newConf[fldProp][index][event.target.name] = event.target.value

  setConf({ ...newConf })
}

export const checkMappedPostFields = data => {
  const mappedFields = data?.post_map ? data.post_map.filter(mappedField => !mappedField.formField && mappedField.postField && mappedField.required) : []
  if (mappedFields.length > 0) {
    return false
  }
  return true
}
export const checkMappedAcfFields = data => {
  const mappedFields = data?.metabox_map ? data.metabox_map.filter(mappedField => !mappedField.formField && mappedField.acfField && mappedField.required) : []
  if (mappedFields.length > 0) {
    return false
  }

  return true
}

export const refreshPostTypes = (postTypes, setPostTypes) => {
  const loadPostTypes = bitsFetch({}, 'bitforms_get_post_type')
    .then(result => {
      if (result && result.success) {
        let tmp = { ...postTypes }
        if (result?.data?.post_types) {
          tmp = Object.values(result?.data?.post_types)
          setPostTypes(tmp)
        }
        if (result?.data?.post_types.length !== 0) return 'Successfully refresh Post Types.'
        return ' Post Types not found'
      }
    })

  toast.promise(loadPostTypes, {
    success: data => data,
    error: __('Error Occured', 'bitform'),
    loading: __('Loading Post Types...'),
  })
}
