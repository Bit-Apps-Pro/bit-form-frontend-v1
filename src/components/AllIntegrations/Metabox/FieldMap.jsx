import { useRecoilValue } from 'recoil'
import { $bits } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import MtInput from '../../Utilities/MtInput'
import { addFieldMap, delFieldMap, handleFieldMapping } from './MetaboxHelperFunction'

export default function FieldMap({ i, type, formFields, field, dataConf, setDataConf, customFields, fieldType }) {
  const bits = useRecoilValue($bits)
  const { isPro } = bits

  const fldType = {
    metabox: {
      propName: 'metabox_map',
      fldName: 'metaboxField',
    },
    post: {
      propName: 'post_map',
      fldName: 'postField',
    },
    metaboxFile: {
      propName: 'metabox_file_map',
      fldName: 'metaboxFileUpload',
    },
  }

  const { propName, fldName } = fldType[type]

  const handleCustomValue = (event, indx) => {
    const newConf = { ...dataConf }
    newConf[propName][indx].customValue = event.target.value
    setDataConf(newConf)
  }

  const isRequired = !!customFields.find(fl => fl.key === field[fldName] && fl.required)

  return (
    <div className="flx mt-2 mr-1">
      <div className="flx integ-fld-wrp">
        <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(propName, ev, i, dataConf, setDataConf)}>
          <option value="">{__('Select Field', 'bitform')}</option>
          <optgroup label="Form Fields">

            {type === 'post' ? (
              <>

                { formFields.map(f => f.type !== 'file-up' && <option key={`ff-zhcrm-${f.key}`} value={f.key}>{f.name}</option>)}

                <option value="custom">{__('Custom...', 'bitform')}</option>
              </>
            ) : (
              <>
                {
                  fieldType === 'file'
                    ? formFields.map(f => f.type === 'file-up' && <option key={`ff-zhcrm-${f.key}`} value={f.key}>{f.name}</option>)
                    : formFields.map(f => f.type !== 'file-up' && <option key={`ff-zhcrm-${f.key}`} value={f.key}>{f.name}</option>)
                }
                {fieldType !== 'file' && <option value="custom">{__('Custom...', 'bitform')}</option>}
              </>
            )}
          </optgroup>
          {fieldType !== 'file'
                 && (
                   <optgroup label={`General Smart Codes ${isPro ? '' : '(PRO)'}`}>
                     {isPro && SmartTagField?.map(f => (
                       <option key={`ff-rm-${f.name}`} value={f.name}>
                         {f.label}
                       </option>
                     ))}
                   </optgroup>
                 )}

        </select>
        {field.formField === 'custom' && <MtInput onChange={e => handleCustomValue(e, i)} label={__('Custom Value', 'bitform')} className="mr-2" type="text" value={field.customValue} placeholder={__('Custom Value', 'bitform')} />}
        <>
          <select className="btcd-paper-inp" name={fldName} value={field[fldName] || ''} onChange={(ev) => handleFieldMapping(propName, ev, i, dataConf, setDataConf)} disabled={isRequired}>
            <option value="">{__('Select Field', 'bitform')}</option>
            {
              customFields?.map(header => (
                <option key={`${Math.random()}-1`} value={header.key}>
                  {`${header.name}`}
                </option>
              ))
            }
          </select>
        </>

      </div>

      {!isRequired
        && (
          <>
            <button
              onClick={() => addFieldMap(propName, i, dataConf, setDataConf)}
              className="icn-btn sh-sm ml-2 mr-1"
              type="button"
            >
              +
            </button>
            <button onClick={() => delFieldMap(propName, i, dataConf, setDataConf)} className="icn-btn sh-sm ml-1" type="button" aria-label="btn">
              <span className="btcd-icn icn-trash-2" />
            </button>
          </>
        )}

    </div>
  )
}
