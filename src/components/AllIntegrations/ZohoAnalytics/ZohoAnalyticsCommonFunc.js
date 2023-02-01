import { __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'
import { checkValidEmail } from '../../../Utils/Helpers'

export const setGrantTokenResponse = () => {
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
  localStorage.setItem('__bitforms_zohoAnalytics', JSON.stringify(grantTokenResponse))
  window.close()
}

export const handleInput = (e, analyticsConf, setAnalyticsConf, formID, setisLoading, setSnackbar) => {
  let newConf = { ...analyticsConf }
  const { name, value } = e.target
  newConf[name] = value

  switch (name) {
    case 'workspace':
      newConf = workspaceChange(newConf, formID, setAnalyticsConf, setisLoading, setSnackbar)
      break
    case 'table':
      newConf = tableChange(newConf, formID, setAnalyticsConf, setisLoading, setSnackbar)
      break
    default:
      break
  }
  setAnalyticsConf({ ...newConf })
}

export const workspaceChange = (analyticsConf, formID, setAnalyticsConf, setisLoading, setSnackbar) => {
  const newConf = { ...analyticsConf }
  newConf.table = ''
  newConf.field_map = [{ formField: '', zohoFormField: '' }]

  if (!newConf?.default?.tables?.[analyticsConf.workspace]) {
    refreshTables(formID, newConf, setAnalyticsConf, setisLoading, setSnackbar)
  } else if (Object.keys(newConf?.default?.tables?.[analyticsConf.workspace]).length === 1) {
    newConf.table = newConf?.default?.tables?.[analyticsConf.workspace][0].viewName

    if (!newConf?.default?.tables?.headers?.[newConf.table]) {
      refreshTableHeaders(formID, newConf, setAnalyticsConf, setisLoading, setSnackbar)
    }
  }

  if (!analyticsConf.default.users) {
    refreshUsers(formID, analyticsConf, setAnalyticsConf, setisLoading, setSnackbar)
  }

  return newConf
}

export const tableChange = (analyticsConf, formID, setAnalyticsConf, setisLoading, setSnackbar) => {
  const newConf = { ...analyticsConf }
  newConf.field_map = [{ formField: '', zohoFormField: '' }]

  if (!newConf?.default?.tables?.headers?.[analyticsConf.table]) {
    refreshTableHeaders(formID, newConf, setAnalyticsConf, setisLoading, setSnackbar)
  }

  return newConf
}

export const refreshWorkspaces = (formID, analyticsConf, setAnalyticsConf, setisLoading, setSnackbar) => {
  setisLoading(true)
  const refreshModulesRequestParams = {
    formID,
    id: analyticsConf.id,
    dataCenter: analyticsConf.dataCenter,
    clientId: analyticsConf.clientId,
    clientSecret: analyticsConf.clientSecret,
    tokenDetails: analyticsConf.tokenDetails,
    ownerEmail: analyticsConf.ownerEmail,
  }
  bitsFetch(refreshModulesRequestParams, 'bitforms_zanalytics_refresh_workspaces')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...analyticsConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data.workspaces) {
          newConf.default.workspaces = result.data.workspaces
        }
        if (result.data.tokenDetails) {
          newConf.tokenDetails = result.data.tokenDetails
        }
        setSnackbar({ show: true, msg: __('Workspaces refreshed', 'bitform') })
        setAnalyticsConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: `${__('Workspaces refresh failed Cause:', 'bitform')}${result.data.data || result.data}. ${__('please try again', 'bitform')}` })
      } else {
        setSnackbar({ show: true, msg: __('Workspaces refresh failed. please try again', 'bitform') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const refreshUsers = (formID, analyticsConf, setAnalyticsConf, setisLoading, setSnackbar) => {
  setisLoading(true)
  const refreshUsersRequestParams = {
    formID,
    id: analyticsConf.id,
    dataCenter: analyticsConf.dataCenter,
    clientId: analyticsConf.clientId,
    clientSecret: analyticsConf.clientSecret,
    tokenDetails: analyticsConf.tokenDetails,
    ownerEmail: analyticsConf.ownerEmail,
  }
  bitsFetch(refreshUsersRequestParams, 'bitforms_zanalytics_refresh_users')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...analyticsConf }
        if (!newConf.default) {
          newConf.default = {}
        }
        if (result.data.users) {
          newConf.default.users = result.data.users
        }
        if (result.data.tokenDetails) {
          newConf.tokenDetails = result.data.tokenDetails
        }
        setSnackbar({ show: true, msg: __('Users refreshed', 'bitform') })
        setAnalyticsConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: `${__('Users refresh failed Cause:', 'bitform')}${result.data.data || result.data}. ${__('please try again', 'bitform')}` })
      } else {
        setSnackbar({ show: true, msg: __('Users refresh failed. please try again', 'bitform') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const refreshTables = (formID, analyticsConf, setAnalyticsConf, setisLoading, setSnackbar) => {
  const { workspace } = analyticsConf
  if (!workspace) {
    return
  }

  setisLoading(true)
  const refreshTablesRequestParams = {
    formID,
    workspace,
    dataCenter: analyticsConf.dataCenter,
    clientId: analyticsConf.clientId,
    clientSecret: analyticsConf.clientSecret,
    tokenDetails: analyticsConf.tokenDetails,
    ownerEmail: analyticsConf.ownerEmail,
  }
  bitsFetch(refreshTablesRequestParams, 'bitforms_zanalytics_refresh_tables')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...analyticsConf }
        if (result.data.tables) {
          if (!newConf.default.tables) {
            newConf.default.tables = {}
          }
          newConf.default.tables[workspace] = result.data.tables
        }

        if (result.data.tokenDetails) {
          newConf.tokenDetails = result.data.tokenDetails
        }
        setSnackbar({ show: true, msg: __('Tables refreshed', 'bitform') })
        setAnalyticsConf({ ...newConf })
      } else {
        setSnackbar({ show: true, msg: __('Tables refresh failed. please try again', 'bitform') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const refreshTableHeaders = (formID, analyticsConf, setAnalyticsConf, setisLoading, setSnackbar) => {
  const { workspace, table } = analyticsConf
  if (!table) {
    return
  }

  setisLoading(true)
  const refreshTableHeadersRequestParams = {
    formID,
    workspace,
    table,
    dataCenter: analyticsConf.dataCenter,
    clientId: analyticsConf.clientId,
    clientSecret: analyticsConf.clientSecret,
    tokenDetails: analyticsConf.tokenDetails,
    ownerEmail: analyticsConf.ownerEmail,
  }
  bitsFetch(refreshTableHeadersRequestParams, 'bitforms_zanalytics_refresh_table_headers')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...analyticsConf }
        if (result.data.table_headers) {
          if (!newConf.default.tables.headers) {
            newConf.default.tables.headers = {}
          }
          newConf.default.tables.headers[table] = result.data.table_headers
          setSnackbar({ show: true, msg: __('Table Headers refreshed', 'bitform') })
        } else {
          setSnackbar({ show: true, msg: __("Zoho didn't provide column names for this table", 'bitform') })
        }

        if (result.data.tokenDetails) {
          newConf.tokenDetails = result.data.tokenDetails
        }
        setAnalyticsConf({ ...newConf })
      } else {
        setSnackbar({ show: true, msg: __('Table Headers refresh failed. please try again', 'bitform') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}
