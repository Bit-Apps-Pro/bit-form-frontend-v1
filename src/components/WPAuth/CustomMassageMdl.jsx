import produce from 'immer'
import { __ } from '../../Utils/i18nwrap'
import Modal from '../Utilities/Modal'
import TinyMCE from '../Utilities/TinyMCE'

export default function CustomMassageMdl({ dataConf, setDataConf, type, showMdl, setshowMdl, tamplate = '', title }) {
  const temBody = dataConf[type].acti_succ_msg ? dataConf[type].acti_succ_msg : tamplate

  const handleBody = value => {
    setDataConf(tmpConf => produce(tmpConf, draft => {
      // eslint-disable-next-line no-param-reassign
      draft[type].acti_succ_msg = value
    }))
  }

  const cancelModal = () => {
    setTimeout(() => {
      setDataConf(tmpConf => produce(tmpConf, draft => {
        // eslint-disable-next-line no-param-reassign
        draft[type].acti_succ_msg = tamplate
      }))
      setshowMdl(false)
    })
  }

  return (
    <Modal md show={showMdl} setModal={setshowMdl} title={title} style={{ overflow: 'auto' }}>
      <>
        <div className="mt-3">
          <b>{__('Message:', 'bitform')}</b>
          <label htmlFor={`mail-tem-${dataConf[type]?.formID}`} className="mt-2 w-10">
            <TinyMCE
              id={`mail-tem-${dataConf[type]?.formID}`}
              value={temBody}
              onChangeHandler={handleBody}
              width="100%"
            />
          </label>
        </div>
        <div className="mt-2 f-right">
          <button type="button" className="btn mr-2" onClick={cancelModal}>Cancel</button>
          <button type="button" className="btn blue" onClick={() => setshowMdl(false)}>Save</button>
        </div>
      </>
    </Modal>
  )
}
