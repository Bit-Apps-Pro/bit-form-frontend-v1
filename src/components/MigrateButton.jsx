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
    setIsLoading(true)
    const confirmTxt = confirmTxtBox.current.value
    if (confirmTxt !== 'CONFIRM') {
      setShowErr(true)
      return
    }
    setShowErr(false)
    bitsFetch({}, 'bitforms_start_migration_to_v2')
      .then((res) => {
        if (res.success) {
          window.location.reload()
        }
      })
  }

  return (
    <div className="migrate-wrp">
      <span className="migrate-txt">Version 2.0 is out!</span>
      <button className="migrate-btn red red-sh" onClick={() => setShowModal(true)}>Migrate to V2</button>
      <ConfirmModal
        show={showModal}
        close={() => setShowModal(false)}
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
              Do not close the browser tab during the process.
            </p>
            <p>
              All forms styling will be reset to default Bit Form theme.
            </p>
            <p>
              Upgrade process may take several minutes and will refresh the page multiple times.
            </p>
            <p>
              In case of any interruption or anything goes wrong, just reload the page and it will pick up where it left off.
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
