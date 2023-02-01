/* eslint-disable no-param-reassign */

import { useEffect, useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import CheckBox from '../../Utilities/CheckBox'
import TableCheckBox from '../../Utilities/TableCheckBox'
import Modal from '../../Utilities/Modal'
import TitleModal from '../../Utilities/TitleModal'

export default function ZohoCreatorActions({ creatorConf, setCreatorConf }) {
  const [updateMdl, setUpdateMdl] = useState(false)

  const actionHandler = (val, typ) => {
    const newConf = { ...creatorConf }
    if (typ === 'update') {
      if (val.target.checked && !newConf?.actions?.update) {
        newConf.actions.update = { insert: true, criteria: '' }
        setUpdateMdl(true)
      } else {
        delete newConf.actions.update
      }
    }

    setCreatorConf({ ...newConf })
  }

  const setUpdateSettings = (val, typ) => {
    const newConf = { ...creatorConf }
    if (typ === 'criteria') {
      newConf.actions.update.criteria = val
    }
    if (typ === 'insert') {
      newConf.actions.update.insert = val
    }
    setCreatorConf({ ...newConf })
  }

  const openUpdateModal = () => {
    if (!creatorConf.actions?.update) {
      const newConf = { ...creatorConf }
      newConf.actions.update = { insert: true, criteria: '' }
      setCreatorConf({ ...newConf })
    }

    setUpdateMdl(true)
  }

  useEffect(() => {
    if (!updateMdl && !creatorConf.actions?.update?.criteria) {
      const newConf = { ...creatorConf }
      delete newConf.actions.update
      setCreatorConf({ ...newConf })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateMdl])

  return (
    <div className="pos-rel">
      <div className="d-flx flx-wrp">
        <TitleModal action={openUpdateModal}>
          <TableCheckBox onChange={(e) => actionHandler(e, 'update')} checked={'update' in creatorConf?.actions} className="wdt-200 mt-4 mr-2" value="Upsert_Record" title={__('Update Record', 'bitform')} subTitle={__('Control how the record gets updated.', 'bitform')} />
        </TitleModal>
      </div>

      <Modal
        md
        show={updateMdl}
        setModal={setUpdateMdl}
        title={__('Update Row', 'bitform')}
      >
        <div className="o-a">
          {creatorConf?.actions?.update && (
            <>
              <small>{__('Enter the criteria to update records. Please use the below format.', 'bitform')}</small>
              <br />
              <div className="mt-4">
                <small>
                  {__('Example:', 'bitform')}
&nbsp;
                  {'(Email==\\"test@mail.com\\")'}
                </small>
                <br />
                <br />
                <small>
                  {__('Here Email is Zoho Creator Field link name. info:', 'bitform')}
                  {' '}
                  <a href="https://www.zoho.com/creator/help/api/v2/update-records.html" target="_blank" rel="noreferrer">{__('Zoho Creator Criteria Guide', 'bitform')}</a>
                </small>
                <textarea name="" rows="5" className="btcd-paper-inp mt-1" onChange={e => setUpdateSettings(e.target.value, 'criteria')} value={creatorConf.actions?.update?.criteria} />
              </div>

              <div className="font-w-m mt-3">{__('Update Preferance', 'bitform')}</div>
              <small>{__('insert new record if the above criteria doesn&apos;t met?', 'bitfomr')}</small>
              <div>
                <CheckBox onChange={() => setUpdateSettings(true, 'insert')} radio checked={creatorConf.actions.update?.insert} name="up-row" title={__('Yes', 'bitform')} />
                <CheckBox onChange={() => setUpdateSettings(false, 'insert')} radio checked={!creatorConf.actions.update?.insert} name="up-row" title={__('No', 'bitform')} />
              </div>
            </>
          )}
        </div>
      </Modal>

    </div>
  )
}
