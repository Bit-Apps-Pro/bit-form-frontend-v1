import { useEffect } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import { addFieldMap } from './IntegrationHelpers'
import RapidmailActions from './RapidmailActions'
import { getAllRecipient } from './RapidmailCommonFunc'
import RapidmailFieldMap from './RapidmailFieldMap'

export default function RapidmailIntegLayout({ formFields, handleInput, rapidmailConf, setRapidmailConf, isLoading, setIsLoading, setSnackbar }) {
  return (
    <>
      <br />
      <b className="wdt-200 d-in-b">{__('Recipient:', 'bitform')}</b>
      <select onChange={handleInput} name="recipient_id" value={rapidmailConf?.recipient_id} className="btcd-paper-inp w-5">
        <option value="">{__('Select Recipients', 'bitform')}</option>
        {
          rapidmailConf?.default?.recipientlists && rapidmailConf.default.recipientlists.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))
        }
      </select>
      <button onClick={() => getAllRecipient(rapidmailConf, setRapidmailConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Fetch All Recipients', 'bitform')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
      <br />
      <div className="mt-5"><b className="wdt-100">{__('Field Map', 'bitform')}</b></div>
      <div className="btcd-hr mt-1" />
      <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
        <div className="txt-dp"><b>{__('Form Fields', 'bitform')}</b></div>
        <div className="txt-dp"><b>{__('Rapidmail Fields', 'bitform')}</b></div>
      </div>

      {rapidmailConf?.recipient_id && rapidmailConf?.field_map.map((itm, i) => (
        <RapidmailFieldMap
          key={`rp-m-${i + 9}`}
          i={i}
          field={itm}
          rapidmailConf={rapidmailConf}
          formFields={formFields}
          setRapidmailConf={setRapidmailConf}
          setSnackbar={setSnackbar}
        />
      ))}
      <div className="txt-center mt-2" style={{ marginRight: 85 }}><button onClick={() => addFieldMap(rapidmailConf.field_map.length, rapidmailConf, setRapidmailConf, false)} className="icn-btn sh-sm" type="button">+</button></div>
      <br />
      <br />

      {rapidmailConf?.recipient_id && (
        <>
          <div className="mt-4"><b className="wdt-100">{__('Actions', 'bitform')}</b></div>
          <div className="btcd-hr mt-1" />
          <RapidmailActions
            rapidmailConf={rapidmailConf}
            setRapidmailConf={setRapidmailConf}
            formFields={formFields}
          />
        </>
      )}

    </>
  )
}
