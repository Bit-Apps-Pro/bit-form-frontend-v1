import { useRecoilState, useRecoilValue } from 'recoil'
import { $fields, $selectedFieldId } from '../../GlobalStates'
import { deepCopy } from '../../Utils/Helpers'
import { __ } from '../../Utils/i18nwrap'
import Back2FldList from './Back2FldList'

export default function ReCaptchaSettigns() {
  const fldKey = useRecoilValue($selectedFieldId)
  const [fields, setFields] = useRecoilState($fields)
  const fieldData = deepCopy(fields[fldKey])
  const onInput = ({ target: { name, value } }) => {
    fieldData[name] = value
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  return (
    <div className="ml-2 mr-4">
      <Back2FldList />
      <div className="mb-2">
        <span className="font-w-m">
          {__('Field Type :', 'bitform')}
        </span>
        {__('reCAPTCHA', 'bitform')}
      </div>
      <div>
        <label htmlFor="recap-thm">
          {__('Theme', 'bitform')}
          <select onChange={onInput} name="theme" value={fieldData.theme} className="btcd-paper-inp mt-1">
            <option value="dark">{__('Dark', 'bitform')}</option>
            <option value="light">{__('Light', 'bitform')}</option>
          </select>
        </label>
      </div>
    </div>
  )
}
