import { useRecoilValue } from 'recoil'
import { $bits } from '../../../GlobalStates'
import TrashIcn from '../../../Icons/TrashIcn'
import { __ } from '../../../Utils/i18nwrap'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import MtInput from '../../Utilities/MtInput'
import { addFieldMap, delFieldMap, handleCustomValue, handleFieldMapping } from '../IntegrationHelpers/IntegrationHelpers'

export default function ZohoCRMFieldMap({ i, formFields, uploadFields, field, crmConf, setCrmConf, tab }) {
  const module = tab === 0 ? crmConf.module : crmConf.relatedlists?.[tab - 1]?.module
  const layout = tab === 0 ? crmConf.layout : crmConf.relatedlists?.[tab - 1]?.layout

  let isNotRequired

  if (uploadFields) {
    isNotRequired = field.zohoFormField === '' || crmConf.default.layouts?.[module]?.[layout]?.requiredFileUploadFields?.indexOf(field.zohoFormField) === -1
  } else {
    isNotRequired = field.zohoFormField === '' || crmConf.default.layouts?.[module]?.[layout]?.required?.indexOf(field.zohoFormField) === -1
  }

  const bits = useRecoilValue($bits)
  const { isPro } = bits

  return (
    <div
      className="flx mt-2 mr-1"
    >
      <div className="flx integ-fld-wrp">
        <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(ev, i, crmConf, setCrmConf, uploadFields, tab)}>
          <option value="">{__('Select Field', 'bitform')}</option>
          <optgroup label="Form Fields">

            {
              uploadFields ? formFields.map(f => f.type === 'file-up' && <option key={`ff-zhcrm-${f.key}`} value={f.key}>{f.name}</option>) : formFields.map(f => f.type !== 'file-up' && <option key={`ff-zhcrm-${f.key}`} value={f.key}>{f.name}</option>)
            }
          </optgroup>
          {!uploadFields
          && (
            <>
              <option value="custom">{__('Custom...', 'bitform')}</option>
              <optgroup label={`General Smart Codes ${isPro ? '' : '(PRO)'}`}>
                {isPro && SmartTagField?.map(f => (
                  <option key={`ff-rm-${f.name}`} value={f.name}>
                    {f.label}
                  </option>
                ))}
              </optgroup>
            </>
          )}
        </select>

        {field.formField === 'custom' && <MtInput onChange={e => handleCustomValue(e, i, crmConf, setCrmConf, tab)} label={__('Custom Value', 'bitform')} className="mr-2" type="text" value={field.customValue} placeholder={__('Custom Value', 'bitform')} />}

        <select className="btcd-paper-inp" disabled={!isNotRequired} name="zohoFormField" value={field.zohoFormField || ''} onChange={(ev) => handleFieldMapping(ev, i, crmConf, setCrmConf, uploadFields, tab)}>
          <option value="">{__('Select Field', 'bitform')}</option>
          {
            uploadFields ? crmConf.default.layouts?.[module]?.[layout]?.fileUploadFields && Object.keys(crmConf.default.layouts[module][layout].fileUploadFields).filter(fld => fld.required !== true).map(fieldApiName => (
              isNotRequired
                ? !crmConf.default.layouts[module][layout].fileUploadFields[fieldApiName].required && (
                  <option key={fieldApiName} value={fieldApiName}>
                    {crmConf.default.layouts[module][layout].fileUploadFields[fieldApiName].display_label}
                  </option>
                )
                : (
                  <option key={fieldApiName} value={fieldApiName}>
                    {crmConf.default.layouts[module][layout].fileUploadFields[fieldApiName].display_label}
                  </option>
                )
            )) : crmConf.default.layouts?.[module]?.[layout]?.fields && Object.keys(crmConf.default.layouts[module][layout].fields).filter(fld => fld.required !== true).map(fieldApiName => (
              isNotRequired
                ? !crmConf.default.layouts[module][layout].fields[fieldApiName].required && (
                  <option key={fieldApiName} value={fieldApiName}>
                    {crmConf.default.layouts[module][layout].fields[fieldApiName].display_label}
                  </option>
                ) : (
                  <option key={fieldApiName} value={fieldApiName}>
                    {crmConf.default.layouts[module][layout].fields[fieldApiName].display_label}
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
              onClick={() => addFieldMap(i, crmConf, setCrmConf, uploadFields, tab)}
              className="icn-btn sh-sm ml-2 mr-1"
              type="button"
            >
              +
            </button>
            <button onClick={() => delFieldMap(i, crmConf, setCrmConf, uploadFields, tab)} className="icn-btn sh-sm ml-1" type="button" aria-label="btn">
              <TrashIcn />
            </button>
          </>
        )
      }
    </div>
  )
}
