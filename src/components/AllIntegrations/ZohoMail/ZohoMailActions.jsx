/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'

export default function ZohoMailActions({ formFields, mailConf, setMailConf }) {
  const [actionMdl, setActionMdl] = useState({ show: false })
  const actionHandler = (val, typ) => {
    const newConf = { ...mailConf }
    if (typ === 'attachments') {
      if (val !== '') {
        newConf.actions.attachments = val
      } else {
        delete newConf.actions.attachments
      }
    }

    setMailConf({ ...newConf })
  }

  return (
    <div className="pos-rel">
      <div className="d-flx flx-wrp">
        <TableCheckBox onChange={() => setActionMdl({ show: 'attachments' })} checked={'attachments' in mailConf.actions} className="wdt-200 mt-4 mr-2" value="Attachment" title={__('Attachments', 'bitform')} subTitle={__('Add attachments from BitForm to mail pushed to Zoho Mail.', 'bitform')} />
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
        <div className="mt-2">{__('Select file upload fields', 'bitform')}</div>
        <MultiSelect
          defaultValue={mailConf.actions.attachments}
          className="mt-2 w-9"
          onChange={(val) => actionHandler(val, 'attachments')}
          options={formFields.filter(itm => (itm.type === 'file-up')).map(itm => ({ label: itm.name, value: itm.key }))}
        />
      </ConfirmModal>
    </div>
  )
}
