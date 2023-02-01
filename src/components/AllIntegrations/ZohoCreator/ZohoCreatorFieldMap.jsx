import { useRecoilValue } from 'recoil'
import { $bits } from '../../../GlobalStates'
import TrashIcn from '../../../Icons/TrashIcn'
import { __ } from '../../../Utils/i18nwrap'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import MtInput from '../../Utilities/MtInput'
import { addFieldMap, delFieldMap, handleCustomValue, handleFieldMapping } from '../IntegrationHelpers/IntegrationHelpers'

export default function ZohoCreatorFieldMap({ i, formFields, uploadFields, field, creatorConf, setCreatorConf }) {
  const { applicationId, formId } = creatorConf
  let isNotRequired

  if (uploadFields) isNotRequired = field.zohoFormField === '' || creatorConf.default?.fields?.[applicationId]?.[formId]?.requiredFileUploadFields?.indexOf(field.zohoFormField) === -1
  else isNotRequired = field.zohoFormField === '' || creatorConf.default?.fields?.[applicationId]?.[formId]?.required?.indexOf(field.zohoFormField) === -1

  const bits = useRecoilValue($bits)
  const { isPro } = bits
  return (
    <div
      className="flx mt-2 mr-1"
    >
      <div className="flx integ-fld-wrp">
        <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(ev, i, creatorConf, setCreatorConf, uploadFields)}>
          <option value="">{__('Select Field', 'bitform')}</option>
          <optgroup label="Form Fields">
            {
              uploadFields ? formFields.map(f => f.type === 'file-up' && <option key={`ff-zhcrm-${f.key}`} value={f.key}>{f.name}</option>) : formFields.map(f => f.type !== 'file-up' && <option key={`ff-zhcrm-${f.key}`} value={f.key}>{f.name}</option>)
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

        {field.formField === 'custom' && <MtInput onChange={ev => handleCustomValue(ev, i, creatorConf, setCreatorConf)} label={__('Custom Value', 'bitform')} className="mr-2" type="text" value={field.customValue} placeholder={__('Custom Value', 'bitform')} />}

        <select className="btcd-paper-inp" name="zohoFormField" value={field.zohoFormField || ''} disabled={!isNotRequired} onChange={(ev) => handleFieldMapping(ev, i, creatorConf, setCreatorConf, uploadFields)}>
          <option value="">{__('Select Field', 'bitform')}</option>
          {
            uploadFields ? creatorConf.default?.fields?.[applicationId]?.[formId]?.fileUploadFields && Object.values(creatorConf.default.fields[applicationId][formId].fileUploadFields).map(apiField => (
              isNotRequired
                ? apiField.required === false && (
                  <option key={apiField.displayLabel} value={apiField.apiName}>
                    {apiField.displayLabel}
                  </option>
                )
                : (
                  <option key={apiField.displayLabel} value={apiField.apiName}>
                    {apiField.displayLabel}
                  </option>
                )
            ))
              : creatorConf.default?.fields?.[applicationId]?.[formId]?.fields && Object.values(creatorConf.default.fields[applicationId][formId].fields).map(apiField => (
                isNotRequired
                  ? apiField.required === false && (
                    <option key={apiField.displayLabel} value={apiField.apiName}>
                      {apiField.displayLabel}
                    </option>
                  )
                  : (
                    <option key={apiField.displayLabel} value={apiField.apiName}>
                      {apiField.displayLabel}
                    </option>
                  )
              ))
          }
        </select>
      </div>

      {
        isNotRequired && (
          <>
            <button
              onClick={() => addFieldMap(i, creatorConf, setCreatorConf, uploadFields)}
              className="icn-btn sh-sm ml-2 mr-1"
              type="button"
            >
              +
            </button>
            <button onClick={() => delFieldMap(i, creatorConf, setCreatorConf, uploadFields)} className="icn-btn sh-sm ml-1" type="button" aria-label="btn">
              <TrashIcn />
            </button>
          </>
        )
      }
    </div>
  )
}
