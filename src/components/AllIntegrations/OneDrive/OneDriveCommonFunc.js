/* eslint-disable no-else-return */
import toast from 'react-hot-toast'
import { __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'
import { sortArrOfObj } from '../../../Utils/Helpers'

export const handleInput = (e, oneDriveConf, setOneDriveConf, formID, setIsLoading, setSnackbar, i = 0) => {
  let newConf = { ...oneDriveConf }
  const { name } = e.target
  if (e.target.value !== '') {
    newConf[name] = e.target.value
  } else {
    delete newConf[name]
  }

  newConf[e.target.name] = e.target.value
  switch (e.target.name) {
    case 'folder':
      newConf.folderMap = newConf.folderMap.slice(0, i)
      newConf = folderChange(newConf, formID, setOneDriveConf, setIsLoading, setSnackbar)
      break
    default:
      break
  }
  setOneDriveConf({ ...newConf })
}

export const folderChange = (oneDriveConf, formID, setOneDriveConf, setIsLoading, setSnackbar) => {
  const newConf = { ...oneDriveConf }
  delete newConf.teamType

  if (newConf.folder && !newConf.default?.folders?.[newConf.folder]) {
    getSingleOneDriveFolders(formID, newConf, setOneDriveConf, setIsLoading, setSnackbar)
  } else if (newConf.folder && newConf.folder !== newConf.folderMap[newConf.folderMap.length - 1]) newConf.folderMap.push(newConf.folder)

  return newConf
}

export const getAllOneDriveFolders = (flowID, oneDriveConf, setOneDriveConf, setIsLoading, setSnackbar) => {
  setIsLoading(true)
  const queryParams = {
    flowID: flowID ?? null,
    clientId: oneDriveConf.clientId,
    clientSecret: oneDriveConf.clientSecret,
    tokenDetails: oneDriveConf.tokenDetails,
  }
  const loadPostTypes = bitsFetch(queryParams, 'bitforms_oneDrive_get_all_folders')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...oneDriveConf }
        if (!newConf.default) newConf.default = {}
        if (result.data.oneDriveFoldersList) {
          newConf.default.rootFolders = result.data.oneDriveFoldersList
          newConf.tokenDetails = result.data.tokenDetails
        }

        setOneDriveConf(newConf)
        setIsLoading(false)
        return 'OneDrive Folders List refreshed successfully'
      } else {
        setIsLoading(false)
        return 'OneDrive Folders List refresh failed. please try again'
      }
    })
    .catch(() => setIsLoading(false))
  toast.promise(loadPostTypes, {
    success: data => data,
    error: __('Error Occurred', 'bitform'),
    loading: __('Loading OneDrive Folders List...', 'bitform'),
  })
}

export const getSingleOneDriveFolders = (formID, oneDriveConf, setOneDriveConf, setIsLoading, setSnackbar, ind) => {
  const folder = ind ? oneDriveConf.folderMap[ind] : oneDriveConf.folder
  setIsLoading(true)
  const refreshSubFoldersRequestParams = {
    formID,
    dataCenter: oneDriveConf.dataCenter,
    clientId: oneDriveConf.clientId,
    clientSecret: oneDriveConf.clientSecret,
    tokenDetails: oneDriveConf.tokenDetails,
    // redirectURI: `${btcbi.api.base}/redirect`,
    team: oneDriveConf.team,
    folder,
    teamType: 'teamType' in oneDriveConf ? 'private' : 'team',
  }

  bitsFetch(refreshSubFoldersRequestParams, 'bitforms_oneDrive_get_single_folder')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...oneDriveConf }
        if (result.data.folders) {
          if (!newConf.default.folders) {
            newConf.default.folders = {}
          }

          newConf.default.folders[folder] = sortArrOfObj(result.data.folders, 'folderName')
          if (!newConf.folderMap.includes(folder)) newConf.folderMap.push(folder)
          setSnackbar({ show: true, msg: __('Sub Folders refreshed', 'bitform') })
        } else {
          setSnackbar({ show: true, msg: __('No Sub Folder Found', 'bitform') })
        }

        if (result.data.tokenDetails) {
          newConf.tokenDetails = result.data.tokenDetails
        }
        setOneDriveConf({ ...newConf })
      } else {
        setSnackbar({ show: true, msg: __('Sub Folders refresh failed. please try again', 'bitform') })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

export const handleAuthorize = (confTmp, setConf, setIsAuthorized, setIsLoading, setError) => {
  if (!confTmp.clientId || !confTmp.clientSecret) {
    setError({
      clientId: !confTmp.clientId ? __('Client Id can\'t be empty', 'bitform') : '',
      clientSecret: !confTmp.clientSecret ? __('Client Secret can\'t be empty', 'bitform') : '',
    })
    return
  }
  setIsLoading(true)
  const scopes = 'onedrive.readwrite offline_access Files.ReadWrite.All'
  // eslint-disable-next-line no-undef
  const apiEndpoint = `https://login.live.com/oauth20_authorize.srf?client_id=${confTmp.clientId}&scope=${scopes}&access_type=offline&prompt=consent&response_type=code&state=${encodeURIComponent(window.location.href)}/redirect&redirect_uri=${encodeURIComponent(bits.oneDriveRedirectURL)}`
  const authWindow = window.open(apiEndpoint, 'oneDrive', 'width=400,height=609,toolbar=off')
  const popupURLCheckTimer = setInterval(() => {
    if (authWindow.closed) {
      clearInterval(popupURLCheckTimer)
      let grantTokenResponse = {}
      let isAuthRedirectLocation = false
      const bitsOneDrive = localStorage.getItem('__bitforms_oneDrive')
      if (bitsOneDrive) {
        isAuthRedirectLocation = true
        grantTokenResponse = JSON.parse(bitsOneDrive)
        localStorage.removeItem('__bitforms_oneDrive')
      }
      if (!grantTokenResponse.code || grantTokenResponse.error || !grantTokenResponse || !isAuthRedirectLocation) {
        const errorCause = grantTokenResponse.error ? `Cause: ${grantTokenResponse.error}` : ''
        toast.error(`${__('Authorization failed', 'bitform')} ${errorCause}. ${__('please try again', 'bitform')}`)
        setIsLoading(false)
      } else {
        const newConf = { ...confTmp }
        newConf.accountServer = grantTokenResponse['accounts-server']
        tokenHelper(grantTokenResponse, newConf, setConf, setIsAuthorized, setIsLoading)
      }
    }
  }, 500)
}

const tokenHelper = (grantToken, confTmp, setConf, setIsAuthorized, setIsLoading) => {
  const tokenRequestParams = { ...grantToken }
  tokenRequestParams.clientId = confTmp.clientId
  tokenRequestParams.clientSecret = confTmp.clientSecret
  // eslint-disable-next-line no-undef
  tokenRequestParams.redirectURI = bits.oneDriveRedirectURL
  bitsFetch(tokenRequestParams, 'bitforms_oneDrive_authorization')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        newConf.tokenDetails = result.data
        setConf(newConf)
        setIsAuthorized(true)
        toast.success(__('Authorized Successfully', 'bitform'))
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        toast.error(`${__('Authorization failed Cause:', 'bitform')}${result.data.data || result.data}. ${__('please try again', 'bitform')}`)
      } else {
        toast.error(__('Authorization failed. please try again', 'bitform'))
      }
      setIsLoading(false)
    })
}
