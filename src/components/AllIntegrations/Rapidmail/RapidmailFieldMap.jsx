import { useRecoilValue } from 'recoil'
import { __ } from '../../../Utils/i18nwrap'
import MtInput from '../../Utilities/MtInput'
import { addFieldMap, delFieldMap, handleCustomValue, handleFieldMapping } from './IntegrationHelpers'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import { $bits } from '../../../GlobalStates'
import { generateMappedField } from './RapidmailCommonFunc'
import TrashIcn from '../../../Icons/TrashIcn'

export default function RapidmailFieldMap({ i, formFields, field, rapidmailConf, setRapidmailConf }) {
  if (rapidmailConf?.field_map?.length === 1 && field.rapidmailFormField === '') {
    const newConf = { ...rapidmailConf }
    const tmp = generateMappedField(newConf)
    newConf.field_map = tmp
    setRapidmailConf(newConf)
  }
  const requiredFlds = rapidmailConf?.recipientsFields.filter(fld => fld.required === true) || []
  const nonRequiredFlds = rapidmailConf?.recipientsFields.filter(fld => fld.required === false) || []

  const bits = useRecoilValue($bits)
  const { isPro } = bits

  return (
    <div
      className="flx mt-2 mr-1"
    >
      <div className="flx integ-fld-wrp">
        <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(ev, i, rapidmailConf, setRapidmailConf)}>
          <option value="">{__('Select Field', 'bitform')}</option>
          <optgroup label="Form Fields">
            {

              formFields?.map(f => (
                <option key={`ff-rm-${f.key}`} value={f.key}>
                  {f.name}
                </option>
              ))
            }
          </optgroup>

          <option value="custom">{__('Custom...', 'bitform')}</option>
          <optgroup label={`General Smart Codes ${isPro ? '' : '(PRO)'}`}>
            {isPro && SmartTagField?.map(f => (
              <option key={`ff-rm-${f.name}`} value={f.name}>
                {f.label}
              </option>
            ))}
          </optgroup>

        </select>

        {field.formField === 'custom' && <MtInput onChange={e => handleCustomValue(e, i, rapidmailConf, setRapidmailConf)} label={__('Custom Value', 'bitform')} className="mr-2" type="text" value={field.customValue} placeholder={__('Custom Value', 'bitform')} />}

        <select className="btcd-paper-inp" disabled={i < requiredFlds.length} name="rapidmailFormField" value={i < requiredFlds ? (requiredFlds[i].label || '') : (field.rapidmailFormField || '')} onChange={(ev) => handleFieldMapping(ev, i, rapidmailConf, setRapidmailConf)}>
          <option value="">{__('Select Field', 'bitform')}</option>
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
              onClick={() => addFieldMap(i, rapidmailConf, setRapidmailConf)}
              className="icn-btn sh-sm ml-2 mr-1"
              type="button"
            >
              +
            </button>
            <button onClick={() => delFieldMap(i, rapidmailConf, setRapidmailConf)} className="icn-btn sh-sm" type="button" aria-label="btn">
              <TrashIcn />
            </button>
          </>
        )
      }
    </div>
  )
}
