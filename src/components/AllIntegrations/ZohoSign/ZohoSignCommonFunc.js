import { __, sprintf } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'

export const handleInput = (e, signConf, setSignConf, formID, setisLoading, setSnackbar, isNew, error, setError) => {
  let newConf = { ...signConf }
  if (isNew) {
    const rmError = { ...error }
    rmError[e.target.name] = ''
    setError({ ...rmError })
  }
  newConf[e.target.name] = e.target.value

  switch (e.target.name) {
    case 'template':
      newConf = templateChange(newConf, formID, setSignConf, setisLoading, setSnackbar)
      break
    default:
      break
  }
  setSignConf({ ...newConf })
}

export const templateChange = (signConf, formID, setSignConf, setisLoading, setSnackbar) => {
  const newConf = { ...signConf }
  newConf.table = ''
  newConf.field_map = [{ formField: '', zohoFormField: '' }]
  delete newConf.templateActions

  if (!newConf?.default?.templateDetails?.[signConf.template]) {
    refreshTemplateDetails(formID, newConf, setSignConf, setisLoading, setSnackbar)
  }

  return newConf
}

export const refreshTemplates = (formID, signConf, setSignConf, setisLoading, setSnackbar) => {
  setisLoading(true)
  const refreshModulesRequestParams = {
    formID,
    id: signConf.id,
    dataCenter: signConf.dataCenter,
    clientId: signConf.clientId,
    clientSecret: signConf.clientSecret,
    tokenDetails: signConf.tokenDetails,
  }
  bitsFetch(refreshModulesRequestParams, 'bitforms_zsign_refresh_templates')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...signConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data.templates) {
          newConf.default.templates = result.data.templates
        }
        if (result.data.tokenDetails) newConf.tokenDetails = result.data.tokenDetails
        setSnackbar({ show: true, msg: __('Templates refreshed', 'bitform') })
        setSignConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: sprintf(__('Templates refresh failed Cause: %s. please try again', 'bitform'), result.data.data || result.data) })
      } else {
        setSnackbar({ show: true, msg: __('Templates refresh failed. please try again', 'bitform') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const refreshTemplateDetails = (formID, signConf, setSignConf, setisLoading, setSnackbar) => {
  const { template } = signConf
  setisLoading(true)
  const refreshModulesRequestParams = {
    formID,
    id: signConf.id,
    dataCenter: signConf.dataCenter,
    clientId: signConf.clientId,
    clientSecret: signConf.clientSecret,
    tokenDetails: signConf.tokenDetails,
    template,
  }
  bitsFetch(refreshModulesRequestParams, 'bitforms_zsign_refresh_template_details')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...signConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (!newConf.default.templateDetails) newConf.default.templateDetails = {}
        if (result.data.templateDetails) {
          newConf.default.templateDetails[template] = result.data.templateDetails
        }
        if (result.data.tokenDetails) newConf.tokenDetails = result.data.tokenDetails
        setSnackbar({ show: true, msg: __('Template Details refreshed', 'bitform') })
        setSignConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: sprintf(__('Template Details refresh failed Cause: %s. please try again', 'bitform'), result.data.data || result.data) })
      } else {
        setSnackbar({ show: true, msg: __('Template Details refresh failed. please try again', 'bitform') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const setGrantTokenResponse = (integ) => {
  const grantTokenResponse = {}
  const authWindowLocation = window.location.href
  const queryParams = authWindowLocation.replace(`${window.opener.location.href}/redirect`, '').split('&')
  if (queryParams) {
    queryParams.forEach(element => {
      const gtKeyValue = element.split('=')
      if (gtKeyValue[1]) {
        // eslint-disable-next-line prefer-destructuring
        grantTokenResponse[gtKeyValue[0]] = gtKeyValue[1]
      }
    })
  }
  localStorage.setItem(`__bitforms_${integ}`, JSON.stringify(grantTokenResponse))
  window.close()
}
