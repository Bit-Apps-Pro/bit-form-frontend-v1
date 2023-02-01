import { useRecoilValue } from 'recoil'
import { __ } from '../../../Utils/i18nwrap'
import MtInput from '../../Utilities/MtInput'
import { addFieldMap, delFieldMap, handleCustomValue, handleFieldMapping } from './IntegrationHelpers'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import { $bits } from '../../../GlobalStates'
import { generateMappedField } from './MailerLiteCommonFunc'

export default function MailerLiteFieldMap({ i, formFields, field, mailerLiteConf, setMailerLiteConf }) {
  console.log('formFields2', formFields)
  if (mailerLiteConf?.field_map?.length === 1 && field.mailerLiteFormField === '') {
    const newConf = { ...mailerLiteConf }
    const tmp = generateMappedField(newConf)
    newConf.field_map = tmp
    setMailerLiteConf(newConf)
  }

  const requiredFlds = mailerLiteConf?.mailerLiteFields.filter(fld => fld.required === true) || []
  const nonRequiredFlds = mailerLiteConf?.mailerLiteFields.filter(fld => fld.required === false) || []
  const bits = useRecoilValue($bits)
  const { isPro } = bits
  console.log('mailerLiteConf', mailerLiteConf)

  return (
    <div
      className="flx mt-2 mb-2 btcbi-field-map"
    >
      <div className="pos-rel flx">
        <div className="flx integ-fld-wrp">
          <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(ev, i, mailerLiteConf, setMailerLiteConf)}>
            <option value="">{__('Select Field', 'bit-form')}</option>
            <optgroup label="Form Fields">
              {

                formFields?.map(f => (
                  <option key={`ff-rm-${f.key}`} value={f.key}>
                    {f.name}
                  </option>
                ))
              }
            </optgroup>
            <option value="custom">{__('Custom...', 'bit-form')}</option>
            <optgroup label={`General Smart Codes ${isPro ? '' : '(PRO)'}`}>
              {isPro && SmartTagField?.map(f => (
                <option key={`ff-rm-${f.name}`} value={f.name}>
                  {f.label}
                </option>
              ))}
            </optgroup>

          </select>

          {field.formField === 'custom' && <MtInput onChange={e => handleCustomValue(e, i, mailerLiteConf, setMailerLiteConf)} label={__('Custom Value', 'bit-form')} className="mr-2" type="text" value={field.customValue} placeholder={__('Custom Value', 'bit-form')} />}

          <select className="btcd-paper-inp" disabled={i < requiredFlds.length} name="mailerLiteFormField" value={i < requiredFlds ? (requiredFlds[i].label || '') : (field.mailerLiteFormField || '')} onChange={(ev) => handleFieldMapping(ev, i, mailerLiteConf, setMailerLiteConf)}>
            <option value="">{__('Select Field', 'bit-form')}</option>
            {
              i < requiredFlds.length ? (
                <option key={requiredFlds[i].key} value={requiredFlds[i].key}>
                  {requiredFlds[i].label}
                </option>
              ) : (
                nonRequiredFlds.map(({ key, label }) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))
              )
            }
          </select>
        </div>
        {
          i >= requiredFlds.length && (
            <>
              <button
                onClick={() => addFieldMap(i, mailerLiteConf, setMailerLiteConf)}
                className="icn-btn sh-sm ml-2 mr-1"
                type="button"
              >
                +
              </button>
              <button onClick={() => delFieldMap(i, mailerLiteConf, setMailerLiteConf)} className="icn-btn sh-sm ml-1" type="button" aria-label="btn">
                <span className="btcd-icn icn-trash-2" />
              </button>
            </>
          )
        }
      </div>
    </div>
  )
}
