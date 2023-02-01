import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addAddressFieldMap, addFieldMap } from '../IntegrationHelpers/MailChimpIntegrationHelpers'
import AddressFieldMap from './AddressFieldMap'
import MailChimpActions from './MailChimpActions'
import { refreshAudience, refreshTags } from './MailChimpCommonFunc'
import MailChimpFieldMap from './MailChimpFieldMap'

export default function MailChimpIntegLayout({ formID, formFields, handleInput, sheetConf, setSheetConf, isLoading, setisLoading, setSnackbar, a }) {
  const address = [
    { tag: 'addr1', name: 'Address 1', required: true },
    { tag: 'addr2', name: 'Address 2', required: false },
    { tag: 'city', name: 'City', required: true },
    { tag: 'zip', name: 'Zip', required: true },
    { tag: 'state', name: 'State', required: true },
    { tag: 'country', name: 'Country', required: false },
  ]
  const setTags = (val) => {
    const newConf = { ...sheetConf }
    if (val) {
      newConf.tags = val ? val.split(',') : []
    } else {
      delete newConf.tags
    }
    setSheetConf({ ...newConf })
  }

  return (
    <>
      <br />
      <b className="wdt-150 d-in-b">{__('Audience List:', 'bitform')}</b>
      <select onChange={handleInput} name="listId" value={sheetConf.listId} className="btcd-paper-inp w-6">
        <option value="">{__('Select Audience List', 'bitform')}</option>
        {
          sheetConf?.default?.audiencelist && Object.keys(sheetConf.default.audiencelist).map(audiencelistName => (
            <option key={audiencelistName} value={sheetConf.default.audiencelist[audiencelistName].listId}>
              {sheetConf.default.audiencelist[audiencelistName].listName}
            </option>
          ))
        }
      </select>
      <button onClick={() => refreshAudience(formID, sheetConf, setSheetConf, setisLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': '"Refresh Audience list"' }} type="button" disabled={isLoading}>&#x21BB;</button>
      <br />
      <br />
      <div className="d-flx">
        <b style={{ marginTop: '15px' }} className="wdt-150 d-in-b">{__('Tags: ', 'bitform')}</b>
        <MultiSelect
          defaultValue={sheetConf?.tags}
          className="btcd-paper-drpdwn w-6"
          options={sheetConf?.default?.audienceTags && Object.keys(sheetConf.default.audienceTags).map(tag => ({ label: sheetConf.default.audienceTags[tag].tagName, value: sheetConf.default.audienceTags[tag].tagName }))}
          onChange={val => setTags(val)}
        />
        <button onClick={() => refreshTags(formID, sheetConf, setSheetConf, setisLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh MailChimp Tags', 'bitform')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
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
      {sheetConf.default?.fields?.[sheetConf.listId]
        && (
          <>
            <div className="mt-4">
              <b className="wdt-100">{__('Map Fields', 'bitform')}</b>
            </div>
            <div className="btcd-hr mt-1" />
            <div className="flx flx-around mt-2 mb-1">
              <div className="txt-dp"><b>{__('Form Fields', 'bitform')}</b></div>
              <div className="txt-dp"><b>{__('Mail Chimp Fields', 'bitform')}</b></div>
            </div>

            {sheetConf.field_map.map((itm, i) => (
              <MailChimpFieldMap
                key={`sheet-m-${i + 9}`}
                i={i}
                field={itm}
                sheetConf={sheetConf}
                formFields={formFields}
                setSheetConf={setSheetConf}
              />
            ))}
            <div className="txt-center  mt-2" style={{ marginRight: 85 }}><button onClick={() => addFieldMap(sheetConf.field_map.length, sheetConf, setSheetConf)} className="icn-btn sh-sm" type="button">+</button></div>
            <br />
            <br />
            {sheetConf.actions?.address && (
              <>
                <div className="mt-4">
                  <b className="wdt-100">{__('Address Field Map', 'bitform')}</b>
                </div>
                <div className="btcd-hr mt-1" />
                <div className="flx flx-around mt-2 mb-1">
                  <div className="txt-dp"><b>{__('Form Address Fields', 'bitform')}</b></div>
                  <div className="txt-dp"><b>{__('Mail Chimp Address Fields', 'bitform')}</b></div>
                </div>
                {sheetConf?.address_field?.map((itm, i) => (
                  <AddressFieldMap
                    key={`sheet-m-${i + 9}`}
                    i={i}
                    field={itm}
                    sheetConf={sheetConf}
                    formFields={formFields}
                    setSheetConf={setSheetConf}
                    addressField={address}
                  />
                ))}
                <div className="txt-center  mt-2" style={{ marginRight: 85 }}><button onClick={() => addAddressFieldMap(sheetConf.address_field.length, sheetConf, setSheetConf)} className="icn-btn sh-sm" type="button">+</button></div>
              </>
            )}
            <br />
            <br />
          </>
        )}

      {sheetConf.listId && (
        <>
          <div className="mt-4"><b className="wdt-100">{__('Actions', 'bitform')}</b></div>
          <div className="btcd-hr mt-1" />
          <MailChimpActions
            sheetConf={sheetConf}
            setSheetConf={setSheetConf}
            formFields={formFields}
            address={address}
          />
        </>
      )}
    </>
  )
}
