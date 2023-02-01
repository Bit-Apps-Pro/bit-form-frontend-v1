import TrashIcn from '../../../Icons/TrashIcn'
import { __ } from '../../../Utils/i18nwrap'
import ZohoProjectsActions from './ZohoProjectsActions'
import { refreshFields } from './ZohoProjectsCommonFunc'
import ZohoProjectsFieldMap, { addFieldMap } from './ZohoProjectsFieldMap'

export default function CreateNew({ event, projectsConf, setProjectsConf, formID, formFields, isLoading, setisLoading, setSnackbar }) {
  let allFieldsMapped = ''

  if (projectsConf?.projectId && projectsConf.default?.fields?.[projectsConf.portalId]?.[projectsConf.projectId]?.[event]?.fields) {
    allFieldsMapped = projectsConf.field_map[event].length === Object.keys(projectsConf.default.fields[projectsConf.portalId][projectsConf.projectId][event].fields).length
  } else if (projectsConf.default?.fields?.[projectsConf.portalId]?.[event]?.fields) {
    allFieldsMapped = projectsConf.field_map[event].length === Object.keys(projectsConf.default.fields[projectsConf.portalId][event]?.fields).length
  }

  const removeSubEvent = () => {
    const newConf = { ...projectsConf }
    newConf.subEvent.splice(newConf.subEvent.indexOf(event), 1)
    setProjectsConf({ ...newConf })
  }
  return (
    <div className="btcd-ttc">
      <div className="mt-4">
        <div className="d-flx flx-between">
          <div>
            <b className="wdt-100">
              {__('Create', 'bitform')}
              {` ${event}`}
            </b>
            <button onClick={() => refreshFields(formID, projectsConf, setProjectsConf, setisLoading, setSnackbar, event)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Fields', 'bitform')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
          </div>
          {projectsConf.event !== event && <button onClick={removeSubEvent} className="icn-btn sh-sm ml-2 mr-2" type="button" aria-label="delete"><TrashIcn /></button>}
        </div>
      </div>
      <div className="btcd-hr mt-1" />
      <div className="flx flx-around mt-2 mb-1">
        <div className="txt-dp"><b>{__('Form Fields', 'bitform')}</b></div>
        <div className="txt-dp"><b>{__('Zoho Fields', 'bitform')}</b></div>
      </div>

      {projectsConf.field_map?.[event]?.map((itm, i) => (
        <ZohoProjectsFieldMap
          key={`projects-m-${i + 9}`}
          i={i}
          event={event}
          field={itm}
          projectsConf={projectsConf}
          formFields={formFields}
          setProjectsConf={setProjectsConf}
        />
      ))}

      {!allFieldsMapped && (
        <div className="txt-center  mt-2" style={{ marginRight: 85 }}><button onClick={() => addFieldMap(projectsConf.field_map[event].length, projectsConf, setProjectsConf, event)} className="icn-btn sh-sm" type="button">+</button></div>
      )}
      <br />
      <br />
      <div className="mt-4">
        <b className="wdt-100">
          {`${event}`}
          {' '}
          {__('Actions', 'bitform')}
        </b>
      </div>
      <div className="btcd-hr mt-1" />

      <ZohoProjectsActions
        event={event}
        projectsConf={projectsConf}
        setProjectsConf={setProjectsConf}
        formID={formID}
        formFields={formFields}
        setSnackbar={setSnackbar}
      />
      <br />
      <br />
    </div>
  )
}
