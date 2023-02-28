import { useRef, useState } from "react"
import bitsFetch from "../Utils/bitsFetch"
import ConfirmModal from "./Utilities/ConfirmModal"

const MigrateButton = () => {
  const [showModal, setShowModal] = useState(false)
  const [showErr, setShowErr] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const confirmTxtBox = useRef(null)

  const handleConfirmTxt = e => {
    let { value } = e.target
    value = value.replace(/[^a-zA-Z]/g, '')
    value = value.toUpperCase()
    e.target.value = value
  }

  const handleMigrate = () => {
    const confirmTxt = confirmTxtBox.current.value
    if (confirmTxt !== 'CONFIRM') {
      setShowErr(true)
      return
    }
    window.onbeforeunload = () => true
    setIsLoading(true)
    setShowErr(false)
    bitsFetch({}, 'bitforms_start_migration_to_v2')
      .then((res) => {
        if (res.success) {
          window.onbeforeunload = null
          window.location.reload()
        }
      })
  }

  return (
    <div className="migrate-wrp">
      <a href="https://docs.form.bitapps.pro/" target="_blank">
        <span className="migrate-txt">Version 2.0 is out!</span>
      </a>
      <button className="migrate-btn red red-sh" onClick={() => setShowModal(true)}>Migrate to V2</button>
      <ConfirmModal
        show={showModal}
        close={!isLoading ? () => setShowModal(false) : null}
        title="Migrate to Version 2.0?"
        btnTxt="Migrate Now"
        btnClass="blue"
        action={handleMigrate}
        isLoading={isLoading}
      >
        <div className="migrate-modal">
          <h3>Please Read First!</h3>
          <ul>
            <p>
              All forms styling will be reset to Bit Form default theme.
            </p>
            <p>
              Upgrade process may take several minutes and will refresh the page multiple times.
            </p>
            <p>
              In case of any interruption or anything goes wrong, just reload the page and it will pick up where it left off.
            </p>
            <p>
              Do not close the browser tab during the process.
            </p>
          </ul>
          <small>Type "CONFIRM" in the input box below to proceed:</small>
          <input ref={confirmTxtBox} type="text" placeholder="Type CONFIRM" onChange={handleConfirmTxt} />
          {showErr && <p className="migrate-err">Check if you typed "CONFIRM" correctly.</p>}
        </div>
      </ConfirmModal>
    </div>
  )
}

export default MigrateButton
