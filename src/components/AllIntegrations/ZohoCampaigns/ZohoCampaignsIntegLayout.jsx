import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { refreshContactFields, refreshLists } from './ZohoCampaignsCommonFunc'
import ZohoCampaignsFieldMap, { addFieldMap } from './ZohoCampaignsFieldMap'

export default function ZohoCampaignsIntegLayout({ formID, formFields, handleInput, campaignsConf, setCampaignsConf, isLoading, setisLoading, setSnackbar }) {
  return (
    <>
      <br />
      <b className="wdt-100 d-in-b">{__('List:', 'bitform')}</b>
      <select onChange={event => handleInput(event)} name="list" value={campaignsConf.list} className="btcd-paper-inp w-7">
        <option value="">{__('Select List', 'bitform')}</option>
        {
          campaignsConf?.default?.lists && Object.values(campaignsConf.default.lists).map(listApiName => (
            <option key={listApiName.listkey} value={listApiName.listkey}>
              {listApiName.listname}
            </option>
          ))
        }
      </select>
      <button onClick={() => refreshLists(formID, campaignsConf, setCampaignsConf, setisLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Campaigns Lists', 'bitform')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
      <br />
      <br />
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

      {campaignsConf.list && (
        <>
          <div className="mt-4">
            <b className="wdt-100">{__('Map Fields', 'bitform')}</b>
            <button onClick={() => refreshContactFields(formID, campaignsConf, setCampaignsConf, setisLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Campaigns Contact Fields', 'bitform')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
          </div>
          <div className="btcd-hr mt-1" />
          {campaignsConf.default?.fields?.[campaignsConf.list]
            && (
              <>
                <div className="flx flx-around mt-2 mb-1">
                  <div className="txt-dp"><b>{__('Form Fields', 'bitform')}</b></div>
                  <div className="txt-dp"><b>{__('Zoho Fields', 'bitform')}</b></div>
                </div>

                {campaignsConf.field_map.map((itm, i) => (
                  <ZohoCampaignsFieldMap
                    key={`campaigns-m-${i + 9}`}
                    i={i}
                    field={itm}
                    campaignsConf={campaignsConf}
                    formFields={formFields}
                    setCampaignsConf={setCampaignsConf}
                  />
                ))}
                <div className="txt-center  mt-2" style={{ marginRight: 85 }}><button onClick={() => addFieldMap(campaignsConf.field_map.length, campaignsConf, setCampaignsConf)} className="icn-btn sh-sm" type="button">+</button></div>
              </>
            )}
        </>
      )}
    </>
  )
}
