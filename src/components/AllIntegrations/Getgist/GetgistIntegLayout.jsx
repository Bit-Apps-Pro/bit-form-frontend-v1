/* eslint-disable no-lonely-if */
/* eslint-disable no-unused-expressions */
// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '../../../Utils/i18nwrap'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import GetgistActions from './GetgistActions'
import GetgistFieldMap from './GetgistFieldMap'

export default function GetgistIntegLayout({ formFields, getgistConf, setGetgistConf, isLoading, setIsLoading, error, setError }) {
  const contactTypes = [
    { key: 'User', label: 'User' },
    { key: 'Lead', label: 'Lead' },
  ]
  const uniqId = () => Math.floor((1 + Math.random()) * 0x100000000)
    .toString(16)
    .substring(1)

  const handleInput = (e) => {
    const { name, value } = e.target
    const newConf = { ...getgistConf }
    newConf[name] = value
    if (value === 'User') {
      if (value === 'User') newConf.userId = uniqId()
      newConf.field_map = [{ formField: '', getgistFormField: 'email' }]
    } else {
      if (newConf?.userId) delete newConf.userId
      newConf.field_map = [{ formField: '', getgistFormField: 'email' }]
    }
    setGetgistConf({ ...newConf })
  }
  return (
    <>
      <br />
      <b className="wdt-200 d-in-b">{__('User Type:', 'bitform')}</b>
      <select onChange={handleInput} name="user_type" value={getgistConf?.user_type} className="btcd-paper-inp w-5">
        <option value="">{__('Select User Type', 'bitform')}</option>
        {
          contactTypes.map(({ key, label }) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))
        }
      </select>
      <div className="mt-4">
        <b className="wdt-100">{__('Map Fields', 'bitform')}</b>
      </div>
      <div className="btcd-hr mt-1" />
      <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
        <div className="txt-dp"><b>{__('Form Fields', 'bitform')}</b></div>
        <div className="txt-dp"><b>{__('Gist Fields', 'bitform')}</b></div>
      </div>
      {getgistConf?.field_map.map((itm, i) => (
        <GetgistFieldMap
          key={`getgist-m-${i + 9}`}
          i={i}
          field={itm}
          getgistConf={getgistConf}
          formFields={formFields}
          setGetgistConf={setGetgistConf}
        />
      ))}
      <div className="txt-center mt-2" style={{ marginRight: 85 }}><button onClick={() => addFieldMap(getgistConf.field_map.length, getgistConf, setGetgistConf)} className="icn-btn sh-sm" type="button">+</button></div>
      <br />
      <br />

      {getgistConf?.user_type && (
        <>
          <div className="mt-4"><b className="wdt-100">{__('Actions', 'bitform')}</b></div>
          <div className="btcd-hr mt-1" />
          <GetgistActions
            getgistConf={getgistConf}
            setGetgistConf={setGetgistConf}
            formFields={formFields}
          />
        </>
      )}
    </>
  )
}
