import { __ } from '../../Utils/i18nwrap'
import MtInput from '../Utilities/MtInput'
import { handleFieldMapping } from './HelperFunction'

export default function FieldMap({ i, type, formFields, field, dataConf, setDataConf, customFields }) {
  const fldType = {
    login: {
      propName: 'login_map',
      fldName: 'loginField',
    },
    reset: {
      propName: 'reset_map',
      fldName: 'resetField',
    },
    forgot: {
      propName: 'forgot_map',
      fldName: 'forgotField',
    },
  }
  const { propName, fldName } = fldType[type]

  const isRequired = !!customFields.find(fl => fl.key === field[fldName] && fl.required)

  const handleCustomValue = (event, indx) => {
    const newConf = { ...dataConf }
    newConf[type][propName][indx].customValue = event.target.value
    setDataConf(newConf)
  }

  return (
    <div className="flx mt-2 mr-1">
      <div className="flx integ-fld-wrp">
        <select className="btcd-paper-inp w-5 mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(type, propName, ev, i, dataConf, setDataConf)}>
          <option value="">{__('Select Field', 'bitform')}</option>
          <>
            { formFields.map(f => f.type !== 'file-up33' && <option key={`ff-zhcrm-${f.key}`} value={f.key}>{f.name}</option>)}
            <option value="custom">{__('Custom...', 'bitform')}</option>
          </>

        </select>
        {field.formField === 'custom' && <MtInput onChange={e => handleCustomValue(e, i)} label={__('Custom Value', 'bitform')} className="mr-2" type="text" value={field.customValue} placeholder={__('Custom Value', 'bitform')} />}

        <>
          <select className="btcd-paper-inp w-5" name={fldName} value={field[fldName] || ''} onChange={(ev) => handleFieldMapping(type, propName, ev, i, dataConf, setDataConf)} disabled={isRequired}>
            <option value="">{__('Select Field', 'bitform')}</option>
            {
              customFields?.map(header => (
                <option key={`${header.key}-1`} value={header.key}>
                  {`${header.name}`}
                </option>
              ))
            }
          </select>
        </>

      </div>
      {/*
      {type !== 'forgot' && (
        <>
          <button
            onClick={() => addFieldMap(type, propName, i, dataConf, setDataConf)}
            className="icn-btn sh-sm ml-2 mr-1"
            type="button"
          >
            +
          </button>
          <button onClick={() => delFieldMap(type, propName, i, dataConf, setDataConf)} className="icn-btn sh-sm ml-1" type="button" aria-label="btn">
            <TrashIcn />
          </button>
        </>
      )} */}

    </div>
  )
}
