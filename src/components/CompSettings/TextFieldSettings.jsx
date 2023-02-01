/* eslint-disable jsx-a11y/label-has-associated-control */
import { memo } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $bits, $fields, $selectedFieldId } from '../../GlobalStates'
import { deepCopy } from '../../Utils/Helpers'
import { __ } from '../../Utils/i18nwrap'
import predefinedPatterns from '../../Utils/StaticData/patterns.json'
import CopyText from '../Utilities/CopyText'
import SingleInput from '../Utilities/SingleInput'
import SingleToggle from '../Utilities/SingleToggle'
import TableCheckBox from '../Utilities/TableCheckBox'
import Back2FldList from './Back2FldList'
import ErrorMessageSettings from './CompSettingsUtils/ErrorMessageSettings'
import FieldLabelSettings from './CompSettingsUtils/FieldLabelSettings'

function TextFieldSettings() {
  console.log('%c $render TextFieldSettings', 'background:gray;padding:3px;border-radius:5px;color:white')
  const bits = useRecoilValue($bits)
  const fldKey = useRecoilValue($selectedFieldId)
  const [fields, setFields] = useRecoilState($fields)
  const fieldData = deepCopy(fields[fldKey])
  const isRequired = fieldData.valid.req || false
  const isAutoComplete = fieldData.ac === 'on'
  const adminLabel = fieldData.adminLbl || ''
  const placeholder = fieldData.ph || ''
  const min = fieldData.mn || ''
  const max = fieldData.mx || ''
  const regexr = fieldData.valid.regexr || ''
  const flags = fieldData.valid.flags || ''

  const generateBackslashPattern = str => str.replaceAll('$_bf_$', '\\')
  const escapeBackslashPattern = str => str.replaceAll('\\', '$_bf_$')

  function setRequired(e) {
    if (e.target.checked) {
      const tmp = { ...fieldData.valid }
      tmp.req = true
      fieldData.valid = tmp
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.req) fieldData.err.req = {}
      fieldData.err.req.dflt = '<p>This field is required</p>'
      fieldData.err.req.show = true
    } else {
      delete fieldData.valid.req
    }
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  function setAutoComplete(e) {
    if (e.target.checked) {
      fieldData.ac = 'on'
    } else {
      delete fieldData.ac
    }
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  function setAdminLabel(e) {
    if (e.target.value === '') {
      delete fieldData.adminLbl
    } else {
      fieldData.adminLbl = e.target.value
    }
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  function setPlaceholder(e) {
    if (e.target.value === '') {
      delete fieldData.ph
    } else {
      fieldData.ph = e.target.value
    }
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  function setMin(e) {
    if (e.target.value === '') {
      delete fieldData.mn
    } else {
      fieldData.mn = e.target.value
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.mn) fieldData.err.mn = {}
      fieldData.err.mn.dflt = `<p>Minimum number is ${e.target.value}<p>`
      fieldData.err.mn.show = true
    }
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  function setMax(e) {
    if (e.target.value === '') {
      delete fieldData.mx
    } else {
      fieldData.mx = e.target.value
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.mx) fieldData.err.mx = {}
      fieldData.err.mx.dflt = `<p>Maximum number is ${e.target.value}</p>`
      fieldData.err.mx.show = true
    }
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  const setRegexr = e => {
    if (!bits.isPro) return
    const { value } = e.target
    if (value === '') {
      delete fieldData.valid.regexr
    } else {
      const val = escapeBackslashPattern(value)
      fieldData.valid.regexr = val
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.regexr) fieldData.err.regexr = {}
      const ifPredefined = predefinedPatterns.find(opt => opt.val === val)
      fieldData.err.regexr.dflt = `<p>${ifPredefined ? ifPredefined.msg : 'Pattern not matched'}</p>`
      fieldData.err.regexr.show = true
      if (fieldData.typ === 'password') {
        delete fieldData.valid.validations
      }
    }
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  const setFlags = e => {
    if (!bits.isPro) return
    if (e.target.value === '') {
      delete fieldData.valid.flags
    } else {
      fieldData.valid.flags = e.target.value
    }
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  const generatePasswordPattern = validations => `^${validations.digit || ''}${validations.lower || ''}${validations.upper || ''}${validations.special || ''}.{${validations?.limit?.mn || 0},${validations?.limit?.mx || ''}}$`

  const generatePasswordErrMsg = validations => `<p>Password must consist at least ${Object.keys(validations).map(vld => {
    if (vld === 'digit') {
      return 'one number'
    } if (vld === 'lower') {
      return 'one lowercase character'
    } if (vld === 'upper') {
      return 'one uppercase character'
    } if (vld === 'special') {
      return 'one special character'
    } if (vld === 'limit') {
      return `${validations.limit.mn}${validations.limit.mx ? ` to ${validations.limit.mx}` : ''} characters`
    }
  }).join(', ').replace(/, ([^,]*)$/, ' and $1')}</p>`

  const setPasswordValidation = e => {
    if (!bits.isPro) return
    const { checked, name, value } = e.target
    if (!fieldData.err) fieldData.err = {}
    if (!fieldData.err.regexr) fieldData.err.regexr = {}
    if (!fieldData.valid.validations) fieldData.valid.validations = {}
    const { validations } = fieldData.valid
    if (checked) {
      if (name === 'limit') {
        validations.limit = {}
        validations.limit.mn = 8
        validations.limit.mx = 32
      } else {
        validations[name] = value
      }
    } else {
      delete validations[name]
    }
    fieldData.valid.validations = validations

    if (Object.keys(validations).length) {
      fieldData.valid.regexr = generatePasswordPattern(validations)
      fieldData.err.regexr.dflt = generatePasswordErrMsg(validations)
      fieldData.err.regexr.show = true
    } else {
      fieldData.err.regexr.dflt = '<p>Pattern not matched</p>'
      delete fieldData.valid.regexr
      delete fieldData.err.regexr.show
    }

    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  const setPasswordLimit = e => {
    if (!bits.isPro) return
    const { name, value } = e.target
    const { validations } = fieldData.valid
    if (value) {
      fieldData.valid.validations.limit[name] = value
    } else {
      delete fieldData.valid.validations.limit[name]
    }

    fieldData.valid.regexr = generatePasswordPattern(validations)

    fieldData.err.regexr.dflt = generatePasswordErrMsg(validations)

    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  return (
    <div className="mr-4 ml-2">
      <Back2FldList />
      <div className="mb-2">
        <span className="font-w-m">Field Type :</span>
        {fieldData.typ.charAt(0).toUpperCase() + fieldData.typ.slice(1)}
      </div>
      <div className="flx">
        <span className="font-w-m mr-1">{__('Field Key : ', 'bitform')}</span>
        <CopyText value={fldKey} className="field-key-cpy m-0 w-7" />
      </div>
      <FieldLabelSettings />
      <SingleInput inpType="text" title={__('Admin Label:', 'bitform')} value={adminLabel} action={setAdminLabel} />
      <SingleToggle title={__('Required:', 'bitform')} action={setRequired} isChecked={isRequired} className="mt-3" />
      {
        fieldData?.valid?.req && (
          <ErrorMessageSettings
            type="req"
            title="Error Message"
            tipTitle="By enabling this feature, user will see the error message when input is empty"
          />
        )
      }
      {fieldData.typ.match(/^(text|url|password|number|email|)$/) && <SingleToggle title={__('Auto Fill:', 'bitform')} action={setAutoComplete} isChecked={isAutoComplete} className="mt-3" />}
      {fieldData.typ.match(/^(username|text|url|textarea|password|number|email|)$/) && <SingleInput inpType="text" title={__('Placeholder:', 'bitform')} value={placeholder} action={setPlaceholder} />}
      {
        fieldData.typ === 'number' && (
          <>
            <SingleInput inpType="number" title={__('Min Value:', 'bitform')} value={min} action={setMin} className="w-10" />
            {fieldData.mn && (
              <ErrorMessageSettings
                type="mn"
                title="Min Error Message"
                tipTitle={`By enabling this feature, user will see the error message when input number is less than ${fieldData.mn}`}
              />
            )}
            <SingleInput inpType="number" title={__('Max Value:', 'bitform')} value={max} action={setMax} className="w-10" />
            {fieldData.mx && (
              <ErrorMessageSettings
                type="mx"
                title="Max Error Message"
                tipTitle={`By enabling this feature, user will see the error message when input number is greater than ${fieldData.mx}`}
              />
            )}
          </>
        )
      }
      {
        fieldData.typ.match(/^(url|number|email|)$/) && (
          <ErrorMessageSettings
            type="invalid"
            title="Invalid Error Message"
            tipTitle={`By enabling this feature, user will see the error message when input value is not any ${fieldData.typ}`}
          />
        )
      }
      {
        fieldData.typ === 'password' && (
          <div>
            <div className="flx mt-2 mb-2">
              <h4 className="m-0">{__('Validations:', 'bitform')}</h4>
              {!bits.isPro && <span className="pro-badge ml-2">{__('Pro', 'bitform')}</span>}
            </div>
            <TableCheckBox className="w-10" name="digit" checked={fieldData.valid?.validations?.digit || false} value="(?=.*[0-9])" title={__('At least one digit (0-9)', 'bitform')} onChange={setPasswordValidation} disabled={!bits.isPro} />
            <TableCheckBox className="w-10 mt-2" name="lower" checked={fieldData.valid?.validations?.lower || false} value="(?=.*[a-z])" title={__('At least one lowercase character (a-z)', 'bitform')} onChange={setPasswordValidation} disabled={!bits.isPro} />
            <TableCheckBox className="w-10 mt-2" name="upper" checked={fieldData.valid?.validations?.upper || false} value="(?=.*[A-Z])" title={__('At least one uppercase character (A-Z)', 'bitform')} onChange={setPasswordValidation} disabled={!bits.isPro} />
            <TableCheckBox className="w-10 mt-2" name="special" checked={fieldData.valid?.validations?.special || false} value="(?=.*[~!@#$%^&*(){}[$_bf_$]<>+$_bf_$-_=$_bf_$$_bf_$/|;:,.])" title={__('At least one special character (~!@#$%^&*(){}[]<>+-_=/\\|;:,.)', 'bitform')} onChange={setPasswordValidation} disabled={!bits.isPro} />
            <TableCheckBox className="w-10 mt-2" name="limit" checked={fieldData.valid?.validations?.limit || false} value=".{8,32}" title={__('Limit Password Length', 'bitform')} onChange={setPasswordValidation} disabled={!bits.isPro} />
            {fieldData.valid?.validations?.limit && (
              <div>
                <SingleInput inpType="number" name="mn" title={__('Min:', 'bitform')} value={fieldData.valid?.validations?.limit?.mn} action={setPasswordLimit} width={100} className="mr-4" />
                <SingleInput inpType="number" name="mx" title={__('Max:', 'bitform')} value={fieldData.valid?.validations?.limit?.mx} action={setPasswordLimit} width={100} />
              </div>
            )}
          </div>
        )
      }
      {
        fieldData.typ.match(/^(text|url|textarea|password|number|email|username|)$/) && (
          <>
            <div className="flx">
              <div className="w-7 mr-2 mt-3">
                <div className="flx">
                  <h4 className="m-0">{__('Pattern:', 'bitform')}</h4>
                  {!bits.isPro && <span className="pro-badge ml-2">{__('Pro', 'bitform')}</span>}
                </div>
                <input className="btcd-paper-inp mt-1" type="text" placeholder="e.g. ([A-Z])\w+" list="patterns" disabled={!bits.isPro} value={generateBackslashPattern(regexr)} onChange={setRegexr} />
                <datalist id="patterns">
                  {predefinedPatterns.map((opt, i) => <option key={`${i * 2}`} value={generateBackslashPattern(opt.val)}>{opt.lbl}</option>)}
                </datalist>
              </div>
              <SingleInput inpType="text" title={__('Flags:', 'bitform')} value={flags} action={setFlags} placeholder="e.g. g" className="w-2" cls="mt-2" disabled={!bits.isPro} />
            </div>
            {regexr && (
              <ErrorMessageSettings
                type="regexr"
                title="Error Message"
                tipTitle="By enabling this feature, user will see the error message when input value does not match the pattern"
              />
            )}
          </>
        )
      }

      <div className="pos-rel">
        {
          fieldData.typ.match(/^(text|url|textarea|password|number|email|color|date|username|)$/) && (
            <div>
              {!bits.isPro && (
                <div className="pro-blur flx" style={{ height: '100%', left: 0, width: '100%', marginTop: 14 }}>
                  <div className="pro">
                    {__('Available On', 'bitform')}
                    <a href="https://www.bitapps.pro/bit-form" target="_blank" rel="noreferrer">
                      <span className="txt-pro">
                        {' '}
                        {__('Premium', 'bitform')}
                      </span>
                    </a>
                  </div>
                </div>
              )}
              <ErrorMessageSettings
                type="entryUnique"
                title="Validate as Entry Unique"
                tipTitle="Enabling this option will check from the entry database whether its value is duplicate."
                defaultMsg="The value is already taken. Try another."
              />
            </div>
          )
        }
      </div>
      <div className="pos-rel">
        {
          fieldData.typ.match(/^(email|username)$/) && (
            <div>
              {!bits.isPro && (
                <div className="pro-blur flx" style={{ height: '100%', left: 0, width: '100%', marginTop: 14 }}>
                  <div className="pro">
                    {__('Available On', 'bitform')}
                    <a href="https://www.bitapps.pro/bit-form" target="_blank" rel="noreferrer">
                      <span className="txt-pro">
                        {' '}
                        {__('Premium', 'bitform')}
                      </span>
                    </a>
                  </div>
                </div>
              )}
              <ErrorMessageSettings
                type="userUnique"
                title="Validate as User Unique"
                tipTitle="Enabling this option will check from the user database whether its value is duplicate."
                defaultMsg="The value is already taken. Try another."
              />
            </div>
          )
        }
      </div>
    </div>
  )
}

export default memo(TextFieldSettings)
