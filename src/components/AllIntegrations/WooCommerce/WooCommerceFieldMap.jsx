import { useRecoilValue } from 'recoil'
import { $bits } from '../../../GlobalStates'
import TrashIcn from '../../../Icons/TrashIcn'
import { deepCopy } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import MtInput from '../../Utilities/MtInput'

export default function WooCommerceFieldMap({ i, formFields, field, wcConf, setWcConf, uploadFields }) {
  const isRequired = field.required === true

  const bits = useRecoilValue($bits)
  const { isPro } = bits

  const addFieldMap = (indx) => {
    // const newConf = deepCopy(wcConf)
    const newConf = { ...wcConf }
    uploadFields ? newConf.upload_field_map.splice(indx, 0, {}) : newConf.field_map.splice(indx, 0, {})

    setWcConf(newConf)
  }

  const delFieldMap = (indx) => {
    const newConf = deepCopy(wcConf)
    if (uploadFields) {
      if (newConf.upload_field_map.length > 1) {
        newConf.upload_field_map.splice(indx, 1)
      }
    } else if (newConf.field_map.length > 1) {
      newConf.field_map.splice(indx, 1)
    }

    setWcConf(newConf)
  }

  const handleFieldMapping = (event, indx) => {
    const newConf = deepCopy(wcConf)

    if (uploadFields) newConf.upload_field_map[indx][event.target.name] = event.target.value
    else newConf.field_map[indx][event.target.name] = event.target.value

    if (event.target.value === 'custom') {
      newConf.field_map[indx].customValue = ''
    }

    setWcConf(newConf)
  }

  const handleCustomValue = (event, indx) => {
    const newConf = deepCopy(wcConf)
    if (uploadFields) newConf.upload_field_map[indx].customValue = event.target.value
    else newConf.field_map[indx].customValue = event.target.value
    setWcConf(newConf)
  }

  return (
    <div
      className="flx mt-2 mr-1"
    >
      <div className="flx integ-fld-wrp">
        <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(ev, i)}>
          <option value="">{__('Select Field', 'bitform')}</option>
          <optgroup label="Form Fields">
            {
              uploadFields
                ? formFields.map(f => f.type === 'file-up' && <option key={`ff-zhcrm-${f.key}`} value={f.key}>{f.name}</option>)
                : formFields.map(f => f.type !== 'file-up' && <option key={`ff-zhcrm-${f.key}`} value={f.key}>{f.name}</option>)
            }
          </optgroup>
          {!uploadFields && <option value="custom">{__('Custom...', 'bitform')}</option>}
          {!uploadFields && (
            <optgroup label={`General Smart Codes ${isPro ? '' : '(PRO)'}`}>
              {' '}
              {isPro && SmartTagField.map(f => <option key={`ff-zhcrm-${f.name}`} value={f.name}>{f.label}</option>)}
            </optgroup>
          )}
        </select>

        {field.formField === 'custom' && <MtInput onChange={e => handleCustomValue(e, i)} label={__('Custom Value', 'bitform')} className="mr-2" type="text" value={field.customValue} placeholder={__('Custom Value', 'bitform')} />}

        <select className="btcd-paper-inp" name="wcField" value={field.wcField || ''} onChange={(ev) => handleFieldMapping(ev, i)} disabled={isRequired}>
          <option value="">{__('Select Field', 'bitform')}</option>
          {
            Object.values(wcConf.default.fields[wcConf.module][uploadFields ? 'uploadFields' : 'fields']).map(fld => {
              if (isRequired) {
                if (fld.required && fld.fieldKey === field.wcField) {
                  return (
                    <option key={`${fld.fieldKey}-1`} value={fld.fieldKey}>
                      {fld.fieldName}
                    </option>
                  )
                }
              } else if (!fld.required) {
                return (
                  <option key={`${fld.fieldKey}-1`} value={fld.fieldKey}>
                    {fld.fieldName}
                  </option>
                )
              }
            })
          }
        </select>
      </div>
      {!isRequired && (
        <>
          <button
            onClick={() => addFieldMap(i)}
            className="icn-btn sh-sm ml-2 mr-1"
            type="button"
          >
            +
          </button>
          <button onClick={() => delFieldMap(i)} className="icn-btn sh-sm ml-2" type="button" aria-label="btn">
            <TrashIcn />
          </button>
        </>
      )}
    </div>
  )
}
