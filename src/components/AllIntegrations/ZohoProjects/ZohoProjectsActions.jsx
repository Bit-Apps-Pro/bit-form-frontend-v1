/* eslint-disable no-param-reassign */
import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'

import { sprintf, __ } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import CheckBox from '../../Utilities/CheckBox'
import Loader from '../../Loaders/Loader'
import { refreshUsers, refreshTaskLays, refreshTags, refreshGroups } from './ZohoProjectsCommonFunc'
import TrashIcn from '../../../Icons/TrashIcn'

export default function ZohoProjectsActions({ event, projectsConf, setProjectsConf, formID, formFields, setSnackbar }) {
  const [isLoading, setisLoading] = useState(false)
  const [actionMdl, setActionMdl] = useState({ show: false })

  const actionHandler = (val, typ, checked) => {
    const newConf = { ...projectsConf }
    if (checked !== undefined) {
      if (checked) newConf.actions[event][typ] = val
      else delete newConf.actions[event][typ]
    } else if (val) newConf.actions[event][typ] = val
    else delete newConf.actions[event][typ]
    setProjectsConf({ ...newConf })
  }

  const handleCustomTag = (typ, i, act, val) => {
    const newConf = { ...projectsConf }

    if (!newConf.actions[event]?.customTags) newConf.actions[event].customTags = []

    if (typ === 'add') {
      newConf.actions[event].customTags.push({ name: '', color: '' })
    } else if (typ === 'remove') {
      newConf.actions[event].customTags.splice(i, 1)
    } else if (typ === 'value') {
      if (act === 'field') {
        newConf.actions[event].customTags[i].name += val
      } else newConf.actions[event].customTags[i][act] = val
    }

    if (!newConf.actions[event].customTags.length) {
      delete newConf.actions[event].customTags
    }

    setProjectsConf({ ...newConf })
  }

  const handleProjectUser = (typ, i, act, val) => {
    const newConf = { ...projectsConf }

    if (!newConf.actions.project?.users) newConf.actions.project.users = []

    if (typ === 'add') {
      newConf.actions.project.users.push({ name: '', role: '' })
    } else if (typ === 'remove') {
      newConf.actions.project.users.splice(i, 1)
    } else if (typ === 'value') {
      newConf.actions.project.users[i][act] = val
    }

    setProjectsConf({ ...newConf })
  }

  const handleReminder = (val, typ) => {
    const newConf = { ...projectsConf }

    if (!newConf.actions[event].reminder_string || typ === 'reminder_criteria') newConf.actions[event].reminder_string = {}

    if (val !== '') newConf.actions[event].reminder_string[typ] = val
    else delete newConf.actions[event].reminder_string[typ]

    if (['custom_date_fld', 'reminder_time_fld'].includes(typ)) {
      delete newConf.actions[event].reminder_string[typ.replace('_fld', '')]
    } else if (['custom_date', 'reminder_time'].includes(typ)) {
      delete newConf.actions[event].reminder_string[`${typ}_fld`]
    }

    setProjectsConf({ ...newConf })
  }

  const handleRecurrence = (val, typ, checked) => {
    const newConf = { ...projectsConf }

    if (!newConf.actions[event].recurrence_string || typ === 'recurring_frequency') newConf.actions[event].recurrence_string = {}

    if (checked !== undefined) {
      if (checked) newConf.actions[event].recurrence_string[typ] = val
      else delete newConf.actions[event].recurrence_string[typ]
    } else if (val) newConf.actions[event].recurrence_string[typ] = val
    else delete newConf.actions[event].recurrence_string[typ]

    if (['time_span_fld', 'number_of_occurrences_fld'].includes(typ)) {
      delete newConf.actions[event].recurrence_string[typ.replace('_fld', '')]
    } else if (['time_span', 'number_of_occurrences'].includes(typ)) {
      delete newConf.actions[event].recurrence_string[`${typ}_fld`]
    }

    setProjectsConf({ ...newConf })
  }

  const handleTimeLog = (val, typ) => {
    const newConf = { ...projectsConf }

    if (!newConf.actions[event].timelog) newConf.actions[event].timelog = {}

    if (!projectsConf?.actions[event].timelog?.bill_status) {
      projectsConf.actions[event].timelog.bill_status = 'Billable'
    }

    if (val) newConf.actions[event].timelog[typ] = val
    else delete newConf.actions[event].timelog[typ]

    if (['date_fld', 'hours_fld', 'start_time_fld', 'end_time_fld'].includes(typ)) {
      delete newConf.actions[event].timelog[typ.replace('_fld', '')]
    } else if (['date', 'hours', 'start_time', 'end_time'].includes(typ)) {
      delete newConf.actions[event].timelog[`${typ}_fld`]
    }

    if (!newConf.actions[event].timelog.date || !newConf.actions[event].timelog.date_fld) {
      delete newConf.actions[event].timelog
    }

    if (typ === 'settime') {
      delete newConf.actions[event].timelog.hours
      delete newConf.actions[event].timelog.hours_fld
      delete newConf.actions[event].timelog.start_time
      delete newConf.actions[event].timelog.start_time_fld
      delete newConf.actions[event].timelog.end_time
      delete newConf.actions[event].timelog.end_time_fld
    }

    setProjectsConf({ ...newConf })
  }

  const openUsersModal = (attr) => {
    if ((projectsConf?.projectId && !projectsConf.default?.users?.[projectsConf.portalId]?.[projectsConf.projectId]) || !projectsConf.default?.users?.[projectsConf.portalId]) {
      refreshUsers(formID, projectsConf, setProjectsConf, setisLoading, setSnackbar)
    }
    if (!attr) setActionMdl({ show: 'owner' })
    else setActionMdl({ show: attr })
    if (attr === 'users' && !projectsConf?.actions?.project?.users) {
      projectsConf.actions.project.users = [
        { email: '', role: 'employee' },
        { email: '', role: 'manager' },
        { email: '', role: 'contractor' },
      ]
    }
  }

  const openTaskLayModal = () => {
    if (!projectsConf.default?.taskLays?.[projectsConf.portalId]) {
      refreshTaskLays(formID, projectsConf, setProjectsConf, setisLoading, setSnackbar)
    }
    setActionMdl({ show: 'task_layout' })
  }

  const openGroupModal = () => {
    if (!projectsConf.default?.groups?.[projectsConf.portalId]) {
      refreshGroups(formID, projectsConf, setProjectsConf, setisLoading, setSnackbar)
    }
    setActionMdl({ show: 'group' })
  }

  const getTags = () => {
    const arr = [
      { title: 'Zoho Projects Tags', type: 'group', childs: [] },
    ]

    if (projectsConf.default.tags?.[projectsConf.portalId]) {
      arr[0].childs = Object.values(projectsConf.default.tags?.[projectsConf.portalId]).map(tag => ({ label: tag.tagName, value: tag.tagId }))
    }

    return arr
  }

  const getUsers = (attr) => {
    let allUsers = []
    if (attr === 'taskuser') {
      if (projectsConf?.projectId && projectsConf?.default?.users?.[projectsConf.portalId]?.[projectsConf.projectId]?.length > 0) {
        allUsers = projectsConf?.actions?.[event]?.owner ? projectsConf.actions?.[event].owner.split(',').map(user => projectsConf.default.users[projectsConf.portalId][projectsConf.projectId].filter(usr => usr.userId === user)).map(filteredUser => filteredUser[0]) : []
      } else if (projectsConf?.default?.users?.[projectsConf.portalId]?.length > 0) {
        allUsers = projectsConf?.actions?.[event]?.owner ? projectsConf.actions?.[event].owner.split(',').map(user => projectsConf.default.users[projectsConf.portalId].filter(usr => usr.userId === user)).map(filteredUser => filteredUser[0]) : []
      }
    } else if (projectsConf?.projectId && projectsConf?.default?.users?.[projectsConf.portalId]?.[projectsConf.projectId]?.length > 0) {
      allUsers = projectsConf.default.users[projectsConf.portalId][projectsConf.projectId]
    } else if (event !== 'project' && projectsConf?.subEvent.includes('project')) {
      if (projectsConf?.default?.users?.[projectsConf.portalId].length > 0) {
        let owner = ''
        let users = ''
        if (projectsConf.actions.project.owner) owner = projectsConf.default.users[projectsConf.portalId].filter(user => user.userId === projectsConf.actions.project.owner)

        if (projectsConf.actions.project.users) {
          users = projectsConf?.actions?.project?.users?.map(puser => puser.email && puser.email.split(',').map(user => projectsConf.default.users[projectsConf.portalId].filter(usr => usr.userEmail === user)).map(filteredUser => filteredUser[0]))
          const projectUsers = []
          for (let i = 0; i < users.length; i += 1) {
            for (let j = 0; j < users[i].length; j += 1) {
              projectUsers.push(users[i][j])
            }
          }
          users = projectUsers
        }

        if (owner && users) {
          users.push(owner[0])
          allUsers = users
        } else if (owner && !users) {
          allUsers = owner
        } else if (users && !owner) {
          allUsers = users
        }
      }
    } else if (projectsConf?.default?.users?.[projectsConf.portalId].length > 0) {
      if (attr === 'users') {
        allUsers = projectsConf.default.users[projectsConf.portalId].filter(user => user.userId !== projectsConf?.actions?.project?.owner)
      } else allUsers = projectsConf.default.users[projectsConf.portalId]
    }

    return allUsers
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const getRecurrenceFrequency = frequency => {
    if (frequency === 'daily') return '(Day)'
    if (frequency === 'weekly') return '(Week)'
    if (frequency === 'monthly') return '(Month)'
    if (frequency === 'yearly') return '(Year)'
    return ''
  }

  return (
    <div className="pos-rel">
      <div className="d-flx flx-wrp">
        {event !== 'tasklist' && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <TableCheckBox onChange={() => openUsersModal()} checked={'owner' in projectsConf.actions[event]} className="wdt-200 mt-4 mr-2 btcd-ttc" value={`${event}_owner`} title={sprintf(__('%s Owner', 'bitform'), event)} subTitle={sprintf(__('Add an owner to %s  pushed to Zoho Projects.', 'bitform'), event)} />
            {!projectsConf.actions[event].owner && (
              <small style={{ marginLeft: 30, marginTop: 10, color: 'red' }}>
                {`${event} owner is required`}
              </small>
            )}
          </div>
        )}

        {event === 'project' && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <TableCheckBox onChange={openTaskLayModal} checked={'tasklayoutid' in projectsConf.actions.project} className="wdt-200 mt-4 mr-2 btcd-ttc" value="Task_Owner" title={__('Task Layout', 'bitform')} subTitle={__('Add a layout to project pushed to Zoho Projects.', 'bitform')} />
              {!projectsConf.actions.project.tasklayoutid && <small style={{ marginLeft: 30, marginTop: 10, color: 'red' }}>{__('task layout is required', 'bitform')}</small>}
            </div>
            <TableCheckBox onChange={(e) => actionHandler(e.target.value, 'public', e.target.checked)} checked={'public' in projectsConf.actions.project} className="wdt-200 mt-4 mr-2 btcd-ttc" value="yes" title={__('Public Project', 'bitform')} subTitle={__('by default, it is set as private project.', 'bitform')} />
            <TableCheckBox onChange={() => openUsersModal('users')} checked={'users' in projectsConf.actions.project} className="wdt-200 mt-4 mr-2 btcd-ttc" value="Project_User" title={__('Project user', 'bitform')} subTitle={__('Assign users to project pushed to Zoho Projects.', 'bitform')} />
            <TableCheckBox onChange={openGroupModal} checked={'group_id' in projectsConf.actions.project} className="wdt-200 mt-4 mr-2 btcd-ttc" value="Project_Group" title={__('Group Name', 'bitform')} subTitle={__('Add a group to project pushed to Zoho Projects.', 'bitform')} />
          </>
        )}
        {(event === 'milestone' || event === 'tasklist' || event === 'issue') && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <TableCheckBox onChange={() => setActionMdl({ show: 'flag' })} checked={'flag' in projectsConf.actions[event]} className="wdt-200 mt-4 mr-2 btcd-ttc" value={`${event}_flag`} title={sprintf(__('%s Flag', 'bitform'), event)} subTitle={`${__('Add a flag to', 'bitform')} ${event} ${__('pushed to Zoho Projects.', 'bitform')}`} />
              {!projectsConf.actions[event].flag && <small style={{ marginLeft: 30, marginTop: 10, color: 'red' }}>{`${event} ${__('flag is required', 'bitform')}`}</small>}
            </div>
          </>
        )}
        {event === 'issue' && (
          <>
            <TableCheckBox onChange={() => openUsersModal('followers')} checked={'bug_followers' in projectsConf.actions[event]} className="wdt-200 mt-4 mr-2 btcd-ttc" value="Issue_Followers" title={__('Issue Followers', 'bitform')} subTitle={__('Add followers to issue pushed to Zoho Projects', 'bitform')} />
            {projectsConf?.projectId && ['severity', 'classification', 'module', 'priority']
              .map(act => (
                <TableCheckBox
                  key={act}
                  onChange={() => setActionMdl({ show: act })}
                  checked={(act === 'priority' ? 'reproducible_id' : `${act}_id`) in projectsConf.actions[event]}
                  className="wdt-200 mt-4 mr-2 btcd-ttc"
                  value={act}
                  title={sprintf(__('Issue %s', 'bitform'), act)}
                  subTitle={sprintf(__('Add %s to issue pushed to Zoho Projects', 'bitform'), act)}
                />
              ))}
          </>
        )}
        {(event === 'task' || event === 'subtask' || event === 'issue') && (
          <>
            <TableCheckBox onChange={() => setActionMdl({ show: 'attachments' })} checked={'attachments' in projectsConf.actions[event]} className="wdt-200 mt-4 mr-2 btcd-ttc" value={`${event}_attachments`} title={sprintf(__('%s Attachments', 'bitform'), event)} subTitle={sprintf('Add attachments to %s pushed to Zoho Projects.', event)} />
            <TableCheckBox
              onChange={() => setActionMdl({ show: 'timelog' })}
              checked={(projectsConf.actions[event]?.timelog?.date || projectsConf.actions[event]?.timelog?.date_fld) || false}
              className="wdt-200 mt-4 mr-2 btcd-ttc"
              value={`${event}_timelog`}
              title={sprintf(__('%s Time Log', 'bitform'), event)}
              subTitle={sprintf(__('Add time log to %s pushed to Zoho Projects.', 'bitform'), event)}
            />
          </>
        )}
        {event === 'task' && (
          <TableCheckBox
            onChange={() => setActionMdl({ show: 'recurrence_string' })}
            checked={'recurrence_string' in projectsConf.actions[event] && 'recurring_frequency' in projectsConf.actions[event]?.recurrence_string}
            className="wdt-200 mt-4 mr-2 btcd-ttc"
            value={`${event}_reminder`}
            title={sprintf(__('%s Recurrence', 'bitform'), event)}
            subTitle={sprintf(__('Add recurrence to %s pushed to Zoho Projects.', 'bitform'), event)}
          />
        )}
        {(event === 'task' || event === 'subtask' || event === 'issue') && (
          <TableCheckBox
            onChange={() => setActionMdl({ show: 'reminder_string' })}
            checked={'reminder_string' in projectsConf.actions[event] && 'reminder_criteria' in projectsConf.actions[event]?.reminder_string}
            className="wdt-200 mt-4 mr-2 btcd-ttc"
            value={`${event}_reminder`}
            title={sprintf(__('%s Reminder', 'bitform'), event)}
            subTitle={sprintf(__('Add reminder to %s pushed to Zoho Projects.', 'bitform'), event)}
          />
        )}
        <TableCheckBox
          onChange={() => setActionMdl({ show: 'tags' })}
          checked={(projectsConf.actions[event].tags || projectsConf?.actions?.[event]?.customTags) || false}
          className="wdt-200 mt-4 mr-2 btcd-ttc"
          value={`${event}_tags`}
          title={sprintf(__('%s Tags', 'bitform'), event)}
          subTitle={sprintf(__('Add tags to %s pushed to Zoho Projects.', 'bitform'), event)}
        />
      </div>
      {/* Modals */}
      {event !== 'tasklist' && (
        <ConfirmModal
          className="custom-conf-mdl"
          mainMdlCls="o-v btcd-ttc"
          btnClass="blue"
          btnTxt={__('Ok', 'bitform')}
          show={actionMdl.show === 'owner'}
          close={clsActionMdl}
          action={clsActionMdl}
          title={sprintf(__('%s Owner', 'bitform'), event)}
        >
          <div className="btcd-hr mt-2" />
          {isLoading ? (
            <Loader style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 45,
              transform: 'scale(0.5)',
            }}
            />
          )
            : (
              <div className="flx flx-between mt-2">
                {(event === 'task' || event === 'subtask')
                  ? (
                    <MultiSelect
                      defaultValue={projectsConf.actions[event].owner}
                      className="mt-2 w-9"
                      onChange={(val) => actionHandler(val, 'owner')}
                      options={getUsers().map(user => ({ label: user.userName, value: user.userId }))}
                    />
                  )
                  : (
                    <select
                      value={projectsConf.actions[event].owner}
                      className="btcd-paper-inp"
                      onChange={e => actionHandler(e.target.value, 'owner')}
                    >
                      <option value="">{__('Select Owner', 'bitform')}</option>
                      {getUsers().length > 0 && getUsers().map(user => <option key={user.userId} value={user.userId}>{user.userName}</option>)}
                    </select>
                  )}
                <button onClick={() => refreshUsers(formID, projectsConf, setProjectsConf, setisLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Portal Users', 'bitform')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
              </div>
            )}
        </ConfirmModal>
      )}
      {event === 'project' && (
        <>
          <ConfirmModal
            className="custom-conf-mdl"
            mainMdlCls="o-v"
            btnClass="blue"
            btnTxt={__('Ok', 'bitform')}
            show={actionMdl.show === 'task_layout'}
            close={clsActionMdl}
            action={clsActionMdl}
            title={__('Task Layout', 'bitform')}
          >
            <div className="btcd-hr mt-2" />
            {isLoading ? (
              <Loader style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 45,
                transform: 'scale(0.5)',
              }}
              />
            )
              : (
                <div className="flx flx-between mt-2">
                  <select
                    value={projectsConf.actions.project.tasklayoutid}
                    className="btcd-paper-inp"
                    onChange={e => actionHandler(e.target.value, 'tasklayoutid')}
                  >
                    <option value="">{__('Select Layout', 'bitform')}</option>
                    {projectsConf.default?.taskLays?.[projectsConf.portalId]?.map(taskLay => <option key={taskLay.taskLayId} value={taskLay.taskLayId}>{taskLay.taskLayName}</option>)}
                  </select>
                  <button onClick={() => refreshTaskLays(formID, projectsConf, setProjectsConf, setisLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Task Layouts', 'bitform')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
                </div>
              )}
          </ConfirmModal>
          <ConfirmModal
            className="custom-conf-mdl"
            mainMdlCls="o-v"
            btnClass="blue"
            btnTxt={__('Ok', 'bitform')}
            show={actionMdl.show === 'users'}
            close={clsActionMdl}
            action={clsActionMdl}
            title={__('Assign Project Users', 'bitform')}
          >
            <div className="btcd-hr mt-2" />
            {
              isLoading ? (
                <Loader style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 45,
                  transform: 'scale(0.5)',
                }}
                />
              )
                : (
                  <>
                    {projectsConf.actions.project?.users && projectsConf.actions.project.users.map((user, i) => (
                      <div key={`us-${i + 10}`} className="flx flx-between mt-1">
                        <MultiSelect
                          className="btcd-paper-drpdwn mt-2"
                          defaultValue={user.email}
                          options={getUsers('users').map(usr => ({ label: usr.userName, value: usr.userEmail }))}
                          onChange={e => handleProjectUser('value', i, 'email', e)}
                        />
                        <input type="text" value={user.role} readOnly className="btcd-paper-inp mt-2 w-3 ml-1" />
                      </div>
                    ))}
                  </>
                )
            }
          </ConfirmModal>
          <ConfirmModal
            className="custom-conf-mdl"
            mainMdlCls="o-v"
            btnClass="blue"
            btnTxt={__('Ok', 'bitform')}
            show={actionMdl.show === 'group'}
            close={clsActionMdl}
            action={clsActionMdl}
            title={__('Project Group', 'bitform')}
          >
            <div className="btcd-hr mt-2" />
            {isLoading ? (
              <Loader style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 45,
                transform: 'scale(0.5)',
              }}
              />
            )
              : (
                <div className="flx flx-between mt-2">
                  <select
                    value={projectsConf.actions.project.group_id}
                    className="btcd-paper-inp"
                    onChange={e => actionHandler(e.target.value, 'group_id')}
                  >
                    <option value="">{__('Select Group', 'bitform')}</option>
                    {projectsConf.default?.groups?.[projectsConf.portalId]?.map(group => <option key={group.groupId} value={group.groupId}>{group.groupName}</option>)}
                  </select>
                  <button onClick={() => refreshGroups(formID, projectsConf, setProjectsConf, setisLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Project Groups', 'bitform')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
                </div>
              )}
          </ConfirmModal>
        </>
      )}
      {
        (event === 'tasklist' || event === 'milestone' || event === 'issue') && (
          <ConfirmModal
            className="custom-conf-mdl"
            mainMdlCls="o-v btcd-ttc"
            btnClass="blue"
            btnTxt={__('Ok', 'bitform')}
            show={actionMdl.show === 'flag'}
            close={clsActionMdl}
            action={clsActionMdl}
            title={sprintf(__('%s Flag', 'bitform'), event)}
          >
            <div className="btcd-hr mt-2" />
            <div className="flx flx-between mt-2">
              <select
                value={projectsConf.actions[event].flag}
                className="btcd-paper-inp"
                onChange={e => actionHandler(e.target.value, 'flag')}
              >
                <option value="">{__('Select Flag', 'bitform')}</option>
                <option value={event === 'issue' ? 'Internal' : 'internal'}>{__('Internal', 'bitform')}</option>
                <option value={event === 'issue' ? 'External' : 'external'}>{__('External', 'bitform')}</option>
              </select>
            </div>
          </ConfirmModal>
        )
      }
      {
        (event === 'task' || event === 'subtask' || event === 'issue') && (
          <>
            <ConfirmModal
              className="custom-conf-mdl"
              mainMdlCls="o-v"
              btnClass="blue"
              btnTxt={__('Ok', 'bitform')}
              show={actionMdl.show === 'attachments'}
              close={clsActionMdl}
              action={clsActionMdl}
              title={__('Select Attachment', 'bitform')}
            >
              <div className="btcd-hr mt-2" />
              <div className="mt-2">{__('Select file upload fields', 'bitform')}</div>
              <MultiSelect
                defaultValue={projectsConf.actions[event].attachments}
                className="mt-2 w-9"
                onChange={(val) => actionHandler(val, 'attachments')}
                options={formFields.filter(itm => (itm.type === 'file-up')).map(itm => ({ label: itm.name, value: itm.key }))}
              />
            </ConfirmModal>
            <ConfirmModal
              className="custom-conf-mdl"
              mainMdlCls="o-v btcd-ttc"
              btnClass="blue"
              btnTxt={__('Ok', 'bitform')}
              show={actionMdl.show === 'timelog'}
              close={clsActionMdl}
              action={clsActionMdl}
              title={sprintf(__('%s Time Log', 'bitform'), event)}
            >
              <div className="btcd-hr mt-2" />
              <div className="mt-2 mb-1">{__('Select Date', 'bitform')}</div>
              <div className="flx">
                <input type="date" className="btcd-paper-inp" onChange={(e) => handleTimeLog(e.target.value, 'date')} value={projectsConf.actions[event]?.timelog?.date || ''} style={{ height: 40 }} max={new Date().toISOString().split('T')[0]} />
                <select className="btcd-paper-inp" onChange={(e) => handleTimeLog(e.target.value, 'date_fld')} value={projectsConf.actions[event]?.timelog?.date_fld || ''}>
                  <option value="">{__('Field', 'bitform')}</option>
                  {formFields.map(f => f.type === 'date' && <option key={`ff-zhcrm-${f.key}`} value={`\${${f.key}}`}>{f.name}</option>)}
                </select>
              </div>
              <div className="mt-2 mb-1">{__('Billing Status', 'bitform')}</div>
              <select className="btcd-paper-inp" onChange={(e) => handleTimeLog(e.target.value, 'bill_status')} value={projectsConf.actions[event]?.timelog?.bill_status || ''}>
                <option value="Billable">{__('Billable', 'bitform')}</option>
                <option value="Non Billable">{__('Non Billable', 'bitform')}</option>
              </select>
              {!projectsConf?.actions[event]?.timelog?.settime && (
                <>
                  <div className="mt-2 mb-1">{__('Enter Hours', 'bitform')}</div>
                  <div className="flx mb-2">
                    <input type="number" className="btcd-paper-inp" onChange={(e) => handleTimeLog(e.target.value, 'hours')} value={projectsConf.actions[event]?.timelog?.hours || ''} />
                    <select className="btcd-paper-inp" onChange={(e) => handleTimeLog(e.target.value, 'hours_fld')} value={projectsConf.actions[event]?.timelog?.hours_fld || ''}>
                      <option value="">{__('Field', 'bitform')}</option>
                      {formFields.map(f => f.type !== 'file-up' && <option key={`ff-zhcrm-${f.key}`} value={`\${${f.key}}`}>{f.name}</option>)}
                    </select>
                  </div>
                  <span
                    className="btcd-link cp"
                    onClick={() => handleTimeLog(true, 'settime')}
                    onKeyDown={() => handleTimeLog(true, 'settime')}
                    role="button"
                    tabIndex="0"
                  >
                    {__('set start & end time', 'bitform')}
                  </span>
                </>
              )}
              {projectsConf?.actions[event]?.timelog?.settime && (
                <>
                  <div className="mt-2 mb-1">{__('Start Time', 'bitform')}</div>
                  <div className="flx">
                    <input type="time" className="btcd-paper-inp" onChange={(e) => handleTimeLog(e.target.value, 'start_time')} value={projectsConf.actions[event]?.timelog?.start_time || ''} style={{ height: 40 }} />
                    <select className="btcd-paper-inp" onChange={(e) => handleTimeLog(e.target.value, 'start_time_fld')} value={projectsConf.actions[event]?.timelog?.start_time_fld || ''}>
                      <option value="">{__('Field', 'bitform')}</option>
                      {formFields.map(f => f.type === 'time' && <option key={`ff-zhcrm-${f.key}`} value={`\${${f.key}}`}>{f.name}</option>)}
                    </select>
                  </div>
                  <div className="mt-2 mb-1">{__('End Time', 'bitform')}</div>
                  <div className="flx mb-2">
                    <input type="time" className="btcd-paper-inp" onChange={(e) => handleTimeLog(e.target.value, 'end_time')} value={projectsConf.actions[event]?.timelog?.end_time || ''} style={{ height: 40 }} />
                    <select className="btcd-paper-inp" onChange={(e) => handleTimeLog(e.target.value, 'end_time_fld')} value={projectsConf.actions[event]?.timelog?.end_time_fld || ''}>
                      <option value="">{__('Field', 'bitform')}</option>
                      {formFields.map(f => f.type === 'time' && <option key={`ff-zhcrm-${f.key}`} value={`\${${f.key}}`}>{f.name}</option>)}
                    </select>
                  </div>
                  <span
                    className="btcd-link cp"
                    onClick={() => handleTimeLog(false, 'settime')}
                    onKeyDown={() => handleTimeLog(false, 'settime')}
                    role="button"
                    tabIndex="0"
                  >
                    {__('set hours', 'bitform')}
                  </span>
                </>
              )}
              <div className="mt-2 mb-1">{__('User', 'bitform')}</div>
              <select
                value={projectsConf.actions[event]?.timelog?.owner}
                className="btcd-paper-inp"
                onChange={e => handleTimeLog(e.target.value, 'owner')}
              >
                <option value="">{__('Select Owner', 'bitform')}</option>
                {getUsers('taskuser').length > 0 && getUsers('taskuser').map(user => <option key={user.userId} value={user.userId}>{user.userName}</option>)}
              </select>
              <div className="mt-2 mb-1">{__('Notes', 'bitform')}</div>
              <select className="btcd-paper-inp mb-2" onChange={(e) => handleTimeLog(e.target.value, 'notes_fld')} value={projectsConf.actions[event]?.timelog?.notes_fld || ''}>
                <option value="">{__('Field', 'bitform')}</option>
                {formFields.map(f => f.type !== 'file-up' && <option key={`ff-zhcrm-${f.key}`} value={`\${${f.key}}`}>{f.name}</option>)}
              </select>
            </ConfirmModal>
          </>
        )
      }
      {
        (event === 'task' || event === 'subtask' || event === 'issue') && (
          <ConfirmModal
            className="custom-conf-mdl"
            mainMdlCls="o-v btcd-ttc"
            btnClass="blue"
            btnTxt={__('Ok', 'bitform')}
            show={actionMdl.show === 'reminder_string'}
            close={clsActionMdl}
            action={clsActionMdl}
            title={sprintf(__('%s Reminder', 'bitform'), event)}
          >
            <div className="btcd-hr mt-2" />
            <div className="mt-2 mb-1">{__('Select Reminder Type', 'bitform')}</div>
            <select className="btcd-paper-inp" onChange={(e) => handleReminder(e.target.value, 'reminder_criteria')} value={projectsConf.actions[event]?.reminder_string?.reminder_criteria || ''}>
              <option value="">{__('Select Type', 'bitform')}</option>
              <option value="daily">{__('Daily', 'bitform')}</option>
              <option value="on same day">{__('On Same Day', 'bitform')}</option>
              <option value="before due date">{__('Before Due Date', 'bitform')}</option>
              <option value="customdate">{__('Custom Date', 'bitform')}</option>
            </select>
            {projectsConf.actions[event]?.reminder_string?.reminder_criteria === 'before due date' && (
              <>
                <div className="mt-2 mb-1">{__('Day Before', 'bitform')}</div>
                <input type="number" className="btcd-paper-inp" onChange={(e) => handleReminder(e.target.value, 'day_before')} value={projectsConf.actions[event]?.reminder_string?.day_before || ''} />
              </>
            )}
            {projectsConf.actions[event]?.reminder_string?.reminder_criteria === 'customdate' && (
              <>
                <div className="mt-2 mb-1">{__('Select Date', 'bitform')}</div>
                <div className="flx">
                  <input type="date" className="btcd-paper-inp" onChange={(e) => handleReminder(e.target.value, 'custom_date')} value={projectsConf.actions[event]?.reminder_string?.custom_date || ''} style={{ height: 40 }} />
                  <select className="btcd-paper-inp" onChange={(e) => handleReminder(e.target.value, 'custom_date_fld')} value={projectsConf.actions[event]?.reminder_string?.custom_date_fld || ''}>
                    <option value="">{__('Field', 'bitform')}</option>
                    {formFields.map(f => f.type === 'date' && <option key={`ff-zhcrm-${f.key}`} value={`\${${f.key}}`}>{f.name}</option>)}
                  </select>
                </div>
              </>
            )}
            <div className="mt-2 mb-1">{__('Select Time', 'bitform')}</div>
            <div className="flx">
              <input type="time" className="btcd-paper-inp" onChange={(e) => handleReminder(e.target.value, 'reminder_time')} value={projectsConf.actions[event]?.reminder_string?.reminder_time || ''} style={{ height: 40 }} />
              <select className="btcd-paper-inp" onChange={(e) => handleReminder(e.target.value, 'reminder_time_fld')} value={projectsConf.actions[event]?.reminder_string?.reminder_time_fld || ''}>
                <option value="">{__('Field', 'bitform')}</option>
                {formFields.map(f => f.type === 'time' && <option key={`ff-zhcrm-${f.key}`} value={`\${${f.key}}`}>{f.name}</option>)}
              </select>
            </div>
            <div className="mt-2">{__('Notify Users', 'bitform')}</div>
            <MultiSelect
              defaultValue={projectsConf.actions[event]?.reminder_string?.reminder_notify_users}
              className="mt-1 w-10 btcd-paper-drpdwn"
              onChange={(val) => handleReminder(val, 'reminder_notify_users')}
              options={getUsers().map(user => ({ label: user.userName, value: user.userId }))}
            />
          </ConfirmModal>
        )
      }
      {
        event === 'task' && (
          <ConfirmModal
            className="custom-conf-mdl"
            mainMdlCls="o-v btcd-ttc"
            btnClass="blue"
            btnTxt={__('Ok', 'bitform')}
            show={actionMdl.show === 'recurrence_string'}
            close={clsActionMdl}
            action={clsActionMdl}
            title={sprintf(__('%s Recurrence', 'bitform'), event)}
          >
            <div className="btcd-hr mt-2" />
            <div className="mt-2 mb-1">{__('Select Recurring Frequency', 'bitform')}</div>
            <select className="btcd-paper-inp" onChange={(e) => handleRecurrence(e.target.value, 'recurring_frequency')} value={projectsConf.actions[event]?.recurrence_string?.recurring_frequency}>
              <option value="">{__('Select Frequency', 'bitform')}</option>
              <option value="daily">{__('Daily', 'bitform')}</option>
              <option value="weekly">{__('Weekley', 'bitform')}</option>
              <option value="monthly">{__('Monthly', 'bitform')}</option>
              <option value="yearly">{__('Yearly', 'bitform')}</option>
            </select>
            <div className="mt-2 mb-1">{__(`Once Every ${getRecurrenceFrequency(projectsConf.actions[event]?.recurrence_string?.recurring_frequency)}`, 'bitform')}</div>
            <div className="flx">
              <input type="number" className="btcd-paper-inp" onChange={(e) => handleRecurrence(e.target.value, 'time_span')} min="1" max="15" value={projectsConf.actions[event]?.recurrence_string?.time_span || ''} />
              <select className="btcd-paper-inp" onChange={(e) => handleRecurrence(e.target.value, 'time_span_fld')} value={projectsConf.actions[event]?.recurrence_string?.time_span_fld || ''}>
                <option value="">{__('Field', 'bitform')}</option>
                {formFields.map(f => f.type !== 'file-up' && <option key={`ff-zhcrm-${f.key}`} value={`\${${f.key}}`}>{f.name}</option>)}
              </select>
            </div>
            <div className="mt-2 mb-1">{__(`End After ${getRecurrenceFrequency(projectsConf.actions[event]?.recurrence_string?.recurring_frequency)}`, 'bitform')}</div>
            <div className="flx mb-2">
              <input type="number" className="btcd-paper-inp" onChange={(e) => handleRecurrence(e.target.value, 'number_of_occurrences')} min="2" max="30" value={projectsConf.actions[event]?.recurrence_string?.number_of_occurrences || ''} />
              <select className="btcd-paper-inp" onChange={(e) => handleRecurrence(e.target.value, 'number_of_occurrences_fld')} value={projectsConf.actions[event]?.recurrence_string?.number_of_occurrences_fld || ''}>
                <option value="">{__('Field', 'bitform')}</option>
                {formFields.map(f => f.type !== 'file-up' && <option key={`ff-zhcrm-${f.key}`} value={`\${${f.key}}`}>{f.name}</option>)}
              </select>
            </div>
            {['monthly', 'yearly'].includes(projectsConf.actions[event]?.recurrence_string?.recurring_frequency)
              && (<CheckBox onChange={(e) => handleRecurrence(e.target.value, 'set_previous_business_day', e.target.checked)} checked={projectsConf.actions[event]?.recurrence_string?.set_previous_business_day || false} value="true" title={__('Set to previous business day', 'bitform')} />)}
            <CheckBox onChange={(e) => handleRecurrence(e.target.value, 'is_comments_recurred', e.target.checked)} checked={projectsConf.actions[event]?.recurrence_string?.is_comments_recurred || false} value="true" title={__('Retain comments for subsequent recurrences', 'bitform')} />
            <CheckBox onChange={(e) => handleRecurrence(e.target.value, 'recurrence_type', e.target.checked)} checked={projectsConf.actions[event]?.recurrence_string?.recurrence_type || false} value="after_current_task_completed" title={__('Create next recurrence after the close of current task.', 'bitform')} />
          </ConfirmModal>
        )
      }
      {
        event === 'issue' && (
          <>
            <ConfirmModal
              className="custom-conf-mdl"
              mainMdlCls="o-v"
              btnClass="blue"
              btnTxt={__('Ok', 'bitform')}
              show={actionMdl.show === 'followers'}
              close={clsActionMdl}
              action={clsActionMdl}
              title={__('Issue Followers', 'bitform')}
            >
              <div className="btcd-hr mt-2" />
              {isLoading ? (
                <Loader style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 45,
                  transform: 'scale(0.5)',
                }}
                />
              )
                : (
                  <div className="flx flx-between mt-2">
                    <MultiSelect
                      defaultValue={projectsConf.actions[event].bug_followers}
                      className="mt-2 w-9"
                      onChange={(val) => actionHandler(val, 'bug_followers')}
                      options={getUsers().map(user => ({ label: user.userName, value: user.userId }))}
                    />
                    <button onClick={() => refreshUsers(formID, projectsConf, setProjectsConf, setisLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Portal Users', 'bitform')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
                  </div>
                )}
            </ConfirmModal>
            {projectsConf?.projectId && ['severity', 'classification', 'module', 'priority']
              .map(act => (
                <ConfirmModal
                  key={act}
                  className="custom-conf-mdl"
                  mainMdlCls="o-v btcd-ttc"
                  btnClass="blue"
                  btnTxt={__('Ok', 'bitform')}
                  show={actionMdl.show === act}
                  close={clsActionMdl}
                  action={clsActionMdl}
                  title={sprintf(__('Issue %s', 'bitform'), act)}
                >
                  <div className="btcd-hr mt-2" />
                  <div className="flx flx-between mt-2">
                    <select
                      value={projectsConf.actions[event][act === 'priority' ? 'reproducible_id' : `${act}_id`]}
                      className="btcd-paper-inp"
                      onChange={e => actionHandler(e.target.value, act === 'priority' ? 'reproducible_id' : `${act}_id`)}
                    >
                      <option value="">{`Select ${act}`}</option>
                      {projectsConf.default?.fields?.[projectsConf.portalId]?.[projectsConf.projectId]?.[event]?.defaultfields?.[`${act}_details`] && Object.values(projectsConf.default.fields[projectsConf.portalId][projectsConf.projectId][event].defaultfields[`${act}_details`]).map(field => (
                        <option key={field[`${act}_id`]} value={field[`${act}_id`]}>
                          {field[`${act}_name`]}
                        </option>
                      ))}
                    </select>
                  </div>
                </ConfirmModal>
              ))}
          </>
        )
      }
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v btcd-ttc"
        btnClass="blue"
        btnTxt={__('Ok', 'bitform')}
        show={actionMdl.show === 'tags'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={sprintf(__('%s Tags', 'bitform'), event)}
      >
        <div className="btcd-hr mt-2" />
        {isLoading ? (
          <Loader style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 45,
            transform: 'scale(0.5)',
          }}
          />
        ) : (
          <>
            <div className="flx flx-between mt-2">
              <MultiSelect
                className="msl-wrp-options"
                defaultValue={projectsConf.actions[event].tags}
                options={getTags()}
                onChange={(val) => actionHandler(val, 'tags')}
              />
              <button onClick={() => refreshTags(formID, projectsConf, setProjectsConf, setisLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': '"Refresh Tags"' }} type="button" disabled={isLoading}>&#x21BB;</button>
            </div>
            <hr />
            <small>{__('Custom Tags', 'bitform')}</small>
            {projectsConf?.actions?.[event]?.customTags?.length > 0 && projectsConf.actions[event].customTags.map((tag, i) => (
              <div key={`tg=${i + 79}`} className="flx flx-between mt-2 mb-2">
                <input type="text" className="btcd-paper-inp" onChange={(e) => handleCustomTag('value', i, 'name', e.target.value)} value={tag.name} />
                <select className="btcd-paper-inp w-3" value={tag.field} onChange={(e) => handleCustomTag('value', i, 'field', e.target.value)}>
                  <option value="">{__('Field', 'bitform')}</option>
                  {formFields.map(f => f.type !== 'file-up' && <option key={`ff-zhcrm-${f.key}`} value={`\${${f.key}}`}>{f.name}</option>)}
                </select>
                <select className="btcd-paper-inp w-3" style={{ backgroundColor: `${tag.color.replace('bg', '#')}` }} value={tag.color} onChange={(e) => handleCustomTag('value', i, 'color', e.target.value)}>
                  <option value="">Color</option>
                  {['0dd3d3', 'e2b910', '7f78e0', 'f28840', 'd359aa', '83b727', 'b58a61', 'ffac14', '48b7b4', 'f56b62', '728099', '609100', '0d6fb7', '0995ba', '15a8e2', 'ff5acd', '898985', '3b92ff', 'ac57f2', '895a59'].map(tagColor => (
                    <option key={tagColor} value={`bg${tagColor}`} style={{ backgroundColor: `#${tagColor}` }} aria-label="color" />
                  ))}
                </select>
                <button onClick={() => handleCustomTag('remove', i)} className="icn-btn ml-2" aria-label="delete" type="button"><TrashIcn /></button>
              </div>
            ))}
            <button onClick={() => handleCustomTag('add')} className="icn-btn ml-2 mr-2 sh-sm tooltip" style={{ '--tooltip-txt': `'${__('Add Custom Tag', 'nitform')}'` }} type="button">+</button>
          </>
        )}
      </ConfirmModal>

    </div>
  )
}
