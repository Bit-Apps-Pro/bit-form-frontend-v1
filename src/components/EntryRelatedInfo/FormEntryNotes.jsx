import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useRecoilValue } from 'recoil'
import { $bits } from '../../GlobalStates'
import noData from '../../resource/img/nodata.svg'
import bitsFetch from '../../Utils/bitsFetch'
import { dateTimeFormatter } from '../../Utils/Helpers'
import { __ } from '../../Utils/i18nwrap'
import Loader from '../Loaders/Loader'
import LoaderSm from '../Loaders/LoaderSm'
import ConfirmModal from '../Utilities/ConfirmModal'
import NoteForm from './NoteForm'

export default function FormEntryNotes({ formID, entryID, allLabels, rowDtl }) {
  const bits = useRecoilValue($bits)
  const { isPro } = bits
  const dateTimeFormat = `${bits.dateFormat} ${bits.timeFormat}`
  const [isLoading, setIsLoading] = useState(false)
  const [confMdl, setConfMdl] = useState({ show: false })
  const [showForm, setShowForm] = useState(false)
  const [allNotes, setAllNotes] = useState([])
  const [firstLoad, setFirstLoad] = useState(false)
  const [fetchData, setFetchData] = useState(false)
  const [data, setData] = useState({
    title: '',
    content: '',
  })

  useEffect(() => {
    isPro && setIsLoading('allNotes')
    setFirstLoad(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (fetchData) {
      setFetchData(false)
      return
    }
    // eslint-disable-next-line no-undef
    isPro && bitsFetch({ formID, entryID }, 'bitforms_form_entry_get_notes').then((res) => {
      if (res !== undefined && res.success) {
        setAllNotes(res.data)
      }
      setIsLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData])

  useEffect(() => {
    if (data.content) setShowForm(true)
  }, [data])

  const setEditMode = noteID => {
    setShowForm(false)
    const noteDetails = allNotes.find(note => note.id === noteID)
    const { title, content } = JSON.parse(noteDetails.info_details)
    setData({ noteID, title, content })
    setShowForm(true)
  }

  const confDeleteNote = noteID => {
    confMdl.noteID = noteID
    confMdl.show = true
    setConfMdl({ ...confMdl })
  }

  const closeConfMdl = () => {
    confMdl.show = false
    setConfMdl({ ...confMdl })
  }

  const deleteNote = () => {
    setIsLoading('delete')
    closeConfMdl()
    bitsFetch({ noteID: confMdl.noteID, formID, entryID }, 'bitforms_form_entry_delete_note').then((res) => {
      if (res !== undefined && res.success) {
        toast.success(__('Note Deleted Successfully', 'bitform'))
        setFetchData(true)
      }
      setIsLoading(false)
    })
  }

  const replaceFieldWithValue = str => {
    const pattern = /\${\w[^ ${}]*}/g
    const keys = str?.match?.(pattern) || ''
    const uniqueKeys = keys?.filter?.((key, index) => keys.indexOf(key) === index) || []
    let replacedStr = str

    for (let i = 0; i < uniqueKeys.length; i += 1) {
      const uniqueKey = uniqueKeys[i].slice(2, -1)
      replacedStr = replacedStr.replaceAll(uniqueKeys[i], uniqueKey in rowDtl ? rowDtl[uniqueKey] : '[Field Deleted]')
    }
    return replacedStr
  }

  const renderNote = note => {
    const noteDetails = JSON.parse(note.info_details)
    const isDeleting = (isLoading === 'delete' && confMdl.noteID === note.id)

    return (
      <div key={note.id}>
        <div>
          {note.updated_at
            ? (
              <small>
                {__('updated on:', 'bitform')}
                {` ${dateTimeFormatter(note.updated_at, dateTimeFormat)}`}
              </small>
            )
            : (
              <small>
                {__('created at:', 'bitform')}
                {` ${dateTimeFormatter(note.created_at, dateTimeFormat)}`}
              </small>
            )}
          <button type="button" className="icn-btn ml-1 tooltip pos-rel" style={{ '--tooltip-txt': `'${__('Edit', 'bitform')}'`, fontSize: 16 }} onClick={() => setEditMode(note.id)}>
            <span className="btcd-icn icn-document-edit" />
          </button>
          <button type="button" onClick={() => confDeleteNote(note.id)} className={`${isDeleting ? 'btn' : 'icn-btn'} ml-1 tooltip pos-rel`} style={{ '--tooltip-txt': `'${__('Delete', 'bitform')}'`, fontSize: 16 }} disabled={isDeleting}>
            <span className="btcd-icn icn-trash-fill" />
            {isDeleting && <LoaderSm size={20} clr="#000" className="ml-2" />}
          </button>
        </div>
        <div>
          {noteDetails.title && <h3>{noteDetails.title}</h3>}
          <div
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: replaceFieldWithValue(noteDetails.content) }}
          />
        </div>
        <hr className="btcd-hr" />
      </div>
    )
  }

  const renderAllNotes = () => (allNotes.length ? allNotes.map(note => renderNote(note)) : firstLoad && <img src={noData} alt="no data found" style={{ height: 150, width: '100%' }} />)

  return (
    <>
      <div className="pos-rel">
        {!isPro && (
          <div className="pro-blur mt-4 flx">
            <div className="pro">
              {__('Available On', 'bitform')}
              <a href="https://www.bitapps.pro/bit-form" target="_blank" rel="noreferrer">
                <span className="txt-pro">
                  {' '}
                  {__('Premium', 'bitform')}
                </span>
              </a>
            </div>
          </div>
        )}
        {showForm
          ? (
            <NoteForm
              {...{ formID, entryID, allLabels, showForm, setShowForm, setFetchData, data, setData }}
            />
          )
          : <button type="button" className="btn" onClick={() => setShowForm(true)}>{__('create new note', 'bitform')}</button>}
        {isLoading === 'allNotes'
          ? (
            <Loader style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 70,
              transform: 'scale(0.7)',
            }}
            />
          )
          : renderAllNotes()}
      </div>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="red"
        btnTxt="Ok"
        show={confMdl.show}
        close={closeConfMdl}
        action={deleteNote}
        title={__('Confirmation', 'bitform')}
      >
        <div className="txt-center mt-5 mb-4">
          {__('Are you sure to delete this note', 'bitform')}
        </div>
        {isLoading && (
          <Loader style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 45,
            transform: 'scale(0.5)',
          }}
          />
        )}
      </ConfirmModal>
    </>
  )
}
