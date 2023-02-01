import produce from 'immer'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $fields, $selectedFieldId } from '../../../GlobalStates'
import { deepCopy } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import Modal from '../../Utilities/Modal'
import TinyMCE from '../../Utilities/TinyMCE'

export default function CustomErrorMessageModal({ errorModal, setErrorModal, type }) {
  const fldKey = useRecoilValue($selectedFieldId)
  const [fields, setFields] = useRecoilState($fields)
  const fld = fields[fldKey]
  const fieldData = deepCopy(fld)
  const errMsg = fieldData?.err?.[type]?.custom ? fieldData?.err?.[type]?.msg : fieldData?.err?.[type]?.dflt
  const [value, setValue] = useState(errMsg)

  useEffect(() => {
    if (errorModal) setValue(errMsg)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorModal])

  const setErrMsg = (name, val) => {
    setFields(prevState => produce(prevState, draft => {
      if (!draft[fldKey].err) draft[fldKey].err = {}
      if (!draft[fldKey].err[name]) draft[fldKey].err[name] = {}
      draft[fldKey].err[name].msg = val
    }))
  }

  const cancelModal = () => {
    fieldData.err[type].msg = value
    setTimeout(() => {
      setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
      setErrorModal(false)
    })
  }

  return (
    <Modal
      md
      show={errorModal}
      setModal={cancelModal}
      title={__('Edit Custom Error Message', 'bitform')}
    >
      <TinyMCE
        id={`${fldKey}-${type}`}
        menubar={false}
        value={errMsg}
        onChangeHandler={val => setErrMsg(type, val)}
      />
      <div className="mt-2 f-right">
        <button type="button" className="btn mr-2" onClick={cancelModal}>Cancel</button>
        <button type="button" className="btn blue" onClick={() => setErrorModal(false)}>Save</button>
      </div>
    </Modal>
  )
}
