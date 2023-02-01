import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import { refreshFields } from './WooCommerceCommonFunc'
import WooCommerceFieldMap from './WooCommerceFieldMap'

export default function WooCommerceIntegLayout({ formFields, handleInput, wcConf, setWcConf, isLoading, setisLoading, setSnackbar }) {
  return (
    <>
      <br />
      <b className="wdt-100 d-in-b">{__('Module:', 'bitform')}</b>
      <select onChange={handleInput} name="module" value={wcConf.module} className="btcd-paper-inp w-7">
        <option value="">{__('Select Module', 'bitform')}</option>
        <option value="customer">Customer</option>
        <option value="product">Product</option>
      </select>
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
      {wcConf.default?.fields?.[wcConf.module]?.fields
        && (
          <>
            <div className="mt-4">
              <b className="wdt-100">{__('Map Fields', 'bitform')}</b>
              <button onClick={() => refreshFields(wcConf, setWcConf, setisLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Fields', 'bitform')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
            </div>
            <div className="btcd-hr mt-1" />
            <div className="flx flx-around mt-2 mb-1">
              <div className="txt-dp"><b>{__('Form Fields', 'bitform')}</b></div>
              <div className="txt-dp"><b>{__('WooCommerce Fields', 'bitform')}</b></div>
            </div>

            {wcConf.field_map.map((itm, i) => (
              <WooCommerceFieldMap
                key={`wc-m-${i + 9}`}
                i={i}
                field={itm}
                wcConf={wcConf}
                formFields={formFields}
                setWcConf={setWcConf}
              />
            ))}
            <div className="txt-center  mt-2" style={{ marginRight: 85 }}>
              <button onClick={() => addFieldMap(wcConf.field_map.length, wcConf, setWcConf)} className="icn-btn sh-sm" type="button">+</button>
            </div>
          </>
        )}

      {wcConf.default?.fields?.[wcConf.module]?.uploadFields
        && (
          <>
            <div className="mt-4">
              <b className="wdt-100">{__('Map File Upload Fields', 'bitform')}</b>
              <button onClick={() => refreshFields(wcConf, setWcConf, setisLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Fields', 'bitform')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
            </div>
            <div className="btcd-hr mt-1" />
            <div className="flx flx-around mt-2 mb-1">
              <div className="txt-dp"><b>{__('Form Fields', 'bitform')}</b></div>
              <div className="txt-dp"><b>{__('WooCommerce Fields', 'bitform')}</b></div>
            </div>

            {wcConf.upload_field_map.map((itm, i) => (
              <WooCommerceFieldMap
                key={`wc-m-${i + 9}`}
                i={i}
                field={itm}
                wcConf={wcConf}
                formFields={formFields}
                setWcConf={setWcConf}
                uploadFields
              />
            ))}
            <div className="txt-center  mt-2" style={{ marginRight: 85 }}>
              <button onClick={() => addFieldMap(wcConf.field_map.length, wcConf, setWcConf, true)} className="icn-btn sh-sm" type="button">+</button>
            </div>
          </>
        )}
      {/*
      <div className="mt-4"><b className="wdt-100">{__('Actions', 'bitform')}</b></div>
      <div className="btcd-hr mt-1" />

      <WooCommerceProductActions
        wcConf={wcConf}
        setWcConf={setWcConf}
        formFields={formFields}
      /> */}
    </>
  )
}
