import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import { refreshContactFields, refreshLists } from './ZohoMarketingHubCommonFunc'
import ZohoMarketingHubFieldMap from './ZohoMarketingHubFieldMap'

export default function ZohoMarketingHubIntegLayout({ formID, formFields, handleInput, marketingHubConf, setMarketingHubConf, isLoading, setisLoading, setSnackbar }) {
  return (
    <>
      <br />
      <b className="wdt-100 d-in-b">{__('List:', 'bitform')}</b>
      <select onChange={event => handleInput(event)} name="list" value={marketingHubConf.list} className="btcd-paper-inp w-7">
        <option value="">{__('Select List', 'bitform')}</option>
        {
          marketingHubConf?.default?.lists && Object.values(marketingHubConf.default.lists).map(listApiName => (
            <option key={listApiName.listkey} value={listApiName.listkey}>
              {listApiName.listname}
            </option>
          ))
        }
      </select>
      <button onClick={() => refreshLists(formID, marketingHubConf, setMarketingHubConf, setisLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh MarketingHub Lists', 'bitform')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
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

      {marketingHubConf.list && (
        <>
          <div className="mt-4">
            <b className="wdt-100">{__('Map Fields', 'bitform')}</b>
            <button onClick={() => refreshContactFields(formID, marketingHubConf, setMarketingHubConf, setisLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh MarketingHub Contact Fields', 'bitform')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
          </div>
          <div className="btcd-hr mt-1" />
          {marketingHubConf.default?.fields?.[marketingHubConf.list]
            && (
              <>
                <div className="flx flx-around mt-2 mb-1">
                  <div className="txt-dp"><b>{__('Form Fields', 'bitform')}</b></div>
                  <div className="txt-dp"><b>{__('Zoho Fields', 'bitform')}</b></div>
                </div>

                {marketingHubConf.field_map.map((itm, i) => (
                  <ZohoMarketingHubFieldMap
                    key={`marketingHub-m-${i + 9}`}
                    i={i}
                    field={itm}
                    marketingHubConf={marketingHubConf}
                    formFields={formFields}
                    setMarketingHubConf={setMarketingHubConf}
                  />
                ))}
                <div className="txt-center  mt-2" style={{ marginRight: 85 }}><button onClick={() => addFieldMap(marketingHubConf.field_map.length, marketingHubConf, setMarketingHubConf)} className="icn-btn sh-sm" type="button">+</button></div>
              </>
            )}
        </>
      )}
    </>
  )
}
