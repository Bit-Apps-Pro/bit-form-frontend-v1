/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */

import produce from 'immer'
import { memo, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $confirmations, $fieldsArr } from '../GlobalStates'
import CloseIcn from '../Icons/CloseIcn'
import TrashIcn from '../Icons/TrashIcn'
import { deepCopy } from '../Utils/Helpers'
import { __ } from '../Utils/i18nwrap'
import Accordions from './Utilities/Accordions'
import Button from './Utilities/Button'
import ConfirmModal from './Utilities/ConfirmModal'
import TinyMCE from './Utilities/TinyMCE'

function ConfMsg({ removeIntegration }) {
  const [confMdl, setConfMdl] = useState({ show: false, action: null })
  const [allConf, setAllConf] = useRecoilState($confirmations)
  const fieldsArr = useRecoilValue($fieldsArr)

  const handleMsg = (mg, idx) => {
    setAllConf(prevState => produce(prevState, draft => {
      draft.type.successMsg[idx].msg = mg
    }))
  }

  const handleMsgTitle = (e, idx) => {
    const confirmation = deepCopy(allConf)
    confirmation.type.successMsg[idx].title = e.target.value
    setAllConf(confirmation)
  }

  const addMoreMsg = () => {
    const confirmation = deepCopy(allConf)
    if (confirmation?.type?.successMsg) {
      confirmation.type.successMsg.push({ title: `Untitled Message ${confirmation.type.successMsg.length + 1}`, msg: __('Successfully Submitted.', 'bitform') })
    } else {
      confirmation.type = { successMsg: [], ...confirmation.type }
      confirmation.type.successMsg.push({ title: `Untitled Message ${confirmation.type.successMsg.length + 1}`, msg: __('Successfully Submitted.', 'bitform') })
    }
    setAllConf(confirmation)
  }

  const closeMdl = () => {
    confMdl.show = false
    setConfMdl({ ...confMdl })
  }

  const showDelConf = (i) => {
    confMdl.show = true
    confMdl.action = () => rmvMsg(i)
    setConfMdl({ ...confMdl })
  }

  const rmvMsg = async i => {
    const confirmation = deepCopy(allConf)
    const tmpData = confirmation.type.successMsg[i]
    confirmation.type.successMsg.splice(i, 1)
    setAllConf(confirmation)
    confMdl.show = false
    setConfMdl({ ...confMdl })
    if (tmpData.id !== undefined) {
      const status = await removeIntegration(tmpData.id, 'msg')
      if (!status) {
        confirmation.type.successMsg.splice(i, 0, tmpData)
        setAllConf(confirmation)
      }
    }
  }

  return (
    <div>
      <ConfirmModal
        action={confMdl.action}
        show={confMdl.show}
        body={__('Are you sure to delete this message ?', 'bitform')}
        btnTxt={__('Delete', 'bitform')}
        close={closeMdl}
      />

      {allConf?.type?.successMsg ? allConf.type.successMsg?.map((itm, i) => (
        <div key={`f-m-${i + 1}`} className="flx">
          <Accordions
            title={itm.title}
            titleEditable
            cls="mt-2 mr-2 w-9"
            onTitleChange={e => handleMsgTitle(e, i)}
          >
            <TinyMCE
              id={`conf-${i}`}
              formFields={fieldsArr}
              value={itm.msg}
              onChangeHandler={val => handleMsg(val, i)}
            />
          </Accordions>
          <Button onClick={() => showDelConf(i)} icn className="sh-sm white mt-2"><TrashIcn size={16} /></Button>
        </div>
      )) : (
        <div className="txt-center btcd-empty">
          <span className="btcd-icn icn-stack" />
          {__('Empty', 'bitform')}
        </div>
      )}
      <div className="txt-center"><Button onClick={addMoreMsg} icn className="sh-sm blue tooltip mt-2" style={{ '--tooltip-txt': `'${__('Add More Alternative Success Message', 'bitform')}'` }}><CloseIcn size="14" stroke="3" className="icn-rotate-45" /></Button></div>
    </div>
  )
}

export default memo(ConfMsg)
