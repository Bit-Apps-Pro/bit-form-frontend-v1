import { useRecoilValue } from 'recoil'
import { $bits } from '../../../GlobalStates'
import TrashIcn from '../../../Icons/TrashIcn'
import { __ } from '../../../Utils/i18nwrap'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import MtInput from '../../Utilities/MtInput'

export default function MailPoetFieldMap({ i, formFields, field, mailPoetConf, setMailPoetConf }) {
  const isRequired = field.required
  const notResquiredField = mailPoetConf?.default?.fields && Object.values(mailPoetConf?.default?.fields).filter((f => f.required === ''))
  const bits = useRecoilValue($bits)
  const { isPro } = bits
  const addFieldMap = (indx) => {
    const newConf = { ...mailPoetConf }
    newConf.field_map.splice(indx, 0, {})
    setMailPoetConf(newConf)
  }

  const delFieldMap = (indx) => {
    const newConf = { ...mailPoetConf }
    if (newConf.field_map.length > 1) {
      newConf.field_map.splice(indx, 1)
    }
    setMailPoetConf(newConf)
  }

  const handleFieldMapping = (event, indx) => {
    const newConf = { ...mailPoetConf }
    newConf.field_map[indx][event.target.name] = event.target.value

    if (event.target.value === 'custom') {
      newConf.field_map[indx].customValue = ''
    }
    setMailPoetConf(newConf)
  }

  const handleCustomValue = (event, indx) => {
    const newConf = { ...mailPoetConf }
    newConf.field_map[indx].customValue = event.target.value
    setMailPoetConf(newConf)
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
              formFields.map(f => f.type !== 'file-up' && <option key={`ff-zhcrm-${f.key}`} value={f.key}>{f.name}</option>)
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

        <select className="btcd-paper-inp" name="mailPoetField" value={field.mailPoetField} onChange={(ev) => handleFieldMapping(ev, i)} disabled={isRequired}>
          <option value="">{__('Select Field', 'bitform')}</option>
          {isRequired ? mailPoetConf?.default?.fields && Object.values(mailPoetConf.default.fields).map(fld => (
            <option key={`${fld.id}-1`} value={fld.id}>
              {fld.name}
            </option>
          )) : notResquiredField && notResquiredField.map(fld => (
            <option key={`${fld.id}-1`} value={fld.id}>
              {fld.name}
            </option>
          ))}
        </select>
      </div>
      {!isRequired
        && (
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
