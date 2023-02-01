import { __ } from '../Utils/i18nwrap'

export default function PaypalSettings({ paySetting, handleInput }) {
  return (
    <div>
      <h2>{__('Paypal Settings', 'bitform')}</h2>
      <div className="btcd-hr" />
      <div className="flx mt-3">
        <b className="wdt-150">{__('Integration Name:', 'bitform')}</b>
        <input type="text" className="btcd-paper-inp" placeholder="Integration Name" value={paySetting.name || ''} name="name" onChange={handleInput} />
      </div>
      <div className="flx mt-3">
        <b className="wdt-150">{__('Client ID:', 'bitform')}</b>
        <input type="text" className="btcd-paper-inp" placeholder="Client ID" value={paySetting.clientID || ''} name="clientID" onChange={handleInput} />
      </div>
      <div className="flx">
        <small className="d-blk mt-5" style={{ marginLeft: 130 }}>
          {__('To get Client ID, Please Visit', 'bitform')}
          {' '}
          <a className="btcd-link" href="https://developer.paypal.com/developer/applications/" target="_blank" rel="noreferrer">{__('PayPal Dashboard', 'bitform')}</a>
        </small>
      </div>
    </div>
  )
}
