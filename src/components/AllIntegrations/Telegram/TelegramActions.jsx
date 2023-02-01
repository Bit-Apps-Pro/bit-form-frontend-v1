/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'

export default function TelegramActions({ formFields, telegramConf, setTelegramConf }) {
  const [actionMdl, setActionMdl] = useState({ show: false })
  const actionHandler = (e) => {
    const newConf = { ...telegramConf }
    if (e.target.value !== '') {
      newConf.actions.attachments = e.target.value
    } else {
      delete newConf.actions.attachments
    }
    setTelegramConf({ ...newConf })
  }
  return (
    <div className="pos-rel">
      <div className="d-flx flx-wrp">
        <TableCheckBox onChange={() => setActionMdl({ show: 'attachments' })} checked={'attachments' in telegramConf.actions} className="wdt-200 mt-4 mr-2" value="Attachment" title={__('Attachments', 'bitform')} subTitle={__('Add attachments from BitForm to send Telegram.', 'bitform')} />
      </div>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt="Ok"
        show={actionMdl.show === 'attachments'}
        close={() => setActionMdl({ show: false })}
        action={() => setActionMdl({ show: false })}
        title={__('Select Attachment', 'bitform')}
      >
        <div className="btcd-hr mt-2" />
        <div className="mt-2">{__('Please select file upload fields', 'bitform')}</div>
        <select onChange={(e) => actionHandler(e)} name="attachments" value={telegramConf.actions?.attachments} className="btcd-paper-inp w-10 mt-2">
          <option value="">{__('Select file upload field', 'bitform')}</option>
          {
            formFields.filter(itm => (itm.type === 'file-up')).map(itm => (
              <option key={itm.key + 1} value={itm.key}>
                {itm.name}
              </option>
            ))
          }
        </select>
      </ConfirmModal>
    </div>
  )
}
