import { useRecoilValue } from 'recoil'
import { $bits } from '../../../GlobalStates'
import TrashIcn from '../../../Icons/TrashIcn'
import { __ } from '../../../Utils/i18nwrap'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import MtInput from '../../Utilities/MtInput'
import { generateMappedField } from './GetgistCommonFunc'

export default function GetgistFieldMap({ i, formFields, field, getgistConf, setGetgistConf }) {
  const bits = useRecoilValue($bits)
  const { isPro } = bits

  if (getgistConf?.field_map?.length === 1 && field?.getgistFormField === '') {
    const newConf = { ...getgistConf }
    const tmp = generateMappedField(newConf)
    newConf.field_map = tmp
    setGetgistConf(newConf)
  }
  const addFieldMap = (indx) => {
    const newConf = { ...getgistConf }
    newConf.field_map.splice(indx, 0, {})
    setGetgistConf(newConf)
  }

  const delFieldMap = (indx) => {
    const newConf = { ...getgistConf }
    if (newConf.field_map.length > 1) {
      newConf.field_map.splice(indx, 1)
    }
    setGetgistConf(newConf)
  }

  const handleFieldMapping = (event, indx) => {
    const newConf = { ...getgistConf }
    newConf.field_map[indx][event.target.name] = event.target.value

    if (event.target.value === 'custom') {
      newConf.field_map[indx].customValue = ''
    }
    setGetgistConf(newConf)
  }

  const handleCustomValue = (event, indx) => {
    const newConf = { ...getgistConf }
    newConf.field_map[indx].customValue = event.target.value
    setGetgistConf(newConf)
  }
  const requiredFlds = getgistConf?.gistFields.filter(fld => fld.required === true) || []
  const nonRequiredFlds = getgistConf?.gistFields.filter(fld => fld.required === false) || []
  return (
    <div
      className="flx mt-2 mr-1"
    >
      <div className="flx integ-fld-wrp">
        <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(ev, i)}>
          <option value="">{__('Select Field', 'bitform')}</option>
          <optgroup label="Form Fields">
            {
              formFields.map(f => f.type !== 'file' && <option key={`ff-getgist-${f.key}`} value={f.key}>{f.name}</option>)
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

        {field.formField === 'custom' && <MtInput onChange={e => handleCustomValue(e, i)} label={__('Custom Value', 'bitform')} className="mr-2" type="text" value={field.customValue} placeholder={__('Custom Value', 'bitform')} />}

        <select className="btcd-paper-inp" disabled={i < requiredFlds.length} name="getgistFormField" value={i < requiredFlds.length ? (requiredFlds[i]?.key || '') : (field.getgistFormField || '')} onChange={(ev) => handleFieldMapping(ev, i, getgistConf, setGetgistConf)}>
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
        i >= requiredFlds?.length && (
          <>
            <button
              onClick={() => addFieldMap(i)}
              className="icn-btn sh-sm ml-2"
              type="button"
            >
              +
            </button>
            <button onClick={() => delFieldMap(i)} className="icn-btn sh-sm ml-2" type="button" aria-label="btn">
              <TrashIcn />
            </button>
          </>
        )
      }

    </div>
  )
}
