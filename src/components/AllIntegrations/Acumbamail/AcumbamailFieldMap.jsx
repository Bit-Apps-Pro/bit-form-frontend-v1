import { useRecoilValue } from 'recoil'
import { $bits } from '../../../GlobalStates'
import TrashIcn from '../../../Icons/TrashIcn'
import { __ } from '../../../Utils/i18nwrap'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import MtInput from '../../Utilities/MtInput'
import { addFieldMap, delFieldMap, handleCustomValue, handleFieldMapping } from '../IntegrationHelpers/MailChimpIntegrationHelpers'

export default function AcumbamailFieldMap({ i, formFields, field, acumbamailConf, setAcumbamailConf }) {
  const bits = useRecoilValue($bits)
  const { isPro } = bits
  const isRequiredFld = acumbamailConf.default.allFields[acumbamailConf.listId]?.required?.includes(field.acumbamailFormField)
  const requiredFlds = acumbamailConf.default.allFields?.[acumbamailConf.listId]?.fields && (Object.entries(acumbamailConf.default.allFields?.[acumbamailConf.listId]?.fields).filter(listField => listField[1].required === true) || [])
  const nonRequiredFlds = acumbamailConf.default.allFields?.[acumbamailConf.listId]?.fields && (Object.entries(acumbamailConf.default.allFields?.[acumbamailConf.listId]?.fields).filter(listField => listField[1].required === false) || [])

  return (
    <div
      className="flx mt-2 mr-1"
    >
      <div className="flx integ-fld-wrp">
        <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(ev, i, acumbamailConf, setAcumbamailConf)}>
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

        {field.formField === 'custom' && <MtInput onChange={e => handleCustomValue(e, i, acumbamailConf, setAcumbamailConf)} label={__('Custom Value', 'bitform')} className="mr-2" type="text" value={field.customValue} placeholder={__('Custom Value', 'bitform')} />}

        <select className="btcd-paper-inp" name="acumbamailFormField" disabled={i < 1} value={field.acumbamailFormField || ''} onChange={(ev) => handleFieldMapping(ev, i, acumbamailConf, setAcumbamailConf)}>
          <option value="">{__('Select Field', 'bitform')}</option>
          {
            isRequiredFld && requiredFlds && requiredFlds.map((listField, indx) => (
              (
                <option key={`mchimp-${indx * 2}`} value={listField[0]}>
                  {listField[0]}

                </option>
              )
            ))
          }
          {
            !isRequiredFld && nonRequiredFlds && nonRequiredFlds.map((listField, indx) => (
              (
                <option key={`mchimp-${indx * 2}`} value={listField[0]}>
                  {listField[0]}
                </option>
              )
            ))
          }
        </select>
      </div>

      {
        !isRequiredFld && (
          <>
            <button
              onClick={() => addFieldMap(i, acumbamailConf, setAcumbamailConf)}
              className="icn-btn sh-sm ml-2 mr-1"
              type="button"
            >
              +
            </button>
            <button onClick={() => delFieldMap(i, acumbamailConf, setAcumbamailConf)} className="icn-btn sh-sm" type="button" aria-label="btn">
              <TrashIcn />
            </button>
          </>
        )
      }
    </div>
  )
}
