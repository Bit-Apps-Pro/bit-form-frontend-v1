import { Tabs, TabList, Tab, TabPanel } from 'react-tabs'
import { __ } from '../../../Utils/i18nwrap'
import ZohoCRMNewRecord from './ZohoCRMNewRecord'
import ZohoCRMRelatedRecord from './ZohoCRMRelatedRecord'
import { refreshModules } from './ZohoCRMCommonFunc'
import CloseIcn from '../../../Icons/CloseIcn'

export default function ZohoCRMIntegLayout({ tab, settab, formID, formFields, handleInput, crmConf, setCrmConf, isLoading, setisLoading, setSnackbar }) {
  const addNewRelatedTab = () => {
    if (crmConf.relatedlists.length < 3) {
      const newConf = { ...crmConf }
      newConf.relatedlists.push({
        actions: {},
        field_map: [{ formField: '', zohoFormField: '' }],
        layout: '',
        module: '',
        upload_field_map: [{ formField: '', zohoFormField: '' }],
      })
      setCrmConf({ ...newConf })
    }
  }

  const removeRelatedTab = indx => {
    const newConf = { ...crmConf }

    newConf.relatedlists.splice(indx, 1)

    if (!newConf.relatedlists.length) settab(0)

    setCrmConf({ ...newConf })
  }

  return (
    <>
      <br />
      <b className="wdt-100 d-in-b">{__('Module:', 'bitform')}</b>
      <select onChange={handleInput} name="module" value={crmConf.module} className="btcd-paper-inp w-7" disabled={tab}>
        <option value="">{__('Select Module', 'bitform')}</option>
        {
          crmConf?.default?.modules && Object.keys(crmConf.default.modules).map(moduleApiName => (
            <option key={moduleApiName} value={moduleApiName}>
              {crmConf.default.modules[moduleApiName].plural_label}
            </option>
          ))
        }
      </select>
      {tab === 0 && <button onClick={() => refreshModules(formID, crmConf, setCrmConf, setisLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh CRM Modules', 'bitform')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>}
      <br />
      <div>
        <Tabs
          selectedTabClassName="s-t-l-active"
        >
          <TabList className="flx mt-2 mb-0">
            <Tab className="btcd-s-tab-link">
              {__('New Record', 'bitform')}
            </Tab>
            {crmConf?.relatedlists && crmConf.relatedlists.map((_, indx) => (
              <>
                <Tab key={`t-${indx * 3}`} className="btcd-s-tab-link">
                  {__('Related List #', 'bitform')}
                  {indx + 1}
                </Tab>
                <button onClick={() => removeRelatedTab(indx)} className="icn-btn" aria-label="delete-relatedlist" type="button"><CloseIcn size="14" /></button>
              </>
            ))}
            {crmConf.relatedlists.length < 3 && <button onClick={addNewRelatedTab} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Add More Related List', 'bitform')}'` }} type="button">+</button>}
          </TabList>
          <div className="btcd-hr" />

          <TabPanel>
            <ZohoCRMNewRecord
              tab={tab}
              settab={settab}
              formID={formID}
              formFields={formFields}
              crmConf={crmConf}
              setCrmConf={setCrmConf}
              handleInput={handleInput}
              isLoading={isLoading}
              setisLoading={setisLoading}
              setSnackbar={setSnackbar}
            />
          </TabPanel>
          {
            crmConf?.relatedlists && crmConf.relatedlists.map((_, indx) => (
              <TabPanel key={`p-${indx + 2.4}`}>
                <ZohoCRMRelatedRecord
                  indx={indx}
                  tab={tab}
                  settab={settab}
                  formID={formID}
                  formFields={formFields}
                  crmConf={crmConf}
                  setCrmConf={setCrmConf}
                  handleInput={handleInput}
                  isLoading={isLoading}
                  setisLoading={setisLoading}
                  setSnackbar={setSnackbar}
                />
              </TabPanel>
            ))
          }
        </Tabs>
      </div>
      <br />

    </>
  )
}
