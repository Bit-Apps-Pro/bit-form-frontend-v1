// eslint-disable-next-line import/no-extraneous-dependencies
import { sprintf, __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'

export const handleInput = (e, sendinBlueConf, setSendinBlueConf) => {
  const newConf = { ...sendinBlueConf }
  newConf.name = e.target.value
  setSendinBlueConf({ ...newConf })
}
export const refreshLists = (sendinBlueConf, setSendinBlueConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const refreshListsRequestParams = { api_key: sendinBlueConf.api_key }
  bitsFetch(refreshListsRequestParams, 'bitforms_sblue_refresh_lists')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...sendinBlueConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data.sblueList) {
          newConf.default.sblueList = result.data.sblueList
        }
        setSnackbar({ show: true, msg: __('List refreshed', 'bitform') })
        setSendinBlueConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: sprintf(__('List refresh failed Cause: %s. please try again', 'bitform'), result.data.data || result.data) })
      } else {
        setSnackbar({ show: true, msg: __('List failed. please try again', 'bitform') })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

export const refreshTemplate = (sendinBlueConf, setSendinBlueConf, setSnackbar) => {
  // setIsLoading(true)
  const refreshListsRequestParams = { api_key: sendinBlueConf.api_key }
  bitsFetch(refreshListsRequestParams, 'bitforms_sblue_refresh_template')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...sendinBlueConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data.sblueTemplates) {
          newConf.default.sblueTemplates = result.data.sblueTemplates
        }
        setSnackbar({ show: true, msg: __('Templates refreshed', 'bitform') })
        setSendinBlueConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: sprintf(__('Templates refresh failed Cause: %s. please try again', 'bitform'), result.data.data || result.data) })
      } else {
        setSnackbar({ show: true, msg: __('Templates failed. please try again', 'bitform') })
      }
      // setIsLoading(false)
    })
  // .catch(() => setIsLoading(false))
}

export const refreshSendinBlueHeader = (sendinBlueConf, setSendinBlueConf, setisLoading, setSnackbar) => {
  const refreshListsRequestParams = { api_key: sendinBlueConf.api_key }
  bitsFetch(refreshListsRequestParams, 'bitforms_sblue_headers')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...sendinBlueConf }
        if (result.data.sendinBlueField) {
          newConf.default.fields = result.data.sendinBlueField
          const { fields } = newConf.default
          newConf.field_map = Object.values(fields).filter(f => f.required).map(f => ({ formField: '', sendinBlueField: f.fieldId, required: true }))
          setSnackbar({ show: true, msg: __('SendinBlue fields refreshed', 'bitform') })
        } else {
          setSnackbar({ show: true, msg: __('No SendinBlue fields found. Try changing the header row number or try again', 'bitform') })
        }

        setSendinBlueConf({ ...newConf })
      } else {
        setSnackbar({ show: true, msg: __('SendinBlue fields refresh failed. please try again', 'bitform') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const checkMappedFields = sendinBlueConf => {
  const mappedFields = sendinBlueConf?.field_map ? sendinBlueConf.field_map.filter(mappedField => (!mappedField.formField && mappedField.sendinBlueField && mappedField.required)) : []
  if (sendinBlueConf.lists && sendinBlueConf.lists?.length === undefined) return false
  if (mappedFields.length > 0) return false
  return true
}
