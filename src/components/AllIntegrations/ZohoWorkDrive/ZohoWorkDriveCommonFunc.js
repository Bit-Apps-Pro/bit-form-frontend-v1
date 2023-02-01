import { __, sprintf } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'
import { sortArrOfObj } from '../../../Utils/Helpers'

export const handleInput = (e, workDriveConf, setWorkDriveConf, formID, setisLoading, setSnackbar, ind, isNew, error, setError) => {
  let newConf = { ...workDriveConf }
  if (isNew) {
    const rmError = { ...error }
    rmError[e.target.name] = ''
    setError({ ...rmError })
  }
  newConf[e.target.name] = e.target.value

  switch (e.target.name) {
    case 'team':
      newConf = teamChange(newConf, formID, setWorkDriveConf, setisLoading, setSnackbar)
      break
    case 'folder':
      newConf.folderMap = newConf.folderMap.slice(0, ind)
      newConf = folderChange(newConf, formID, setWorkDriveConf, setisLoading, setSnackbar)
      break
    default:
      break
  }
  setWorkDriveConf({ ...newConf })
}

export const teamChange = (workDriveConf, formID, setWorkDriveConf, setisLoading, setSnackbar) => {
  const newConf = { ...workDriveConf }
  newConf.folder = ''

  if (newConf.team && !newConf?.default?.teamFolders?.[newConf.team]) {
    refreshTeamFolders(formID, newConf, setWorkDriveConf, setisLoading, setSnackbar)
  }
  return newConf
}

export const folderChange = (workDriveConf, formID, setWorkDriveConf, setisLoading, setSnackbar) => {
  const newConf = { ...workDriveConf }
  delete newConf.teamType

  if (newConf.folder && !newConf.default?.folders?.[newConf.folder]) {
    if (newConf.default?.teamFolders?.[newConf.team]?.[newConf.folder]?.type === 'private') {
      newConf.teamType = 'private'
    }
    refreshSubFolders(formID, newConf, setWorkDriveConf, setisLoading, setSnackbar)
  } else if (newConf.folder && newConf.folder !== newConf.folderMap[newConf.folderMap.length - 1]) newConf.folderMap.push(newConf.folder)

  return newConf
}

export const refreshTeams = (formID, workDriveConf, setWorkDriveConf, setisLoading, setSnackbar) => {
  setisLoading(true)
  const refreshTeamsRequestParams = {
    formID,
    id: workDriveConf.id,
    dataCenter: workDriveConf.dataCenter,
    clientId: workDriveConf.clientId,
    clientSecret: workDriveConf.clientSecret,
    tokenDetails: workDriveConf.tokenDetails,
  }
  bitsFetch(refreshTeamsRequestParams, 'bitforms_zworkdrive_refresh_teams')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...workDriveConf }
        if (result.data.teams) {
          newConf.default = { ...newConf.default, teams: result.data.teams }
        }
        if (result.data.tokenDetails) newConf.tokenDetails = result.data.tokenDetails
        setSnackbar({ show: true, msg: __('Teams refreshed', 'bitform') })
        setWorkDriveConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: sprintf(__('Teams refresh failed Cause: %s. please try again', 'bitform'), result.data.data || result.data) })
      } else {
        setSnackbar({ show: true, msg: __('Teams refresh failed. please try again', 'bitform') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const refreshTeamFolders = (formID, workDriveConf, setWorkDriveConf, setisLoading, setSnackbar) => {
  setisLoading(true)
  const refreshTeamFoldersRequestParams = {
    formID,
    id: workDriveConf.id,
    dataCenter: workDriveConf.dataCenter,
    clientId: workDriveConf.clientId,
    clientSecret: workDriveConf.clientSecret,
    tokenDetails: workDriveConf.tokenDetails,
    team: workDriveConf.team,
  }
  bitsFetch(refreshTeamFoldersRequestParams, 'bitforms_zworkdrive_refresh_team_folders')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...workDriveConf }
        if (!newConf.default.teamFolders) {
          newConf.default.teamFolders = {}
        }
        if (result.data.teamFolders) {
          newConf.default.teamFolders[newConf.team] = result.data.teamFolders
        }
        if (result.data.tokenDetails) newConf.tokenDetails = result.data.tokenDetails
        setSnackbar({ show: true, msg: __('Folders refreshed', 'bitform') })
        setWorkDriveConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: sprintf(__('Folders refresh failed Cause: %s. please try again', 'bitform'), result.data.data || result.data) })
      } else {
        setSnackbar({ show: true, msg: __('Folders refresh failed. please try again', 'bitform') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const refreshSubFolders = (formID, workDriveConf, setWorkDriveConf, setisLoading, setSnackbar, ind) => {
  const folder = ind ? workDriveConf.folderMap[ind] : workDriveConf.folder
  setisLoading(true)
  const refreshSubFoldersRequestParams = {
    formID,
    dataCenter: workDriveConf.dataCenter,
    clientId: workDriveConf.clientId,
    clientSecret: workDriveConf.clientSecret,
    tokenDetails: workDriveConf.tokenDetails,
    team: workDriveConf.team,
    folder,
    teamType: 'teamType' in workDriveConf ? 'private' : 'team',
  }

  bitsFetch(refreshSubFoldersRequestParams, 'bitforms_zworkdrive_refresh_sub_folders')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...workDriveConf }
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
        setWorkDriveConf({ ...newConf })
      } else {
        setSnackbar({ show: true, msg: __('Sub Folders refresh failed. please try again', 'bitform') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const refreshUsers = (formID, workDriveConf, setWorkDriveConf, setisLoading, setSnackbar) => {
  setisLoading(true)
  const refreshUsersRequestParams = {
    formID,
    id: workDriveConf.id,
    dataCenter: workDriveConf.dataCenter,
    clientId: workDriveConf.clientId,
    clientSecret: workDriveConf.clientSecret,
    tokenDetails: workDriveConf.tokenDetails,
    team: workDriveConf.team,
  }
  bitsFetch(refreshUsersRequestParams, 'bitforms_zworkdrive_refresh_users')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...workDriveConf }
        if (!newConf.default.users) {
          newConf.default.users = {}
        }
        if (result.data.users) {
          newConf.default.users[workDriveConf.team] = result.data.users
        }
        if (result.data.tokenDetails) newConf.tokenDetails = result.data.tokenDetails
        setSnackbar({ show: true, msg: __('Users refreshed', 'bitform') })
        setWorkDriveConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: sprintf(__('Users refresh failed Cause: %s. please try again', 'bitform'), result.data.data || result.data) })
      } else {
        setSnackbar({ show: true, msg: __('Users refresh failed. please try again', 'bitform') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

