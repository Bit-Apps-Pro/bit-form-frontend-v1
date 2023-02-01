import { useState } from 'react'

import { Link } from 'react-router-dom'
import { __ } from '../Utils/i18nwrap'
import Modal from './Utilities/Modal'
import FormImporter from './FormImporter'
import DownloadIcon from '../Icons/DownloadIcon'
// import bitsFetch from '../Utils/bitsFetch'

export default function FormTemplates({ setTempModal, newFormId, setSnackbar }) {
  const [modal, setModal] = useState(false)
  // const [, setTemplates] = useState(null)
  const staticTem = [{ lbl: 'Blank', img: '' }, { lbl: 'Contact Form', img: '' }]

  /* useEffect(() => {
    let mount = true
    bitsFetch(null, 'bitforms_templates')
      .then(res => {
        if (typeof res !== 'undefined' && res.success && mount) {
          setTemplates(JSON.parse(res.data))
        }
      })
    return function cleanup() { mount = false }
  }, []) */

  return (
    <div className="btcd-tem-lay flx">
      {staticTem.map(tem => (
        <div key={tem.lbl} className="btcd-tem flx">
          <span className="btcd-icn icn-file" style={{ fontSize: 90 }} />
          <div>{tem.lbl}</div>
          <div className="btcd-hid-btn">
            <Link to={`/form/builder/new/${tem.lbl}/fs`} className="btn btn-white sh-sm" type="button">{__('Create', 'bitform')}</Link>
          </div>
        </div>
      ))}
      <div className="btcd-tem flx">
        <DownloadIcon size="60" />
        <div>Form Import</div>
        <div className="btcd-hid-btn">
          <button onClick={() => setModal(true)} className="btn btn-white sh-sm" type="button">{__('Import', 'bitform')}</button>
        </div>
      </div>
      <Modal
        show={modal}
        setModal={setModal}
        title={__('Import Form', 'bitform')}
        subTitle=""
      >
        <FormImporter setModal={setModal} setTempModal={setTempModal} newFormId={newFormId} setSnackbar={setSnackbar} />
      </Modal>
    </div>
  )
}
