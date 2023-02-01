import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import FluentCrmActions from './FluentCrmActions'
import { refreshCrmList, refreshfluentCrmHeader } from './FluentCrmCommonFunc'
import FluentCrmFieldMap from './FluentCrmFieldMap'

export default function FluentCrmIntegLayout({ formID, formFields, fluentCrmConf, setFluentCrmConf, isLoading, setisLoading, setSnackbar }) {
  const tags = (val) => {
    const newConf = { ...fluentCrmConf }
    if (val) {
      newConf.tags = val ? val.split(',') : []
    } else {
      delete newConf.tags
    }
    setFluentCrmConf({ ...newConf })
  }

  const inputHendler = (e) => {
    const newConf = { ...fluentCrmConf }
    newConf.list_id = e.target.value
    setFluentCrmConf({ ...newConf })
  }
  return (
    <>
      <br />
      <div className="flx">
        <b className="wdt-200 d-in-b">{__('Fluent CRM List:', 'bitform')}</b>
        <select onChange={(e) => inputHendler(e)} name="list_id" value={fluentCrmConf.list_id} className="btcd-paper-inp w-5">
          <option value="">{__('Select Fluent CRM list', 'bitform')}</option>
          {
            fluentCrmConf?.default?.fluentCrmList && Object.keys(fluentCrmConf.default.fluentCrmList).map(fluentCrmListName => (
              <option key={fluentCrmListName} value={fluentCrmConf.default.fluentCrmList[fluentCrmListName].id}>
                {fluentCrmConf.default.fluentCrmList[fluentCrmListName].title}
              </option>
            ))
          }
        </select>
        <button onClick={() => refreshCrmList(formID, fluentCrmConf, setFluentCrmConf, setisLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Fluent CRM List', 'bitform')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
      </div>
      <div className="flx mt-5">
        <b className="wdt-200 d-in-b">{__('Fluent CRM Tags: ', 'bitform')}</b>
        <MultiSelect
          defaultValue={fluentCrmConf?.tags}
          className="btcd-paper-drpdwn w-5"
          options={fluentCrmConf?.default?.fluentCrmTags && Object.keys(fluentCrmConf.default.fluentCrmTags).map(tag => ({ label: fluentCrmConf.default.fluentCrmTags[tag].title, value: (fluentCrmConf.default.fluentCrmTags[tag].id).toString() }))}
          onChange={val => tags(val)}
        />
      </div>
      {isLoading && (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
          transform: 'scale(0.7)',
        }}
        />
      )}
      <div className="mt-4">
        <b className="wdt-100">{__('Map Fields', 'bitform')}</b>
      </div>
      <div className="btcd-hr mt-1" />
      <div className="flx flx-around mt-2 mb-1">
        <div className="txt-dp"><b>{__('Form Fields', 'bitform')}</b></div>
        <div className="txt-dp"><b>{__('Fluent CRM Fields', 'bitform')}</b></div>
      </div>

      {fluentCrmConf.field_map.map((itm, i) => (
        <FluentCrmFieldMap
          key={`fluentcrm-m-${i + 9}`}
          i={i}
          field={itm}
          fluentCrmConf={fluentCrmConf}
          formFields={formFields}
          setFluentCrmConf={setFluentCrmConf}
        />
      ))}
      <div className="txt-center  mt-2" style={{ marginRight: 85 }}><button onClick={() => addFieldMap(fluentCrmConf.field_map.length, fluentCrmConf, setFluentCrmConf)} className="icn-btn sh-sm" type="button">+</button></div>

      {/* {fluentCrmConf.actions?.customField && (
              <>
                <div className="mt-4">
                  <b className="wdt-100">{__('Map Fields', 'bitform')}</b>
                </div>
                <div className="btcd-hr mt-1" />
                <div className="flx flx-around mt-2 mb-1">
                  <div className="txt-dp"><b>{__('Form Fields', 'bitform')}</b></div>
                  <div className="txt-dp"><b>{__('Fluent CRM Custom Fields', 'bitform')}</b></div>
                </div>

                {fluentCrmConf.field_map.map((itm, i) => (
                  <FluentCrmFieldMap
                    key={`fluentcrm-m-${i + 9}`}
                    i={i}
                    field={itm}
                    fluentCrmConf={fluentCrmConf}
                    formFields={formFields}
                    setFluentCrmConf={setFluentCrmConf}
                    customField
                  />
                ))}
                <div className="txt-center  mt-2" style={{ marginRight: 85 }}><button onClick={() => addFieldMap(fluentCrmConf.field_map.length, fluentCrmConf, setFluentCrmConf)} className="icn-btn sh-sm" type="button">+</button></div>

              </>
            )} */}
      <br />
      <div className="mt-4"><b className="wdt-100">{__('Actions', 'bitform')}</b></div>
      <div className="btcd-hr mt-1" />
      <FluentCrmActions
        fluentCrmConf={fluentCrmConf}
        setFluentCrmConf={setFluentCrmConf}
        setisLoading={setisLoading}
        setSnackbar={setSnackbar}
      />
    </>
  )
}
