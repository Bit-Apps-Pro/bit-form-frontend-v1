/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'

export default function ElasticEmailActions({ elasticEmailConf, setElasticEmailConf, formFields }) {
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => { } })
  const [isLoading, setIsLoading] = useState(false)

  const actionHandler = (e, type) => {
    const newConf = { ...elasticEmailConf }
    if (type === 'status') {
      if (e.target.checked) {
        newConf.actions[type] = true
        setActionMdl({ show: type })
      } else {
        delete newConf.actions?.[type]
        delete newConf?.[type]
      }
    }
    setElasticEmailConf({ ...newConf })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const status = [
    { value: 'Transactional', label: 'Transactional' },
    { value: 'Engaged', label: 'Engaged' },
    { value: 'Active', label: 'Active' },
    { value: 'Bounced', label: 'Bounced' },
    { value: 'Unsubscribed', label: 'Unsubscribed' },
    { value: 'Abuse', label: 'Abuse' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Stale', label: 'Stale' },
    { value: 'NotConfirmed', label: 'NotConfirmed' },
  ]

  const setChanges = (val, type) => {
    const newConf = { ...elasticEmailConf }
    newConf[type] = val
    setElasticEmailConf({ ...newConf })
  }

  return (

    <div className="pos-rel d-flx w-8">
      {/* <TableCheckBox checked={elasticEmailConf.actions?.sendActivation || false} onChange={(e) => actionHandler(e, 'sendActivation')} className="wdt-200 mt-4 mr-2" value="sendActivation" title={__('Send Activation Email', 'bitform')} subTitle={__('Add Send Activation Email', 'bitform')} /> */}
      <TableCheckBox checked={elasticEmailConf?.actions?.status || false} onChange={(e) => actionHandler(e, 'status')} className="wdt-200 mt-4 mr-2" value="status" title={__('Status', 'bitform')} subTitle={__('Add Status to contact', 'bitform')} />

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bitform')}
        show={actionMdl.show === 'status'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Status', 'bitform')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        {isLoading
          ? (
            <Loader style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 45,
              transform: 'scale(0.5)',
            }}
            />
          )
          : (
            <div className="flx flx-between mt-2">
              <MultiSelect
                className="msl-wrp-options"
                defaultValue={elasticEmailConf?.status}
                options={status?.map(list => ({ label: list.label, value: list.value.toString() }))}
                onChange={val => setChanges(val, 'status')}
                customValue
                singleSelect
              />
            </div>
          )}
      </ConfirmModal>

    </div>
  )
}
