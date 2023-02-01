import { useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { __ } from '../../Utils/i18nwrap'
import SingleInput from '../Utilities/SingleInput'
import SingleToggle from '../Utilities/SingleToggle'
import SelectBox2 from '../Utilities/SelectBox2'
import Back2FldList from './Back2FldList'
import { $fields, $selectedFieldId } from '../../GlobalStates'
import { deepCopy } from '../../Utils/Helpers'

export default function ButtonSettings() {
  const fldKey = useRecoilValue($selectedFieldId)
  const [fields, setFields] = useRecoilState($fields)
  const fieldData = deepCopy(fields[fldKey])
  const [error, seterror] = useState({})
  const { txt, align, fulW, btnSiz, btnTyp } = fieldData

  const pos = [
    { name: __('Left', 'bitform'), value: 'left' },
    { name: __('Center', 'bitform'), value: 'center' },
    { name: __('Right', 'bitform'), value: 'right' },
  ]
  const type = [
    { name: 'Submit', value: 'submit' },
    { name: 'Reset', value: 'reset' },
    { name: 'Button', value: 'button' },
  ]
  function setSubBtnTxt(e) {
    fieldData.txt = e.target.value

    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  function setBtnTyp(e) {
    fieldData.btnTyp = e.target.value
    if (fieldData.btnTyp === 'submit' && checkSubmitBtn()) {
      seterror({ btnTyp: __('Already have a submit button') })
      return
    }

    if (error.btnTyp) {
      seterror({ btnTyp: '' })
    }
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  function setButtonAlign(e) {
    fieldData.align = e.target.value
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  const checkSubmitBtn = () => {
    const btns = Object.values(fields).filter(fld => fld.typ === 'button' && fld.btnTyp === 'submit')
    return btns.length >= 1
  }
  function setFulW(e) {
    fieldData.fulW = e.target.checked
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  function setBtnSiz(e) {
    if (e.target.checked) {
      fieldData.btnSiz = 'sm'
    } else {
      fieldData.btnSiz = 'md'
    }
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  return (
    <div className="ml-2 mr-4">
      <Back2FldList />
      <div>
        <span className="font-w-m">{__('Field Type : ', 'bitform')}</span>
        {__('Button', 'bitform')}
      </div>
      <SingleInput inpType="text" title={__('Submit Button Text:', 'bitform')} value={txt} action={setSubBtnTxt} />
      <SelectBox2 title={__('Button Align:', 'bitform')} options={pos} value={align} action={setButtonAlign} />
      <SelectBox2 title={__('Button Type:', 'bitform')} options={type} value={btnTyp} action={setBtnTyp} />
      { error.btnTyp && <span style={{ color: 'red' }}>{error.btnTyp}</span>}
      <SingleToggle title={__('Full Width Button:', 'bitform')} action={setFulW} isChecked={fulW} className="mt-5" />
      <SingleToggle title={__('Small Button:', 'bitform')} action={setBtnSiz} isChecked={btnSiz === 'sm'} className="mt-5" />
    </div>
  )
}
