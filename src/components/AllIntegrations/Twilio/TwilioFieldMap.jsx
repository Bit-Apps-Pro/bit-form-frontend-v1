import { useRecoilValue } from 'recoil'
import { __ } from '../../../Utils/i18nwrap'
import MtInput from '../../Utilities/MtInput'
import { handleCustomValue, handleFieldMapping } from './IntegrationHelpers'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import { $bits } from '../../../GlobalStates'

export default function TwilioFieldMap({ i, formFields, field, twilioConf, setTwilioConf }) {
  const bits = useRecoilValue($bits)
  const { isPro } = bits

  return (
    <div
      className="flx mt-2 mb-2 btcbi-field-map"
    >
      <div className="pos-rel flx">
        <div className="flx integ-fld-wrp">
          <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(ev, i, twilioConf, setTwilioConf)}>
            <option value="">{__('Select Field', 'bit-integrations')}</option>
            <optgroup label="Form Fields">
              {

                formFields?.map(f => (
                  <option key={`ff-rm-${f.key}`} value={f.key}>
                    {f.name}
                  </option>
                ))
              }
            </optgroup>
            <option value="custom">{__('Custom...', 'bit-integrations')}</option>
            <optgroup label={`General Smart Codes ${isPro ? '' : '(PRO)'}`}>
              {isPro && SmartTagField?.map(f => (
                <option key={`ff-rm-${f.name}`} value={f.name}>
                  {f.label}
                </option>
              ))}
            </optgroup>

          </select>

          {field.formField === 'custom' && <MtInput onChange={e => handleCustomValue(e, i, twilioConf, setTwilioConf)} label={__('Custom Value', 'bit-integrations')} className="mr-2" type="text" value={field.customValue} placeholder={__('Custom Value', 'bit-integrations')} />}

          <select className="btcd-paper-inp" disabled name="twilioField" value={field.twilioField} onChange={(ev) => handleFieldMapping(ev, i, twilioConf, setTwilioConf)}>
            <option value="">{__('Select Field', 'bit-integrations')}</option>
            {
                twilioConf?.twilioFields.map(({ key, label }) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))
            }
          </select>
        </div>
      </div>
    </div>
  )
}
