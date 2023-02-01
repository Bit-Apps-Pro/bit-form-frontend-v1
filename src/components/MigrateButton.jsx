import { useRef, useState } from "react"
import bitsFetch from "../Utils/bitsFetch"
import ConfirmModal from "./Utilities/ConfirmModal"

const MigrateButton = () => {
  const [showModal, setShowModal] = useState(false)
  const [showErr, setShowErr] = useState(false)
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
    setShowErr(false)
    bitsFetch({}, 'bitforms_migrate_to_v2')
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
      >
        <div className="migrate-modal">
          <h3>Please Read First!</h3>
          <p>
            Upon migration to version 2 of the Bit Form, all previously created forms will become inactive and will no longer function within the website.
          </p>
          {/* <p>
            The "Migrate Only" button will only do the migration process to version 2. Afterwards, the forms can be manually converted to the new version individually.
          </p> */}
          <p>
            The "Migrate Now" button will do the migration process to version 2 and automatically convert all forms to the new one.
          </p>
          <p>
            However, if anything goes wrong, it is possible to convert the forms again to the new version after the migration is complete.
          </p>
          <p><strong>Note:</strong> The converted forms will get a new form id, so you will have to replace the shortcodes of bitform v1 forms with the new shortcode in your site.</p>
          <small>Type "CONFIRM" in the input box below to proceed:</small>
          <input ref={confirmTxtBox} type="text" placeholder="Type CONFIRM" onChange={handleConfirmTxt} />
          {showErr && <p className="migrate-err">Check if you typed "CONFIRM" correctly.</p>}
        </div>
      </ConfirmModal>
    </div>
  )
}

export default MigrateButton
