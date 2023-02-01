/* eslint-disable no-else-return */
import toast from 'react-hot-toast'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'

export const handleInput = (e, dropboxConf, setDropboxConf, setIsLoading, setSnackbar, isNew, error, setError) => {
  const newConf = { ...dropboxConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }
  setDropboxConf({ ...newConf })
}

export const getAllDropboxFolders = (formID = null, dropboxConf, setDropboxConf) => {
  const queryParams = {
    formID,
    id: dropboxConf.id ?? null,
    apiKey: dropboxConf.apiKey,
    apiSecret: dropboxConf.apiSecret,
    tokenDetails: dropboxConf.tokenDetails,
  }
  const loadPostTypes = bitsFetch(queryParams, 'bitforms_dropbox_get_all_folders')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...dropboxConf }
        if (result.data.dropboxFoldersList) {
          newConf.foldersList = result.data.dropboxFoldersList
          newConf.tokenDetails = result.data.tokenDetails
        }

        setDropboxConf(newConf)
        return 'Dropbox Folders List refreshed successfully'
      } else {
        return 'Dropbox Folders List refresh failed. please try again'
      }
    })
  toast.promise(loadPostTypes, {
    success: data => data,
    error: __('Error Occurred', 'bitform'),
    loading: __('Loading Dropbox Folders List...', 'bitform'),
  })
}

export const handleAuthorize = (confTmp, setConf, setIsAuthorized, setIsLoading) => {
  if (!confTmp.accessCode || !confTmp.apiKey || !confTmp.apiSecret) {
    toast.error(__('Dropbox ApiKey, ApiSecret & Access Code can\'t be empty', 'bitform'))
    return
  }
  setIsLoading(true)

  const tokenRequestParams = {
    apiKey: confTmp.apiKey,
    apiSecret: confTmp.apiSecret,
    accessCode: confTmp.accessCode,
  }

  bitsFetch(tokenRequestParams, 'bitforms_dropbox_authorization')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        newConf.tokenDetails = result.data
        setConf(newConf)
        setIsAuthorized(true)
        toast.success(__('Authorized Successfully', 'bitform'))
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        toast.error(`${__('Authorization failed Cause: ', 'bitform')}${result.data.data || result.data}. ${__('please try again', 'bitform')}`)
      } else {
        toast.error(__('Authorization failed. please try again', 'bitform'))
      }
      setIsLoading(false)
    })
}
