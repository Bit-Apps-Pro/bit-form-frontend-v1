import { useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $fields, $selectedFieldId } from '../../../GlobalStates'
import EditIcn from '../../../Icons/EditIcn'
import { deepCopy } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import CheckBoxMini from '../../Utilities/CheckBoxMini'
import Cooltip from '../../Utilities/Cooltip'
import SingleToggle from '../../Utilities/SingleToggle'
import CustomErrorMessageModal from './CustomErrorMessageModal'

export default function UniqField({ type, title, tipTitle, isUnique }) {
  const [errorModal, setErrorModal] = useState(false)
  const fldKey = useRecoilValue($selectedFieldId)
  const [fields, setFields] = useRecoilState($fields)
  const fieldData = deepCopy(fields[fldKey])
  const errMsg = fieldData?.err?.[type]?.custom ? fieldData?.err?.[type]?.msg : fieldData?.err?.[type]?.dflt

  const setCustomErrMsg = e => {
    const { name, checked } = e.target
    if (!fieldData.err) fieldData.err = {}
    if (!fieldData.err[name]) fieldData.err[name] = {}
    if (checked) {
      fieldData.err[name].custom = true
      if (!fieldData.err[name].msg) fieldData.err[name].msg = fieldData.err[name].dflt
    } else {
      delete fieldData.err[name].custom
    }
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  const setShowErrMsg = e => {
    const { name, checked } = e.target

    if (!fieldData.err) fieldData.err = {}
    if (!fieldData.err[type]) fieldData.err[type] = {}
    if (checked) {
      fieldData.err[type].show = true
      const msg = 'That field is taken. Try another'
      if (!fieldData.err[type].dflt) fieldData.err[type].dflt = msg
    } else {
      delete fieldData.err[name].show
    }
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  const openErrorModal = () => {
    if (!fieldData.err) fieldData.err = {}
    if (!fieldData.err[type]) fieldData.err[type] = {}
    fieldData.err[type].custom = true
    if (!fieldData.err[type].msg) fieldData.err[type].msg = fieldData.err[type].dflt
    setTimeout(() => {
      setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
      setErrorModal(true)
    })
  }

  return (
    <div className="err-msg-wrapper">
      <div className="flx flx-between ">
        <h4 className="mt-2 mb-2 flx">
          {__(title, 'bitform')}
          <Cooltip width={250} icnSize={17} className="ml-2">
            <div className="txt-body">{__(tipTitle, 'bitform')}</div>
          </Cooltip>
        </h4>
        <SingleToggle name={type} action={setShowErrMsg} isChecked={fieldData?.err?.[type]?.[isUnique]} />
      </div>
      {fieldData?.err?.[type]?.show && (
        <>
          <div className="flx flx-between mt-1 mb-1 mr-2">
            <div className="flx">
              <CheckBoxMini className=" mr-2" name={type} checked={fieldData?.err?.[type]?.custom || false} title={__('Custom Error Message', 'bitform')} onChange={setCustomErrMsg} />
              <Cooltip width={250} icnSize={17} className="mr-2">
                <div className="txt-body">
                  Check the box to enable the custom error message.
                  <br />
                  Note: You can edit the message by clicking on edit icon.
                </div>
              </Cooltip>
            </div>
            <span
              role="button"
              tabIndex="-1"
              className="cp"
              onClick={openErrorModal}
              onKeyPress={openErrorModal}
            >
              <EditIcn size={19} />
            </span>

          </div>
          <div
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: errMsg }}
            className="err-msg-box mt-2"
          />
        </>
      )}

      <CustomErrorMessageModal
        errorModal={errorModal}
        setErrorModal={setErrorModal}
        type={type}
      />
    </div>
  )
}
