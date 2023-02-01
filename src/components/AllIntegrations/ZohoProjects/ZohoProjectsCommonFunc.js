import { sprintf, __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'

const clearLowerEvents = (projectsConf, name) => {
  const newConf = { ...projectsConf }
  const eventIdSeq = ['projectId', 'milestoneId', 'tasklistFlag', 'tasklistId', 'taskId']
  eventIdSeq.splice(eventIdSeq.indexOf(name) + 1)

    .map(event => {
      if (newConf?.[event]) { newConf[event] = '' }
      newConf.actions[event.split('Id')[0]] = {}
    })

  return { ...newConf }
}

export const regenerateMappedField = (formID, projectsConf, setProjectsConf, setisLoading, setSnackbar) => {
  const newConf = { ...projectsConf }
  newConf.subEvent.map(event => {
    if ((newConf?.projectId && !newConf?.default?.fields?.[newConf.portalId]?.[newConf.projectId]?.[event]) || !newConf?.default?.fields?.[newConf.portalId]?.[event]) {
      refreshFields(formID, newConf, setProjectsConf, setisLoading, setSnackbar, event)
    } else newConf.field_map[event] = generateMappedField(newConf, event)
  })
  return { ...newConf }
}

export const handleInput = (e, projectsConf, setProjectsConf, formID, setisLoading, setSnackbar, isNew, error, setError) => {
  let newConf = { ...projectsConf }
  const inputName = e.target.name
  const inputValue = e.target.value
  if (isNew) {
    const rmError = { ...error }
    rmError[inputName] = ''
    setError({ ...rmError })
  }
  newConf[inputName] = inputValue

  switch (inputName) {
    case 'portalId':
      newConf = portalChange(newConf, formID, setProjectsConf, setisLoading, setSnackbar)
      break
    case 'event':
      newConf.subEvent = [inputValue]
      newConf.field_map = {}
      newConf.actions[inputValue] = {}
      newConf = eventChange(clearLowerEvents(newConf), formID, setProjectsConf, setisLoading, setSnackbar)

      break
    case 'projectId':
    case 'milestoneId':
    case 'tasklistId':
    case 'taskId': {
      // clear lower event value
      newConf = clearLowerEvents(newConf, inputName)
      // close create new event
      const subEvent = inputName.split('Id')[0]
      newConf.actions[subEvent] = {}
      newConf.actions[newConf.event] = {}
      if (newConf.subEvent.includes(subEvent)) newConf.subEvent.splice(newConf.subEvent.indexOf(subEvent), 1)

      if (!['project', 'milestone'].includes(newConf.event) && subEvent === 'project' && !projectsConf?.default?.milestones?.[newConf.portalId]) {
        refreshMilestones(formID, newConf, setProjectsConf, setisLoading, setSnackbar)
      }
      if (newConf.event === 'subtask' && subEvent !== 'task') {
        refreshTasks(formID, newConf, setProjectsConf, setisLoading, setSnackbar)
      }
      newConf = regenerateMappedField(formID, newConf, setProjectsConf, setisLoading, setSnackbar)
    }
      break
    case 'tasklistFlag':
      newConf.tasklistId = ''
      if (inputValue && newConf.subEvent.includes('tasklist')) newConf.subEvent.splice(newConf.subEvent.indexOf('tasklist'), 1)
      if (inputValue && ['task', 'subtask'].includes(newConf.event) && !projectsConf?.default?.milestones?.[newConf.portalId]?.[inputValue]) {
        refreshTasklists(formID, newConf, setProjectsConf, setisLoading, setSnackbar)
      }
      break
    default:
      break
  }

  setProjectsConf({ ...newConf })
}

export const portalChange = (projectsConf, formID, setProjectsConf, setisLoading, setSnackbar) => {
  const newConf = { ...projectsConf }
  newConf.event = ''
  newConf.field_map = {}
  newConf.actions = {}
  newConf.subEvent = []

  if (projectsConf?.portalId && !projectsConf.default.tags?.[newConf.portalId]) refreshTags(formID, projectsConf, setProjectsConf, setisLoading, setSnackbar)

  if (projectsConf?.portalId && !projectsConf.default.projects?.[newConf.portalId]) refreshProjects(formID, newConf, setProjectsConf, setisLoading, setSnackbar)

  return newConf
}

export const eventChange = (projectsConf, formID, setProjectsConf, setisLoading, setSnackbar) => {
  const newConf = { ...projectsConf }
  newConf.field_map = {}
  newConf.field_map[newConf.event] = [{ formField: '', zohoFormField: '' }]

  if (newConf?.event) {
    if (!newConf?.default?.fields?.[newConf.portalId]?.[newConf.event]) {
      refreshFields(formID, newConf, setProjectsConf, setisLoading, setSnackbar)
    } else {
      newConf.field_map[newConf.event] = generateMappedField(newConf)
    }
  }

  return newConf
}

export const refreshPortals = (formID, projectsConf, setProjectsConf, setisLoading, setSnackbar) => {
  setisLoading(true)
  const refreshPortalsRequestParams = {
    formID,
    id: projectsConf.id,
    dataCenter: projectsConf.dataCenter,
    clientId: projectsConf.clientId,
    clientSecret: projectsConf.clientSecret,
    tokenDetails: projectsConf.tokenDetails,
  }
  bitsFetch(refreshPortalsRequestParams, 'bitforms_zprojects_refresh_portals')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...projectsConf }
        if (result.data.portals) {
          if (Object.keys(result.data.portals).length > 0) {
            newConf.default = { ...newConf.default, portals: result.data.portals }
            setSnackbar({ show: true, msg: __('Portals refreshed', 'bitform') })
          } else setSnackbar({ show: true, msg: __('No Portal Found', 'bitform') })
        }
        if (result.data.tokenDetails) newConf.tokenDetails = result.data.tokenDetails
        setSnackbar({ show: true, msg: __('Portals refreshed', 'bitform') })
        setProjectsConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: sprintf(__('Portals refresh failed Cause: %s. please try again', 'bitform'), result.data.data || result.data) })
      } else {
        setSnackbar({ show: true, msg: __('Portals refresh failed. please try again', 'bitform') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const refreshProjects = (formID, projectsConf, setProjectsConf, setisLoading, setSnackbar) => {
  const { id, portalId } = projectsConf
  setisLoading(true)
  const refreshProjectsRequestParams = {
    formID,
    id,
    dataCenter: projectsConf.dataCenter,
    clientId: projectsConf.clientId,
    clientSecret: projectsConf.clientSecret,
    tokenDetails: projectsConf.tokenDetails,
    portalId,
  }
  bitsFetch(refreshProjectsRequestParams, 'bitforms_zprojects_refresh_projects')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...projectsConf }
        if (!newConf.default.projects) newConf.default.projects = {}
        if (result.data.projects) {
          if (Object.keys(result.data.projects).length > 0) {
            newConf.default.projects[portalId] = result.data.projects
            setSnackbar({ show: true, msg: __('Projects refreshed', 'bitform') })
          } else setSnackbar({ show: true, msg: __('No Project Found', 'bitform') })
        }
        if (result.data.tokenDetails) newConf.tokenDetails = result.data.tokenDetails

        setProjectsConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: sprintf(__('Projects refresh failed Cause: %s. please try again', 'bitform'), result.data.data || result.data) })
      } else {
        setSnackbar({ show: true, msg: __('Projects refresh failed. please try again', 'bitform') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const refreshMilestones = (formID, projectsConf, setProjectsConf, setisLoading, setSnackbar) => {
  const { id, portalId, projectId } = projectsConf
  setisLoading(true)
  const refreshMilestonesRequestParams = {
    formID,
    id,
    dataCenter: projectsConf.dataCenter,
    clientId: projectsConf.clientId,
    clientSecret: projectsConf.clientSecret,
    tokenDetails: projectsConf.tokenDetails,
    portalId,
    projectId,
  }
  bitsFetch(refreshMilestonesRequestParams, 'bitforms_zprojects_refresh_milestones')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...projectsConf }
        if (result.data.milestones) {
          if (!newConf.default.milestones) newConf.default.milestones = {}
          if (Object.keys(result.data.milestones).length > 0) {
            newConf.default.milestones[projectId] = result.data.milestones
            setSnackbar({ show: true, msg: __('Milestones refreshed', 'bitform') })
          } else setSnackbar({ show: true, msg: __('No Milestone Found', 'bitform') })
        }
        if (result.data.tokenDetails) newConf.tokenDetails = result.data.tokenDetails

        setProjectsConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: sprintf(__('Milestones refresh failed Cause: %s. please try again', 'bitform'), result.data.data || result.data) })
      } else {
        setSnackbar({ show: true, msg: __('Milestones refresh failed. please try again', 'bitform') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const refreshTasklists = (formID, projectsConf, setProjectsConf, setisLoading, setSnackbar) => {
  const { id, portalId, projectId, tasklistFlag } = projectsConf
  setisLoading(true)
  const refreshTasklistsRequestParams = {
    formID,
    id,
    dataCenter: projectsConf.dataCenter,
    clientId: projectsConf.clientId,
    clientSecret: projectsConf.clientSecret,
    tokenDetails: projectsConf.tokenDetails,
    portalId,
    projectId,
    tasklistFlag,
  }
  if (projectsConf?.milestoneId) refreshTasklistsRequestParams.milestoneId = projectsConf.milestoneId
  bitsFetch(refreshTasklistsRequestParams, 'bitforms_zprojects_refresh_tasklists')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...projectsConf }
        if (Object.keys(result.data.tasklists).length > 0) {
          if (!newConf.default.tasklists) newConf.default.tasklists = {}
          if (!newConf.default.tasklists[portalId]) newConf.default.tasklists[portalId] = {}
          if (projectsConf?.milestoneId) {
            if (!newConf.default.tasklists[portalId][projectsConf.milestoneId]) newConf.default.tasklists[portalId][projectsConf.milestoneId] = {}
            newConf.default.tasklists[portalId][projectsConf.milestoneId][tasklistFlag] = result.data.tasklists
          } else {
            newConf.default.tasklists[portalId][tasklistFlag] = result.data.tasklists
          }
          setSnackbar({ show: true, msg: __('Tasklists refreshed', 'bitform') })
        } else {
          setSnackbar({ show: true, msg: __('No Tasklist Found', 'bitform') })
        }
        if (result.data.tokenDetails) newConf.tokenDetails = result.data.tokenDetails

        setProjectsConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: sprintf(__('Tasklists refresh failed Cause: %s. please try again', 'bitform'), result.data.data || result.data) })
      } else {
        setSnackbar({ show: true, msg: __('Tasklists refresh failed. please try again', 'bitform') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const refreshTasks = (formID, projectsConf, setProjectsConf, setisLoading, setSnackbar) => {
  const { id, portalId, projectId } = projectsConf
  setisLoading(true)
  const refreshTasksRequestParams = {
    formID,
    id,
    dataCenter: projectsConf.dataCenter,
    clientId: projectsConf.clientId,
    clientSecret: projectsConf.clientSecret,
    tokenDetails: projectsConf.tokenDetails,
    portalId,
    projectId,
  }
  if (projectsConf?.milestoneId) refreshTasksRequestParams.milestoneId = projectsConf.milestoneId
  if (projectsConf?.tasklistId) refreshTasksRequestParams.tasklistId = projectsConf.tasklistId

  bitsFetch(refreshTasksRequestParams, 'bitforms_zprojects_refresh_tasks')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...projectsConf }
        if (Object.keys(result.data.tasks).length > 0) {
          if (!newConf.default.tasks) newConf.default.tasks = {}
          if (!newConf.default.tasks[portalId]) newConf.default.tasks[portalId] = {}
          if (projectsConf?.milestoneId) {
            if (projectsConf?.tasklistId) {
              if (!newConf.default.tasks[portalId][projectsConf?.milestoneId]) newConf.default.tasks[portalId][projectsConf?.milestoneId] = {}
              newConf.default.tasks[portalId][projectsConf?.milestoneId][projectsConf?.tasklistId] = result.data.tasks
            } else {
              newConf.default.tasks[portalId][projectsConf?.milestoneId] = result.data.tasks
            }
          } else if (projectsConf?.tasklistId) newConf.default.tasks[portalId][projectsConf?.tasklistId] = result.data.tasks
          else newConf.default.tasks[portalId] = result.data.tasks
          setSnackbar({ show: true, msg: __('Tasks refreshed', 'bitform') })
        } else {
          setSnackbar({ show: true, msg: __('No Task Found', 'bitform') })
        }
        if (result.data.tokenDetails) newConf.tokenDetails = result.data.tokenDetails
        setProjectsConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: sprintf(__('Tasks refresh failed Cause: %s. please try again', 'bitform'), result.data.data || result.data) })
      } else {
        setSnackbar({ show: true, msg: __('Tasks refresh failed. please try again', 'bitform') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const refreshFields = (formID, projectsConf, setProjectsConf, setisLoading, setSnackbar, eve) => {
  let event
  if (!eve) { event = projectsConf.event } else { event = eve }
  const { portalId } = projectsConf
  setisLoading(true)
  const refreshFieldsRequestParams = {
    formID,
    dataCenter: projectsConf.dataCenter,
    clientId: projectsConf.clientId,
    clientSecret: projectsConf.clientSecret,
    tokenDetails: projectsConf.tokenDetails,
    portalId,
    event,
  }
  if (projectsConf?.projectId) refreshFieldsRequestParams.projectId = projectsConf.projectId
  bitsFetch(refreshFieldsRequestParams, 'bitforms_zprojects_refresh_fields')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...projectsConf }
        if (result.data.fields) {
          if (!newConf.default.fields) {
            newConf.default.fields = {}
          }
          if (!newConf.default.fields[portalId]) newConf.default.fields[portalId] = {}
          if (projectsConf?.projectId) {
            if (!newConf.default.fields[portalId][projectsConf.projectId]) newConf.default.fields[portalId][projectsConf.projectId] = {}
            newConf.default.fields[portalId][newConf.projectId][event] = { ...result.data }
          } else {
            newConf.default.fields[portalId][event] = { ...result.data }
          }

          newConf.field_map[event] = generateMappedField(newConf, event)
          setSnackbar({ show: true, msg: __('Fields refreshed', 'bitform') })
        } else {
          setSnackbar({ show: true, msg: sprintf(__('Fields refresh failed Cause: %s. please try again', 'bitform'), result.data.data || result.data) })
        }

        if (result.data.tokenDetails) {
          newConf.tokenDetails = result.data.tokenDetails
        }
        setProjectsConf({ ...newConf })
      } else {
        setSnackbar({ show: true, msg: __('Fields refresh failed. please try again', 'bitform') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const refreshUsers = (formID, projectsConf, setProjectsConf, setisLoading, setSnackbar) => {
  const { id, portalId } = projectsConf
  setisLoading(true)
  const refreshOwnersRequestParams = {
    formID,
    id,
    dataCenter: projectsConf.dataCenter,
    clientId: projectsConf.clientId,
    clientSecret: projectsConf.clientSecret,
    tokenDetails: projectsConf.tokenDetails,
    portalId: projectsConf.portalId,
  }
  if (projectsConf?.projectId) refreshOwnersRequestParams.projectId = projectsConf.projectId
  bitsFetch(refreshOwnersRequestParams, 'bitforms_zprojects_refresh_users')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...projectsConf }
        if (!newConf.default.users) {
          newConf.default.users = {}
        }
        if (result.data.users) {
          if (Object.keys(result.data.users).length > 0) {
            if (projectsConf?.projectId) {
              if (!newConf.default.users[portalId]) newConf.default.users[portalId] = {}
              newConf.default.users[portalId][projectsConf.projectId] = result.data.users
            } else newConf.default.users[portalId] = result.data.users
            setSnackbar({ show: true, msg: __('Owners refreshed', 'bitform') })
          } else setSnackbar({ show: true, msg: __('No Owner Found', 'bitform') })
        }
        if (result.data.tokenDetails) newConf.tokenDetails = result.data.tokenDetails
        setProjectsConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: sprintf(__('Owners refresh failed Cause: %s. please try again', 'bitform'), result.data.data || result.data) })
      } else {
        setSnackbar({ show: true, msg: __('Owners refresh failed. please try again', 'bitform') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const refreshTaskLays = (formID, projectsConf, setProjectsConf, setisLoading, setSnackbar) => {
  const { id, portalId } = projectsConf
  setisLoading(true)
  const refreshOwnersRequestParams = {
    formID,
    id,
    dataCenter: projectsConf.dataCenter,
    clientId: projectsConf.clientId,
    clientSecret: projectsConf.clientSecret,
    tokenDetails: projectsConf.tokenDetails,
    portalId,
  }
  bitsFetch(refreshOwnersRequestParams, 'bitforms_zprojects_refresh_task_layouts')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...projectsConf }
        if (!newConf.default.taskLays) {
          newConf.default.taskLays = {}
        }
        if (result.data.taskLays) {
          if (Object.keys(result.data.taskLays).length > 0) {
            newConf.default.taskLays[portalId] = result.data.taskLays
            setSnackbar({ show: true, msg: __('Task Layouts refreshed', 'bitform') })
          } else setSnackbar({ show: true, msg: __('No Task Layout Found', 'bitform') })
        }
        if (result.data.tokenDetails) newConf.tokenDetails = result.data.tokenDetails
        setProjectsConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: sprintf(__('Task Layouts refresh failed Cause: %s. please try again', 'bitform'), result.data.data || result.data) })
      } else {
        setSnackbar({ show: true, msg: __('Task Layouts refresh failed. please try again', 'bitform') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const refreshGroups = (formID, projectsConf, setProjectsConf, setisLoading, setSnackbar) => {
  const { id, portalId } = projectsConf
  setisLoading(true)
  const refreshOwnersRequestParams = {
    formID,
    id,
    dataCenter: projectsConf.dataCenter,
    clientId: projectsConf.clientId,
    clientSecret: projectsConf.clientSecret,
    tokenDetails: projectsConf.tokenDetails,
    portalId,
  }
  bitsFetch(refreshOwnersRequestParams, 'bitforms_zprojects_refresh_groups')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...projectsConf }
        if (!newConf.default.groups) {
          newConf.default.groups = {}
        }
        if (result.data.groups) {
          if (Object.keys(result.data.groups).length > 0) {
            newConf.default.groups[portalId] = result.data.groups
            setSnackbar({ show: true, msg: __('Project Groups refreshed', 'bitform') })
          } else setSnackbar({ show: true, msg: __('No Project Group Found', 'bitform') })
        }
        if (result.data.tokenDetails) newConf.tokenDetails = result.data.tokenDetails
        setProjectsConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: sprintf(__('Project Groups refresh failed Cause: %s. please try again', 'bitform'), result.data.data || result.data) })
      } else {
        setSnackbar({ show: true, msg: __('Project Groups refresh failed. please try again', 'bitform') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const refreshTags = (formID, projectsConf, setProjectsConf, setisLoading, setSnackbar) => {
  const { id, portalId } = projectsConf
  setisLoading(true)
  const refreshProductsRequestParams = {
    formID,
    id,
    dataCenter: projectsConf.dataCenter,
    clientId: projectsConf.clientId,
    clientSecret: projectsConf.clientSecret,
    tokenDetails: projectsConf.tokenDetails,
    portalId,
  }
  bitsFetch(refreshProductsRequestParams, 'bitforms_zprojects_refresh_tags')
    .then(result => {
      if (result && result.success) {
        const newConf = { ...projectsConf }
        if (!newConf.default.tags) {
          newConf.default.tags = {}
        }
        if (result.data.tags) {
          if (Object.keys(result.data.tags).length > 0) {
            newConf.default.tags[portalId] = result.data.tags
            setSnackbar({ show: true, msg: __('Tags refreshed', 'bitform') })
          } else setSnackbar({ show: true, msg: __('No Tag Found', 'bitform') })
        }
        if (result.data.tokenDetails) newConf.tokenDetails = result.data.tokenDetails
        setProjectsConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: sprintf(__('Tags refresh failed Cause: %s. please try again', 'bitform'), result.data.data || result.data) })
      } else {
        setSnackbar({ show: true, msg: __('Tags refresh failed. please try again', 'bitform') })
      }
      setisLoading(false)
    })
    .catch(() => setisLoading(false))
}

export const generateMappedField = (projectsConf, eve) => {
  let event
  if (!eve) { event = projectsConf.event } else { event = eve }

  if (projectsConf?.projectId) {
    return (projectsConf.default.fields[projectsConf.portalId][projectsConf.projectId][event].required.length > 0 ? projectsConf.default.fields[projectsConf.portalId][projectsConf.projectId][event].required?.map(field => ({ formField: '', zohoFormField: field })) : [{ formField: '', zohoFormField: '' }])
  }
  return (projectsConf.default.fields[projectsConf.portalId][event].required.length > 0 ? projectsConf.default.fields[projectsConf.portalId][event].required?.map(field => ({ formField: '', zohoFormField: field })) : [{ formField: '', zohoFormField: '' }])
}

export const checkMappedFields = projectsConf => {
  let allOk = true
  if (projectsConf?.subEvent) {
    projectsConf.subEvent.map(event => {
      let mappedFields = []
      if (projectsConf?.projectId) {
        mappedFields = projectsConf?.field_map?.[event] ? projectsConf.field_map[event].filter(mappedField => (!mappedField.formField && mappedField.zohoFormField && projectsConf?.default?.fields?.[projectsConf.portalId]?.[projectsConf.projectId]?.[event]?.required.indexOf(mappedField.zohoFormField) !== -1)) : []
      } else {
        mappedFields = projectsConf?.field_map?.[event] ? projectsConf.field_map[event].filter(mappedField => (!mappedField.formField && mappedField.zohoFormField && projectsConf?.default?.fields?.[projectsConf.portalId]?.[event]?.required.indexOf(mappedField.zohoFormField) !== -1)) : []
      }

      if (mappedFields.length > 0) {
        allOk = false
      }
    })
  }
  if (allOk) return true
  return false
}

export const checkRequiredActions = projectsConf => {
  let allOk = true
  const required = {
    project: ['owner', 'tasklayoutid'],
    milestone: ['owner', 'flag'],
    tasklist: ['flag'],
    task: ['owner'],
    subtask: ['owner'],
    issue: ['owner', 'flag'],
  }
  if (projectsConf?.subEvent) {
    projectsConf.subEvent.map(event => {
      required[event].map(act => {
        if (!projectsConf.actions[event][act]) allOk = false
      })
    })
  }

  if (allOk) return true
  return false
}

export const checkAllRequired = (projectsConf, setSnackbar) => {
  if (!checkMappedFields(projectsConf)) {
    setSnackbar({ show: true, msg: __('please map mandatory fields', 'bitform') })
    return false
  }
  if (!checkRequiredActions(projectsConf)) {
    setSnackbar({ show: true, msg: __('please fill up the required actions', 'bitform') })
    return false
  }
  if (projectsConf?.event === 'subtask' && !(projectsConf?.taskId || projectsConf.subEvent.includes('task'))) {
    setSnackbar({ show: true, msg: __('to create a subtask you must select a task or create a new task', 'bitform') })
    return false
  }
  if (['task', 'subtask'].includes(projectsConf?.event)) {
    if ((projectsConf?.milestoneId || projectsConf.subEvent.includes('milestone')) && !(projectsConf?.tasklistId || projectsConf.subEvent.includes('tasklist'))) {
      setSnackbar({ show: true, msg: sprintf(__('to create a %s under milestone you must select a tasklist or create a new tasklist', 'bitform'), projectsConf.event) })
      return false
    }
  }
  return true
}
