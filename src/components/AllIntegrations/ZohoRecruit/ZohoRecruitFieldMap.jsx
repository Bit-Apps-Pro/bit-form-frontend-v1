import { useRecoilValue } from 'recoil'
import { $bits } from '../../../GlobalStates'
import TrashIcn from '../../../Icons/TrashIcn'
import { __ } from '../../../Utils/i18nwrap'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import MtInput from '../../Utilities/MtInput'
import { addFieldMap, delFieldMap, handleCustomValue, handleFieldMapping } from '../IntegrationHelpers/IntegrationHelpers'

export default function ZohoRecruitFieldMap({ i, uploadFields, formFields, field, recruitConf, setRecruitConf, tab }) {
  const module = tab === 0 ? recruitConf.module : recruitConf.relatedlists?.[tab - 1]?.module

  let isNotRequired

  if (uploadFields) {
    isNotRequired = field.zohoFormField === '' || recruitConf.default.moduleData?.[module]?.requiredFileUploadFields?.indexOf(field.zohoFormField) === -1
  } else {
    isNotRequired = field.zohoFormField === '' || recruitConf.default.moduleData?.[module]?.required?.indexOf(field.zohoFormField) === -1
  }

  const bits = useRecoilValue($bits)
  const { isPro } = bits

  return (
    <div
      className="flx mt-2 mr-1"
    >
      <div className="flx integ-fld-wrp">
        <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(ev, i, recruitConf, setRecruitConf, uploadFields, tab)}>

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

        {field.formField === 'custom' && <MtInput onChange={e => handleCustomValue(e, i, recruitConf, setRecruitConf, tab)} label={__('Custom Value', 'bitform')} className="mr-2" type="text" value={field.customValue} placeholder={__('Custom Value', 'bitform')} />}

        <select className="btcd-paper-inp" disabled={!isNotRequired} name="zohoFormField" value={field.zohoFormField || ''} onChange={(ev) => handleFieldMapping(ev, i, recruitConf, setRecruitConf, uploadFields, tab)}>
          <option value="">{__('Select Field', 'bitform')}</option>
          {
            uploadFields
              ? recruitConf.default.moduleData?.[module]?.fileUploadFields && Object.keys(recruitConf.default.moduleData[module].fileUploadFields).map(fieldApiName => (
                isNotRequired
                  ? recruitConf.default.moduleData[module].fileUploadFields[fieldApiName].required === 'false'
                  && (
                    <option key={fieldApiName} value={fieldApiName}>
                      {recruitConf.default.moduleData[module].fileUploadFields[fieldApiName].display_label}
                    </option>
                  )
                  : (
                    <option key={fieldApiName} value={fieldApiName}>
                      {recruitConf.default.moduleData[module].fileUploadFields[fieldApiName].display_label}
                    </option>
                  )
              ))
              : recruitConf.default.moduleData?.[module]?.fields && Object.keys(recruitConf.default.moduleData[module].fields).map(fieldApiName => (
                isNotRequired
                  ? recruitConf.default.moduleData[module].fields[fieldApiName].required === 'false'
                  && (
                    <option key={fieldApiName} value={fieldApiName}>
                      {recruitConf.default.moduleData[module].fields[fieldApiName].display_label}
                    </option>
                  )
                  : (
                    <option key={fieldApiName} value={fieldApiName}>
                      {recruitConf.default.moduleData[module].fields[fieldApiName].display_label}
                    </option>
                  )
              ))
          }
        </select>
      </div>
      <button
        onClick={() => addFieldMap(i, recruitConf, setRecruitConf, uploadFields, tab)}
        className="icn-btn sh-sm ml-2 mr-1"
        type="button"
      >
        +
      </button>
      {
        isNotRequired && (
          <button onClick={() => delFieldMap(i, recruitConf, setRecruitConf, uploadFields, tab)} className="icn-btn sh-sm ml-1" type="button" aria-label="btn">
            <TrashIcn />
          </button>
        )
      }
    </div>
  )
}
