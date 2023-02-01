import { useEffect } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import TwilioFieldMap from './TwilioFieldMap'

export default function TwilioIntegLayout({ formFields, handleInput, twilioConf, setTwilioConf, isLoading, setIsLoading, setSnackbar }) {
  return (
    <>
      <br />
      <div className="mt-5"><b className="wdt-100">{__('Field Map', 'bit-integrations')}</b></div>
      <div className="btcd-hr mt-1" />
      <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
        <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
        <div className="txt-dp"><b>{__('Twilio Fields', 'bit-integrations')}</b></div>
      </div>

      {twilioConf?.field_map.map((itm, i) => (
        <TwilioFieldMap
          key={`rp-m-${i + 9}`}
          i={i}
          field={itm}
          twilioConf={twilioConf}
          formFields={formFields}
          setTwilioConf={setTwilioConf}
          setSnackbar={setSnackbar}
        />
      ))}
      <br />

    </>
  )
}
