import produce from 'immer'
import { useEffect, useRef, useState } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import { useRecoilValue } from 'recoil'
import { $bits } from '../GlobalStates'
import Bitforms from '../user-frontend/Bitforms'
import bitsFetch from '../Utils/bitsFetch'
import { __ } from '../Utils/i18nwrap'
import LoaderSm from './Loaders/LoaderSm'
import Modal from './Utilities/Modal'

export default function EditEntryData(props) {
  const { formID, entryID, setAllResp, setSnackbar } = props
  const bits = useRecoilValue($bits)
  const [showEdit, setshowEdit] = useState(false)
  const [isLoading, setisLoading] = useState(false)
  const [data, setData] = useState({ layout: null, fields: null })
  const [error, setError] = useState(null)
  const [formStyle, setFormStyle] = useState('')
  const [formLayoutStyle, setFormLayoutStyle] = useState('')
  const ref = useRef(null)
  const [fields, setFields] = useState(null)

  useEffect(() => {
    setshowEdit(true)
    // eslint-disable-next-line no-undef
    fetch(`${bits.styleURL}/bitform-${formID}.css`)
      .then(response => response.text())
      .then(styleData => setFormStyle(styleData))

    fetch(`${bits.styleURL}/bitform-layout-${formID}.css`)
      .then(response => response.text())
      .then(styleData => setFormLayoutStyle(styleData))

    bitsFetch({ formID, entryID }, 'bitforms_edit_form_entry')
      .then(res => {
        if (res !== undefined && res.success) {
          const tmp = { layout: res.data.layout, fields: res.data.fields, fieldToCheck: res.data.fieldToCheck, conditional: res.data.conditional, fieldsKey: res.data.fieldsKey }
          const submitBtn = Object.entries(tmp.fields).find(fld => fld[1].btnTyp === 'submit')
          const submitBtnKey = submitBtn?.[0] || null
          if (submitBtnKey) {
            tmp.layout.lg = tmp.layout.lg.filter(lay => lay.i !== submitBtnKey)
            delete tmp.fields[submitBtnKey]
          }
          setData(tmp)
          setFields(res.data.fields)
        }
      })
  }, [entryID, formID])

  const updateData = (event) => {
    event.preventDefault()
    setisLoading(true)
    const formData = new FormData(ref.current)
    const queryParam = { formID, entryID: props.entryID }
    const hidden = []
    Object.entries(fields).forEach(fld => {
      if (fld[1]?.valid?.hide) {
        hidden.push(fld[0])
      }
    })
    if (hidden.length) {
      formData.append('hidden_fields', hidden)
    }
    bitsFetch(formData, 'bitforms_update_form_entry', undefined, queryParam)
      .then(response => {
        if (response !== undefined && response.success) {
          if (response.data.cron || response.data.cronNotOk) {
            const hitCron = response.data.cron || response.data.cronNotOk
            if (typeof hitCron === 'string') {
              const uri = new URL(hitCron)
              if (uri.protocol !== window.location.protocol) {
                uri.protocol = window.location.protocol
              }
              fetch(uri)
            } else {
              const uri = new URL(bits.ajaxURL)
              uri.searchParams.append('action', 'bitforms_trigger_workflow')
              const triggerData = { cronNotOk: hitCron, id: `bitforms_${formID}` }
              fetch(uri,
                {
                  method: 'POST',
                  body: JSON.stringify(triggerData),
                  headers: { 'Content-Type': 'application/json' },
                })
                .then(res => res.json())
            }
          }
          setSnackbar({ show: true, msg: response.data.message })
          setAllResp(oldResp => produce(oldResp, draft => {
            const entryIndex = draft.findIndex(e => e.entry_id === props.entryID)
            draft[entryIndex] = { ...draft[entryIndex], ...response.data.updatedData }
          }))
          props.close(false)
        } else if (response.data) {
          setError(response.data)
        }
      })
      .finally(() => setisLoading(false))
  }

  function SaveBtn() {
    return (
      <button onClick={updateData} disabled={isLoading} type="button" className="btn btn-md blue btcd-mdl-hdr-btn">
        Update
        {isLoading && <LoaderSm size={20} clr="#fff" className="ml-2" />}
      </button>
    )
  }

  const mdlContentElm = document.querySelector('.btcd-modal-wrp')
  const mdlAutoHeight = mdlContentElm?.offsetHeight ? (mdlContentElm.offsetHeight - 150) : 0

  return (
    <Modal
      hdrActn={<SaveBtn />}
      lg
      show={showEdit}
      setModal={props.close}
      title={__('Edit', 'bitform')}
    >
      {formStyle && (
        <>
          <style>{formStyle}</style>
          <style>{formLayoutStyle}</style>
          <style>
            {`
              .drag:not(.no-drg), .drag:active {
                cursor: default;
              }
            `}
          </style>
        </>
      )}
      <Scrollbars
        autoHide
        autoHeight
        autoHeightMin={mdlAutoHeight}
        autoHeightMax={mdlAutoHeight}
      >
        {data.layout !== null && (
          <Bitforms
            refer={ref}
            editMode
            setFields={setFields}
            layout={data.layout}
            data={data.fields}
            formID={formID}
            entryID={props.entryID}
            fieldToCheck={data.fieldToCheck}
            conditional={data.conditional}
            fieldsKey={data.fieldsKey}
            error={error}
          />
        )}
      </Scrollbars>
    </Modal>
  )
}
