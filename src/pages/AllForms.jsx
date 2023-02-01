// eslint-disable-next-line import/no-extraneous-dependencies
import { lazy, memo, useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import FormTemplates from '../components/FormTemplates'
import ConfirmModal from '../components/Utilities/ConfirmModal'
import CopyText from '../components/Utilities/CopyText'
import MenuBtn from '../components/Utilities/MenuBtn'
import Modal from '../components/Utilities/Modal'
import Progressbar from '../components/Utilities/Progressbar'
import SingleToggle2 from '../components/Utilities/SingleToggle2'
import SnackMsg from '../components/Utilities/SnackMsg'
import Table from '../components/Utilities/Table'
import { $bits, $forms, $newFormId } from '../GlobalStates'
import bitsFetch from '../Utils/bitsFetch'
import { dateTimeFormatter } from '../Utils/Helpers'
import { __ } from '../Utils/i18nwrap'
import { formsReducer } from '../Utils/Reducers'

const Welcome = lazy(() => import('./Welcome'))

function AllFroms() {
  const [modal, setModal] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const [allForms, setAllForms] = useRecoilState($forms)
  const [confMdl, setconfMdl] = useState({ show: false, btnTxt: '' })
  const newFormId = useRecoilValue($newFormId)
  const bits = useRecoilValue($bits)

  const handleStatus = (e, id) => {
    const status = e.target.checked
    const data = { id, status }
    setAllForms(allforms => formsReducer(allforms, { type: 'update', data: { formID: id, status: data.status } }))
    bitsFetch(data, 'bitforms_change_status')
      .then(res => {
        if ('success' in res && !res.success) {
          setAllForms(allforms => formsReducer(allforms, { type: 'update', data: { formID: id, status: data.status } }))
          setSnackbar({ ...{ show: true, msg: __('Failed to change Form Status', 'bitform') } })
        }
      }).catch(() => {
        setAllForms(allforms => formsReducer(allforms, { type: 'update', data: { formID: id, status: !status } }))
        setSnackbar({ ...{ show: true, msg: __('Failed to change Form Status', 'bitform') } })
      })
  }

  const showDateTime = date => (
    <div style={{ lineHeight: 0.7, fontWeight: 500 }}>
      {dateTimeFormatter(date, bits.dateFormat)}
      <br />
      <br />
      <small>{dateTimeFormatter(date, bits.timeFormat)}</small>
    </div>
  )

  const calculateProgress = (entries, views) => (entries === 0 ? 0.00 : ((entries / (views === '0' ? 1 : views)) * 100).toFixed(2))

  const [cols, setCols] = useState([
    { width: 70, minWidth: 60, Header: __('Status', 'bitform'), accessor: 'status', Cell: value => <SingleToggle2 className="flx" action={(e) => handleStatus(e, value.row.original.formID)} checked={value.row.original.status} /> },
    { width: 250, minWidth: 80, Header: __('Form Name', 'bitform'), accessor: 'formName', Cell: v => <Link to={`/form/responses/edit/${v.row.original.formID}/`} className="btcd-tabl-lnk">{v.row.values.formName}</Link> },
    { width: 220, minWidth: 200, Header: __('Short Code', 'bitform'), accessor: 'shortcode', Cell: val => <CopyText value={`[${val.row.values.shortcode}]`} className="cpyTxt" /> },
    { width: 80, minWidth: 60, Header: __('Views', 'bitform'), accessor: 'views' },
    { width: 170, minWidth: 130, Header: __('Completion Rate', 'bitform'), accessor: 'conversion', Cell: val => <Progressbar value={calculateProgress(val.row.values.entries, val.row.values.views)} /> },
    { width: 100, minWidth: 60, Header: __('Responses', 'bitform'), accessor: 'entries', Cell: value => <Link to={`form/responses/edit/${value.row.original.formID}`} className="btcd-tabl-lnk">{value.row.values.entries}</Link> },
    { width: 160, minWidth: 60, Header: __('Created', 'bitform'), accessor: 'created_at', Cell: row => showDateTime(row.row.original.created_at) },
  ])

  useEffect(() => {
    // if (env in process && process.env==='deevelopment') {
    //   bitsFetch(null, 'bitforms_get_all_form')
    //     .then(res => {
    //       if (res?.success) {
    //         const dbForms = res.data.map(form => ({ formID: form.id, status: form.status !== '0', formName: form.form_name, shortcode: `bitform id='${form.id}'`, entries: form.entries, views: form.views, created_at: form.created_at }))
    //         setAllForms(allforms => formsReducer(allforms, { data: dbForms, type: 'set' }))
    //       }
    //     })
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    const ncols = cols.filter(itm => itm.accessor !== 't_action')
    // eslint-disable-next-line max-len
    ncols.push({ sticky: 'right', width: 100, minWidth: 60, Header: 'Actions', accessor: 't_action', Cell: val => <MenuBtn formID={val.row.original.formID} newFormId={val} index={val.row.id} del={() => showDelModal(val.row.original.formID, val.row.index)} dup={() => showDupMdl(val.row.original.formID)} export={() => showExportMdl(val.row.original.formID)} /> })
    setCols([...ncols])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newFormId])

  const setBulkStatus = useCallback((e, rows) => {
    const status = e.target.innerHTML === 'Enable'
    const rowID = []
    const formID = []
    for (let i = 0; i < rows.length; i += 1) {
      rowID.push(rows[i].id)
      formID.push(rows[i].original.formID)
    }
    const tmp = [...allForms]
    const newData = [...allForms]
    for (let i = 0; i < rowID.length; i += 1) {
      newData[rowID[i]].status = status
    }
    setAllForms(allforms => formsReducer(allforms, { data: newData, type: 'set' }))
    const ajaxData = { formID, status }

    bitsFetch(ajaxData, 'bitforms_bulk_status_change')
      .then(res => {
        if (res !== undefined && !res.success) {
          setAllForms(allforms => formsReducer(allforms, { data: tmp, type: 'set' }))
        } else if (res.success) {
          setSnackbar({ show: true, msg: res.data })
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setBulkDelete = useCallback(rows => {
    const rowID = []
    const formID = []
    for (let i = 0; i < rows.length; i += 1) {
      rowID.push(rows[i].id)
      formID.push(rows[i].original.formID)
    }
    const tmp = [...allForms]
    const newData = [...allForms]
    for (let i = rowID.length - 1; i >= 0; i -= 1) {
      newData.splice(Number(rowID[i]), 1)
    }
    setAllForms(allforms => formsReducer(allforms, { data: newData, type: 'set' }))
    const ajaxData = { formID }

    bitsFetch(ajaxData, 'bitforms_bulk_delete_form')
      .then(res => {
        if (res === undefined || !res.success) {
          setAllForms(allforms => formsReducer(allforms, { data: tmp, type: 'set' }))
        } else if (res.success) {
          setSnackbar({ show: true, msg: res.data })
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDelete = (formID, index) => {
    bitsFetch({ id: formID }, 'bitforms_delete_aform').then(response => {
      if (response.success) {
        setAllForms(allforms => formsReducer(allforms, { type: 'remove', data: index }))
        setSnackbar({ show: true, msg: __('Form Deleted Successfully', 'bitform') })
      }
    })
  }

  const handleDuplicate = (formID) => {
    const loadDuplicate = bitsFetch({ id: formID, newFormId }, 'bitforms_duplicate_aform').then(response => {
      if (response.success) {
        const { data } = response
        setAllForms(allforms => formsReducer(allforms, { type: 'add', data: { formID: data.id, status: true, formName: data.form_name, shortcode: `bitform id='${data.id}'`, entries: 0, views: 0, conversion: 0.00, created_at: data.created_at } }))
        return 'Form Duplicated Successfully.'
      }
    })

    toast.promise(loadDuplicate, {
      success: msg => msg,
      error: __('Error Occured', 'bit-form'),
      loading: __('duplicate...'),
    })
  }

  const handleExport = (formID) => {
    const uri = new URL(bits.ajaxURL)
    uri.searchParams.append('action', 'bitforms_export_aform')
    uri.searchParams.append('_ajax_nonce', bits.nonce)
    uri.searchParams.append('id', formID)
    toast.loading('loading...')
    fetch(uri)
      .then(response => {
        if (response.ok) {
          response.blob().then(blob => {
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `bitform_${formID}_export.json`
            document.body.appendChild(a)
            a.click()
            a.remove()
          })
        } else {
          response.json()
            .then(error => { error.data && setSnackbar({ show: true, msg: error.data }) })
        }
      })
  }

  const setTableCols = useCallback(newCols => { setCols(newCols) }, [])

  const closeConfMdl = () => {
    confMdl.show = false
    setconfMdl({ ...confMdl })
  }

  const showDelModal = (formID, index) => {
    confMdl.action = () => { handleDelete(formID, index); closeConfMdl() }
    confMdl.btnTxt = __('Delete', 'bitform')
    confMdl.btn2Txt = null
    confMdl.btnClass = ''
    confMdl.body = __('Are you sure to delete this form?', 'bitform')
    confMdl.show = true
    setconfMdl({ ...confMdl })
  }

  const showDupMdl = (formID) => {
    confMdl.action = () => { handleDuplicate(formID); closeConfMdl() }
    confMdl.btnTxt = __('Duplicate', 'bitform')
    confMdl.btn2Txt = null
    confMdl.btnClass = 'blue'
    confMdl.body = __('Are you sure to duplicate this form ?', 'bitform')
    confMdl.show = true
    setconfMdl({ ...confMdl })
  }

  const showExportMdl = (formID) => {
    confMdl.action = () => { handleExport(formID); closeConfMdl() }
    confMdl.btnTxt = __('Export', 'bitform')
    confMdl.btn2Txt = null
    confMdl.btnClass = 'blue'
    confMdl.body = __('Are you sure to export this form ?', 'bitform')
    confMdl.show = true
    setconfMdl({ ...confMdl })
  }

  return (
    <div id="all-forms">
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <ConfirmModal
        show={confMdl.show}
        body={confMdl.body}
        action={confMdl.action}
        close={closeConfMdl}
        btnTxt={confMdl.btnTxt}
        btn2Txt={confMdl.btn2Txt}
        btn2Action={confMdl.btn2Action}
        btnClass={confMdl.btnClass}
      />
      <Modal
        show={modal}
        setModal={setModal}
        title={__('Create Form', 'bitform')}
        subTitle=""
      >
        <FormTemplates setTempModal={setModal} newFormId={newFormId} setSnackbar={setSnackbar} />
      </Modal>
      {allForms.length ? (
        <>
          <div className="af-header flx flx-between">
            <h2>{__('Forms', 'bitform')}</h2>
            <button onClick={() => setModal(true)} type="button" className="btn round btcd-btn-lg blue blue-sh">{__('Create Form', 'bitform')}</button>
          </div>
          <div className="forms">
            <Table
              className="f-table btcd-all-frm"
              height={500}
              columns={cols}
              data={allForms}
              rowSeletable
              newFormId={newFormId}
              resizable
              columnHidable
              setBulkStatus={setBulkStatus}
              setBulkDelete={setBulkDelete}
              setTableCols={setTableCols}
            />
          </div>
        </>
      ) : <Welcome setModal={setModal} />}
    </div>
  )
}

export default memo(AllFroms)
