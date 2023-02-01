/* eslint-disable no-undef */
// eslint-disable-next-line import/no-extraneous-dependencies
import { useState } from 'react'
import { __ } from '../../Utils/i18nwrap'
import Modal from '../Utilities/Modal'
import bitsFetch from '../../Utils/bitsFetch'
import LoaderSm from '../Loaders/LoaderSm'
import SnackMsg from '../Utilities/SnackMsg'

export default function Export({ showExportMdl, close, cols, formID, report }) {
  const [snack, setSnackbar] = useState({ show: false })
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState({
    fileFormate: 'csv',
    sort: 'ASC',
    sortField: 'bitforms_form_entry_id',
    limit: null,
    custom: 'all',
    formId: formID,
    selectedField: '',
  })

  const order = report ? report[report.length - 1]?.details?.order : ['bf3-1-']
  const hidden = report ? report[report.length - 1]?.details?.hiddenColumns : []
  const columns = cols.filter((col) => col.Header !== '#' && typeof col.Header !== 'object')

  const colHeading = []
  const fieldKey = []

  columns.map((col, index) => {
    if (!hidden?.includes(col.accessor)) {
      colHeading[index] = {
        key: col.accessor,
        val: col.Header,
      }
      fieldKey[index] = col.accessor
    }
  })

  // fieldKey = fieldKey.filter((col) => !hidden.includes(col))
  // colHeading = colHeading.filter((col) => !hidden.includes(col.key))
  data.selectedField = JSON.stringify(fieldKey)

  const getEntry = (e) => {
    e.preventDefault()
    setIsLoading(true)
    bitsFetch({ data },
      'bitforms_filter_export_data').then((res) => {
      if (res !== undefined && res.success) {
        if (res.data?.count !== 0) {
          const header = []
          header[0] = 'Entry ID'
          colHeading.map((col, index) => {
            header[index + 1] = col.val
          })
          const ws = XLSX.utils.json_to_sheet(res.data)
          /* add to workbook */
          const wb = XLSX.utils.book_new()
          XLSX.utils.sheet_add_aoa(ws, [header])
          XLSX.utils.book_append_sheet(wb, ws)
          /* generate an XLSX file */
          XLSX.writeFile(wb, `bitform ${formID}.${data?.fileFormate}`)
        } else {
          setSnackbar({ ...{ show: true, msg: __('no response found', 'bitform') } })
        }
      }
      setIsLoading(false)
    })
  }

  const handleInput = (typ, val) => {
    const tmpData = { ...data }
    if (typeof val === 'number') {
      tmpData[typ] = Number(val)
    } else {
      tmpData[typ] = val
    }
    setData(tmpData)
  }
  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <Modal md show={showExportMdl} setModal={close} title="Export Data" style={{ overflow: 'auto' }}>
        <div>
          <div className="mt-3 flx">
            <b style={{ width: 200 }}>{__('How many rows to export', 'bitform')}</b>
            <select className="btcd-paper-inp ml-2" name="custom" style={{ width: 250 }} onChange={(e) => handleInput(e.target.name, e.target.value)}>
              <option selected disabled>Choose option</option>
              <option value="all">All</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {data.custom === 'custom' && (
            <div
              className="mt-3 flx"
            >
              <b style={{ width: 200 }}>{__('Enter row number', 'bitform')}</b>
              <input type="text" style={{ width: 250 }} name="limit" onChange={(e) => handleInput(e.target.name, e.target.value)} className="btcd-paper-inp mt-2" placeholder="Export Row Number" />
            </div>
          )}

          <div className="mt-3 flx">
            <b style={{ width: 200 }}>{__('Sort Order', 'bitform')}</b>
            <select className="btcd-paper-inp ml-2" name="sort" style={{ width: 250 }} defaultValue={data?.sort} onChange={(e) => handleInput(e.target.name, e.target.value)}>
              {/* <option selected disabled>Choose your sort type</option> */}
              <option value="ASC">Ascending</option>
              <option value="DESC">Descending</option>
            </select>
          </div>
          <div className="mt-3 flx">
            <b style={{ width: 200 }}>{__('Sort by', 'bitform')}</b>
            <select className="btcd-paper-inp ml-2" name="sortField" defaultValue={data?.sortField} onChange={(e) => handleInput(e.target.name, e.target.value)} style={{ width: 250 }}>
              <option value="bitforms_form_entry_id">ID</option>
              {colHeading.map((col) => (
                <option key={col.key} value={col.key}>{col.val}</option>
              ))}
            </select>
          </div>
          <div className="mt-3 flx">
            <b style={{ width: 200 }}>{__('Export File Format', 'bitform')}</b>
            <select className="btcd-paper-inp ml-2" name="fileFormate" defaultValue={data?.fileFormate} style={{ width: 250 }} onChange={(e) => handleInput(e.target.name, e.target.value)}>
              {/* <option selected disabled>Choose Type</option> */}
              <option value="csv">CSV</option>
              <option value="xlsx">Xlsx</option>
              <option value="xls">Xls</option>
              <option value="fods">Fods</option>
              <option value="ods">Ods</option>
              <option value="prn">Prn</option>
              <option value="txt">Text</option>
              <option value="html">Html</option>
              <option value="eth">Eth</option>
            </select>
          </div>
          <div>
            <button type="button" onClick={e => getEntry(e)} className="btn btn-md blue btcd-mdl-btn" disabled={isLoading}>
              {__('Export', 'bitform')}
              {isLoading && <LoaderSm size={20} clr="#fff" className="ml-2" />}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
