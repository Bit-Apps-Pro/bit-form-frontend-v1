/* eslint-disable no-use-before-define */
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import EditEntryData from '../components/EditEntryData'
import EntryRelatedInfo from '../components/EntryRelatedInfo/EntryRelatedInfo'
import ExportImportMenu from '../components/ExportImport/ExportImportMenu'
import EntriesFilter from '../components/Report/EntriesFilter'
import FldEntriesByCondition from '../components/Report/FldEntriesByCondition'
import ConfirmModal from '../components/Utilities/ConfirmModal'
import Drawer from '../components/Utilities/Drawer'
import SnackMsg from '../components/Utilities/SnackMsg'
import Table from '../components/Utilities/Table'
import TableAction from '../components/Utilities/TableAction'
import TableFileLink from '../components/Utilities/TableFileLink'
import { $bits, $fieldLabels, $forms, $reportId, $reports, $reportSelector } from '../GlobalStates'
import noData from '../resource/img/nodata.svg'
import bitsFetch from '../Utils/bitsFetch'
import { deepCopy, formatIpNumbers } from '../Utils/Helpers'
import { __ } from '../Utils/i18nwrap'
import { formsReducer } from '../Utils/Reducers'

function FormEntries({ allResp, setAllResp, integrations }) {
  console.log(
    '%c $render FormEntries',
    'background:skybluepadding:3pxborder-radius:5px',
  )
  const allLabels = useRecoilValue($fieldLabels)
  const [snack, setSnackbar] = useState({ show: false, msg: '' })
  const [isloading, setisloading] = useState(false)
  const { formID } = useParams()
  const fetchIdRef = useRef(0)
  const [pageCount, setPageCount] = useState(0)
  const [showEditMdl, setShowEditMdl] = useState(false)
  const [showRelatedInfoMdl, setshowRelatedInfoMdl] = useState(false)
  const [entryID, setEntryID] = useState(null)
  const [rowDtl, setRowDtl] = useState({ show: false, data: {} })
  const [confMdl, setconfMdl] = useState({ show: false })
  const [tableColumns, setTableColumns] = useState([])
  const [entryLabels, setEntryLabels] = useState([])
  const setForms = useSetRecoilState($forms)
  const [countEntries, setCountEntries] = useState(0)
  const [refreshResp, setRefreshResp] = useState(0)
  const bits = useRecoilValue($bits)
  const currentReportData = useRecoilValue($reportSelector)
  const reportId = useRecoilValue($reportId)
  const reports = useRecoilValue($reports)
  const rprtIndx = reports.findIndex(r => r?.id && r.id.toString() === reportId?.id?.toString())
  const rowSl = useRef(0)

  useEffect(() => {
    if (currentReportData) {
      const allLabelObj = {}
      allLabels.map((itm) => {
        allLabelObj[itm.key] = itm
      })
      const labels = []
      currentReportData.details?.order?.forEach((field) => {
        if (
          field
          && field !== 'sl'
          && field !== 'selection'
          && field !== 'table_ac'
        ) {
          allLabelObj[field] !== undefined && labels.push(allLabelObj[field])
        }
      })
      // temporary tuen off report feature
      tableHeaderHandler(labels.length ? labels : allLabels)
    } else if (allLabels.length) {
      tableHeaderHandler(allLabels)
    }
    // tableHeaderHandler(currentReportData?.details?.order || allLabels)
  }, [allLabels])

  const closeConfMdl = useCallback(() => {
    confMdl.show = false
    setconfMdl({ ...confMdl })
  }, [confMdl])

  const bulkDuplicateData = useCallback((rows, tmpData, action) => {
    const rowID = []
    const entries = []
    if (typeof rows[0] === 'object') {
      for (let i = 0; i < rows.length; i += 1) {
        rowID[rows[i].original.entry_id] = rows[i].id
        entries.push(rows[i].original.entry_id)
      }
    } else {
      rowID[rows.original.entry_id] = rows.id
      entries.push(rows.original.entry_id)
    }
    const newData = deepCopy(tmpData)

    const ajaxData = { formID, entries }
    bitsFetch(ajaxData, 'bitforms_duplicate_form_entries').then((res) => {
      if (res.success && res.data.message !== 'undefined') {
        if (action && action.fetchData && action.data) {
          action.fetchData(action.data)
        } else {
          let duplicatedEntry
          // let duplicatedEntryCount = 0
          Object.entries(res?.data?.details || {})?.forEach(
            ([resEntryId, duplicatedId]) => {
              // duplicatedEntryCount += 1
              duplicatedEntry = JSON.parse(
                JSON.stringify(newData[rowID[resEntryId]]),
              )
              // duplicatedEntry = [...newData.slice(rowID[resEntryId], parseInt(rowID[resEntryId], 10) + 1)]
              duplicatedEntry.entry_id = duplicatedId
              newData[rowID[resEntryId]].entry_id = resEntryId
              newData.unshift(duplicatedEntry)
              newData.pop()
            },
          )
          setAllResp(newData)
        }
        setSnackbar({ show: true, msg: res.data.message })
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const dupConfMdl = useCallback(
    (row, data, pCount) => {
      confMdl.btnTxt = __('Duplicate', 'bitform')
      confMdl.btnClass = 'blue'
      confMdl.body = __('Are you sure to duplicate this entry?', 'bitform')
      confMdl.action = () => {
        bulkDuplicateData(row, data, pCount)
        closeConfMdl()
      }
      confMdl.show = true
      setconfMdl({ ...confMdl })
    },
    [bulkDuplicateData, closeConfMdl, confMdl],
  )

  const closeRowDetail = useCallback(() => {
    rowDtl.show = false
    setRowDtl({ ...rowDtl })
  }, [rowDtl])

  const setBulkDelete = useCallback((rows, action) => {
    const rowID = []
    const entries = []
    if (typeof rows[0] === 'object') {
      for (let i = 0; i < rows.length; i += 1) {
        rowID.push(rows[i].id)
        entries.push(rows[i].original.entry_id)
      }
    } else {
      rowID.push(rows.id)
      entries.push(rows.original.entry_id)
    }
    const ajaxData = { formID, entries }

    bitsFetch(ajaxData, 'bitforms_bulk_delete_form_entries').then((res) => {
      if (res.success) {
        if (action && action.fetchData && action.data) {
          action.fetchData(action.data)
        }
        setSnackbar({ show: true, msg: res.data.message })
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const delConfMdl = useCallback(
    (row, data) => {
      if (row.idx !== undefined) {
        // eslint-disable-next-line no-param-reassign
        row.id = row.idx
        // eslint-disable-next-line no-param-reassign
        row.original = row.data[0].row.original
      }
      confMdl.btnTxt = 'Delete'
      confMdl.body = 'Are you sure to delete this entry'
      confMdl.btnClass = ''

      confMdl.action = () => {
        setBulkDelete(row, data)
        closeConfMdl()
        closeRowDetail()
      }
      confMdl.show = true
      setconfMdl({ ...confMdl })
    },
    [closeConfMdl, closeRowDetail, confMdl, setBulkDelete],
  )

  const tableHeaderHandler = (labels = []) => {
    const cols = labels?.map((val) => ({
      Header: val.adminLbl || val.name || val.key,
      accessor: val.key,
      fieldType: val.type,
      minWidth: 50,
      ...('type' in val
        && val.type.match(/^(file-up|check|select|sys)$/) && {
        Cell: (row) => {
          if (
            row.cell.value !== null
            && row.cell.value !== undefined
            && row.cell.value !== ''
          ) {
            if (val.type === 'file-up') {
              // eslint-disable-next-line max-len
              return getUploadedFilesArr(row.cell.value).map((itm, i) => (
                <TableFileLink
                  key={`file-n-${row.cell.row.index + i}`}
                  fname={splitFileName(itm)}
                  link={`${bits.baseDLURL}formID=${formID}&entryID=${row.cell.row.original.entry_id}&fileID=${splitFileLink(itm)}`}
                />
              ))
            }
            if (val.type === 'check' || val.type === 'select') {
              const vals = typeof row.cell.value === 'string'
                && row.cell.value.length > 0
                && row.cell.value[0] === '['
                ? JSON.parse(row.cell.value)
                : row.cell.value !== undefined && row.cell.value.split(',')
              return vals.map((itm, i) => (i < vals.length - 1 ? `${itm},` : itm))
            }
            if (val.key === '__user_id') {
              return bits?.user[row.cell.value]?.url ? (<a href={bits.user[row.cell.value].url}>{bits.user[row.cell.value].name}</a>) : null
            }
            if (val.key === '__entry_status') {
              const status = Number(row.cell.value)
              return getEntryStatus(status)
            }

            if (val.key === '__user_ip' && isFinite(Number(row.cell.value))) {
              return formatIpNumbers(row.cell.value)
            }
            return row.cell.value
          }
          return null
        },
      }),
    }))
    cols.unshift({
      Header: '#',
      accessor: 'sl',
      Cell: (value) => (
        <>
          {Number(value.state.pageIndex * value.state.pageSize)
            + Number(value.row.id)
            + 1}
        </>
      ),
      width: 40,
    })
    cols.push({
      id: 't_action',
      width: 70,
      maxWidth: 70,
      minWidth: 70,
      sticky: 'right',
      Header: (
        <span
          className="btcd-icn btcd-icn-sm icn-settings ml-2"
          title={__('Settings', 'bitform')}
        />
      ),
      accessor: 'table_ac',
      Cell: (val) => (
        <TableAction
          edit={() => editData(val.row)}
          del={() => delConfMdl(val.row, {
            fetchData: val.fetchData,
            data: {
              pageIndex: val.state.pageIndex,
              pageSize: val.state.pageSize,
              sortBy: val.state.sortBy,
              filters: val.state.filters,
              globalFilter: val.state.globalFilter,
            },
          })}
          dup={() => dupConfMdl(val.row, val.data, {
            fetchData: val.fetchData,
            data: {
              pageIndex: val.state.pageIndex,
              pageSize: val.state.pageSize,
              sortBy: val.state.sortBy,
              filters: val.state.filters,
              globalFilter: val.state.globalFilter,
            },
          })}
        />
      ),
    })
    const filteredEntryLabels = filteredEntryLabelsForTable(cols)
    setTableColumns(filteredEntryLabels)
    setEntryLabels(cols)
  }

  const getEntryStatus = status => {
    if (status === 0) { return 'Read' }
    if (status === 1) { return 'Unread' }
    if (status === 2) { return 'Unconfirmed' }
    if (status === 3) { return 'Confirmed' }
  }

  const editData = useCallback((row) => {
    if (row.idx !== undefined) {
      // eslint-disable-next-line no-param-reassign
      row.id = row.idx
      // eslint-disable-next-line no-param-reassign
      row.original = row.data[0].row.original
    }
    setEntryID(row.original.entry_id)
    setShowEditMdl(true)
  }, [])

  const relatedinfo = row => {
    if (row.idx !== undefined) {
      // eslint-disable-next-line no-param-reassign
      row.id = row.idx
      // eslint-disable-next-line no-param-reassign
      row.original = row.data[0].row.original
    }
    setEntryID(row.original.entry_id)
    setshowRelatedInfoMdl(true)
  }

  const fetchData = useCallback(({ pageSize, pageIndex, sortBy, filters, globalFilter, conditions, entriesFilterByDate }) => {
    // eslint-disable-next-line no-plusplus
    if (refreshResp) {
      setRefreshResp(0)
      setisloading(true)
      return
    }

    // eslint-disable-next-line no-plusplus
    const fetchId = ++fetchIdRef.current
    if (allResp.length < 1) {
      setisloading(true)
    }
    if (fetchId === fetchIdRef.current) {
      const startRow = pageSize * pageIndex
      bitsFetch(
        {
          id: formID,
          offset: startRow,
          pageSize,
          sortBy,
          filters,
          globalFilter,
          conditions,
          entriesFilterByDate,
        },
        'bitforms_get_form_entries',
      ).then((res) => {
        if (res?.success) {
          setPageCount(Math.ceil(res.data.count / pageSize))
          setCountEntries(res.data.count)
          setAllResp(res.data.entries)
        }

        setForms(allforms => formsReducer(allforms, {
          type: 'update',
          data: { formID, entries: res.data.count },
        }))

        setisloading(false)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delConfMdl, dupConfMdl, editData, formID, refreshResp])

  const onRowClick = useCallback(
    (e, row, idx, rowFetchData) => {
      const slNumber = e.target.parentElement.children[1].textContent
      rowSl.current = slNumber
      if (!e.target.classList.contains('prevent-drawer')) {
        const newRowDtl = { ...rowDtl }
        if (newRowDtl.show && rowDtl.idx === idx) {
          newRowDtl.show = false
        } else {
          newRowDtl.data = row
          newRowDtl.idx = idx
          newRowDtl.show = true
        }
        setRowDtl({ ...newRowDtl })

        const findStatusCol = row.find(col => col.column.id === '__entry_status')
        if (findStatusCol && findStatusCol.value === '1') {
          const entry = allResp[idx]
          const entryId = entry.entry_id
          bitsFetch({ formId: formID, entryId }, 'bitforms_entry_status_update')
            .then(resp => {
              if (resp.success) {
                const newAllResp = [...allResp]
                // eslint-disable-next-line dot-notation
                newAllResp[idx]['__entry_status'] = '0'
                newAllResp[idx]['__updated_at'] = resp?.data?.update_at_time
                setAllResp(newAllResp)
              }
            })
        }
      }
    },
    [rowDtl],
  )

  const filterEntryLabels = () => entryLabels.filter(el => el.accessor !== 'sl' && el.accessor !== 'table_ac')

  const getUploadedFilesArr = files => {
    try {
      const parsedFiles = files ? JSON.parse(files) : []
      if (Array.isArray(parsedFiles)) {
        return parsedFiles
      }
      if (Object.prototype.toString.call(parsedFiles) === '[object Object]') {
        return Object.values(parsedFiles)
      }
      return parsedFiles
    } catch (_) {
      return []
    }
  }

  const splitFileName=(fileId)=>{
    const fileName = fileId?.split('_')
    if(fileName.length>1){
      return fileName[1]
    }
    return fileId

  }

  const splitFileLink=(fileId)=>{
    const fileName = fileId?.split('_')
    if(fileName.length>1){
      return fileName[0]
    }
    return fileId

  }


  const drawerEntryMap = (entry) => {
    if (entry.fieldType === 'file-up') {
      return (
        getUploadedFilesArr(allResp[rowDtl.idx]?.[entry.accessor])?.map((it, i) => (
          <TableFileLink
            key={`file-n-${i + 1.1}`}
            fname={splitFileName(it)}
            width="100"
            link={`${bits.baseDLURL}formID=${formID}&entryID=${allResp[rowDtl.idx].entry_id}&fileID=${splitFileLink(it)}`}
          />
        ))
      )
    }
    if (entry.fieldType === 'color') {
      return (
        <div className="flx">
          {allResp[rowDtl.idx][entry.accessor]}
          <span
            style={{
              background: allResp[rowDtl.idx][entry.accessor],
              height: 20,
              width: 20,
              borderRadius: 5,
              display: 'inline-block',
              marginLeft: 10,
            }}
          />
        </div>
      )
    }
    if (entry.fieldType === 'check') {
      return (
        allResp[rowDtl.idx]?.[entry.accessor]
        && allResp[rowDtl.idx][entry.accessor].replace(/\[|\]|"/g, '')
      )
    }

    if (entry.accessor === '__user_id') {
      return bits?.user[allResp[rowDtl.idx]?.[entry.accessor]]?.url ? (<a href={bits.user[allResp[rowDtl.idx]?.[entry.accessor]].url}>{bits.user[allResp[rowDtl.idx]?.[entry.accessor]].name}</a>) : null
    }

    if (entry.accessor === '__user_ip' && isFinite(allResp[rowDtl.idx]?.[entry.accessor])) {
      return formatIpNumbers(allResp[rowDtl.idx]?.[entry.accessor])
    }
    if (entry.accessor === '__entry_status') {
      const status = Number(allResp[rowDtl.idx]?.[entry.accessor])
      return getEntryStatus(status)
    }
    return allResp?.[rowDtl.idx]?.[entry.accessor]
  }

  const loadRightHeaderComponent = () => (
    <>
      {/* <EntriesFilter fetchData={fetchData} /> */}
      <ExportImportMenu data={allResp} cols={entryLabels} formID={formID} report={reports} />
    </>
  )
  const loadLeftHeaderComponent = () => (
    <>
      <FldEntriesByCondition fetchData={fetchData} setRefreshResp={setRefreshResp} />
    </>
  )

  const filteredEntryLabelsForTable = lbls => lbls.filter(lbl => {
    const ignoreLbls = ['__user_id', '__user_ip', '__referer', '__user_device', '__created_at', '__updated_at']
    return !ignoreLbls.includes(lbl.accessor)
  })

  return (
    <div id="form-res">

      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <ConfirmModal
        show={confMdl.show}
        close={closeConfMdl}
        btnTxt={confMdl.btnTxt}
        btnClass={confMdl.btnClass}
        body={confMdl.body}
        action={confMdl.action}
      />

      {showEditMdl
        && (
          <EditEntryData
            close={setShowEditMdl}
            formID={formID}
            entryID={entryID}
            allResp={allResp}
            setAllResp={setAllResp}
            setSnackbar={setSnackbar}
          />
        )}

      {showRelatedInfoMdl
        && (
          <EntryRelatedInfo
            close={setshowRelatedInfoMdl}
            formID={formID}
            entryID={entryID}
            setSnackbar={setSnackbar}
            rowDtl={allResp[rowDtl.idx]}
            integrations={integrations}
          />
        )}

      <Drawer
        title={__(`Response Details #${rowSl.current}`, 'bitform')}
        show={rowDtl.show}
        close={closeRowDetail}
        relatedinfo={() => relatedinfo(rowDtl)}
        delConfMdl={() => delConfMdl(rowDtl, rowDtl.fetchData)}
        editData={() => editData(rowDtl)}
      >
        <table className="btcd-row-detail-tbl">
          <tbody>
            <tr className="txt-dp">
              <th>{__('Title', '')}</th>
              <th>{__('Value', '')}</th>
            </tr>
            {rowDtl.show
              && filterEntryLabels().map((label, i) => (
                <tr key={`rw-d-${i + 2}`}>
                  <th>{label.Header}</th>
                  <td>{drawerEntryMap(label)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </Drawer>

      <div className="forms">
        <Table
          className="f-table btcd-entries-f"
          height="76vh"
          columns={tableColumns}
          data={allResp}
          loading={isloading}
          countEntries={countEntries}
          rowSeletable
          resizable
          columnHidable
          hasAction
          rowClickable
          rightHeader={loadRightHeaderComponent()}
          leftHeader={loadLeftHeaderComponent()}
          formID={formID}
          setTableCols={setTableColumns}
          fetchData={fetchData}
          setBulkDelete={setBulkDelete}
          duplicateData={bulkDuplicateData}
          pageCount={pageCount}
          edit={editData}
          onRowClick={onRowClick}
          refreshResp={refreshResp}
          report={rprtIndx || 0}// index - 0 setted as default report
        />
        {!isloading && allResp.length === 0 && (
          <div className="btcd-no-data txt-center">
            <img src={noData} alt="no data found" />
            <div className="mt-2">{__('No Response Found.', 'bitform')}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(FormEntries)
