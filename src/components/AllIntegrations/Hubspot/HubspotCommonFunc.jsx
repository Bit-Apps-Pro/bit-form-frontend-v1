/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line import/no-extraneous-dependencies
import toast from 'react-hot-toast'
import { sprintf, __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'

export const handleInput = (e, hubspotConf, setHubspotConf, setIsLoading) => {
  const newConf = { ...hubspotConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  setHubspotConf({ ...newConf })
}
export const checkMappedFields = (hubspotConf) => {
  const mappedFields = hubspotConf?.field_map ? hubspotConf.field_map.filter(mappedField => (!mappedField.formField || !mappedField.hubspotField || (!mappedField.formField === 'custom' && !mappedField.customValue))) : []

  if (mappedFields.length > 0) {
    return false
  }
  return true
}
export const generateMappedField = (hubspotConf, actionName) => {
  let fields = []
  if (actionName === 'contact-create') {
    fields = hubspotConf?.contactFields
  } else if (actionName === 'deal-create') {
    fields = hubspotConf?.dealFields
  } else if (actionName === 'ticket-create') {
    fields = hubspotConf?.ticketFields
  }
  const requiredFlds = fields.filter(fld => fld.required === true)
  return requiredFlds.length > 0 ? requiredFlds.map(field => ({ formField: '', hubspotField: field.key })) : [{ formField: '', hubspotField: '' }]
}
export const getAllPipelines = (hubspotConf, setHubspotConf, setIsLoading) => {
  setIsLoading(true)
  let name = ''
  hubspotConf?.actionName === 'deal-create' ? name = 'deals' : name = 'tickets'
  const queryParams = { apiKey: hubspotConf.api_key, actionName: name }
  const loadPostTypes = bitsFetch(queryParams, 'bitforms_hubspot_pipeline')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...hubspotConf }
        if (!newConf.default) newConf.default = {}
        // if (newConf?.default?.pipelines) newConf.default.pipelines = []
        newConf.default.pipelines = result.data
        setHubspotConf({ ...newConf })
        setIsLoading(false)
        return 'Pipeline refreshed successfully'
      }
      setIsLoading(false)
      return 'Pipeline refresh failed. please try again'
    })
  toast.promise(loadPostTypes, {
    success: data => data,
    error: __('Error Occurred', 'bitform'),
    loading: __('Loading Pipelines...'),
  })
}
export const getAllOwners = (hubspotConf, setHubspotConf, setIsLoading) => {
  setIsLoading(true)
  const queryParams = { apiKey: hubspotConf.api_key }
  const loadPostTypes = bitsFetch(queryParams, 'bitforms_hubspot_owners')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...hubspotConf }
        if (!newConf.default) newConf.default = {}
        newConf.default.owners = result.data
        setHubspotConf({ ...newConf })
        setIsLoading(false)
        return 'Owners refreshed successfully'
      }
      setIsLoading(false)
      return 'Owners refresh failed. please try again'
    })
  toast.promise(loadPostTypes, {
    success: data => data,
    error: __('Error Occurred', 'bitform'),
    loading: __('Loading Owners...'),
  })
}
export const getAllContacts = (hubspotConf, setHubspotConf, setIsLoading) => {
  setIsLoading(true)
  const queryParams = { apiKey: hubspotConf.api_key }
  const loadPostTypes = bitsFetch(queryParams, 'bitforms_hubspot_contacts')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...hubspotConf }
        if (!newConf.default) newConf.default = {}
        newConf.default.contacts = result.data
        setHubspotConf({ ...newConf })
        setIsLoading(false)
        return 'Contacts refreshed successfully'
      }
      setIsLoading(false)
      return 'Contacts refresh failed. please try again'
    })
  toast.promise(loadPostTypes, {
    success: data => data,
    error: __('Error Occurred', 'bitform'),
    loading: __('Loading Contacts...'),
  })
}
export const getAllCompany = (hubspotConf, setHubspotConf, setIsLoading) => {
  setIsLoading(true)
  const queryParams = { apiKey: hubspotConf.api_key }
  const loadPostTypes = bitsFetch(queryParams, 'bitforms_hubspot_company')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...hubspotConf }
        if (!newConf.default) newConf.default = {}
        newConf.default.companies = result.data
        setHubspotConf({ ...newConf })
        setIsLoading(false)
        return 'Company refreshed successfully'
      }
      setIsLoading(false)
      return 'Company refresh failed. please try again'
    })
  toast.promise(loadPostTypes, {
    success: data => data,
    error: __('Error Occurred', 'bitform'),
    loading: __('Loading Company...'),
  })
}
