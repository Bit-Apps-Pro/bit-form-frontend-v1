import { useRecoilValue } from 'recoil'
import { useEffect } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import MtInput from '../../Utilities/MtInput'
import { addFieldMap, delFieldMap, handleCustomValue, handleFieldMapping } from './IntegrationHelpers'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import { $bits } from '../../../GlobalStates'

import { generateMappedField } from './GroundhoggCommonFunc'

export default function GroundhoggFieldMap({ i, formFields, field, groundhoggConf, setGroundhoggConf }) {
  useEffect(() => {
    if (groundhoggConf?.field_map?.length === 1 && field.GroundhoggMapField === '') {
      const newConf = { ...groundhoggConf }
      const tmp = generateMappedField(newConf)
      newConf.field_map = tmp
      setGroundhoggConf(newConf)
    }
  }, [])

  const requiredFlds = groundhoggConf?.contactsFields.filter(fld => fld.required === true) || []
  const nonRequiredFlds = groundhoggConf?.contactsFields.filter(fld => fld.required === false) || []

  const bits = useRecoilValue($bits)
  const { isPro } = bits

  return (
    <div
      className="flx mt-2 mb-2 btcbi-field-map"
    >
      <div className="pos-rel flx">
        <div className="flx integ-fld-wrp">
          <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(ev, i, groundhoggConf, setGroundhoggConf)}>
            <option value="">{__('Select Field', 'bit-integrations')}</option>
            <optgroup label="Form Fields">
              {
                formFields.map(f => f.type !== 'file-up' && <option key={`ff-zhcrm-${f.key}`} value={f.key}>{f.name}</option>)
              }
            </optgroup>
            <option value="custom">{__('Custom...', 'bit-integrations')}</option>
            <optgroup label={`General Smart Codes ${isPro ? '' : '(PRO)'}`}>
              {isPro && SmartTagField?.map(f => (
                <option key={`ff-gh-${f.name}`} value={f.name}>
                  {f.label}
                </option>
              ))}
            </optgroup>

          </select>

          {field.formField === 'custom' && <MtInput onChange={e => handleCustomValue(e, i, groundhoggConf, setGroundhoggConf)} label={__('Custom Value', 'bit-integrations')} className="mr-2" type="text" value={field.customValue} placeholder={__('Custom Value', 'bit-integrations')} />}

          <select className="btcd-paper-inp" disabled={i < requiredFlds.length} name="GroundhoggMapField" value={i < requiredFlds.length ? (requiredFlds[i].key || '') : (field.GroundhoggMapField || '')} onChange={(ev) => handleFieldMapping(ev, i, groundhoggConf, setGroundhoggConf)}>
            <option value="">{__('Select Field', 'bit-integrations')}</option>
            {
              i < requiredFlds.length ? (
                <option key={requiredFlds[i].key + i} value={requiredFlds[i].key}>
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
                onClick={() => addFieldMap(i, groundhoggConf, setGroundhoggConf)}
                className="icn-btn sh-sm ml-2 mr-1"
                type="button"
              >
                +
              </button>
              <button onClick={() => delFieldMap(i, groundhoggConf, setGroundhoggConf)} className="icn-btn sh-sm ml-1" type="button" aria-label="btn">
                <span className="btcd-icn icn-trash-2" />
              </button>
            </>
          )
        }
      </div>
    </div>
  )
}
