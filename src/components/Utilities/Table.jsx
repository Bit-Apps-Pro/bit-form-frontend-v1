/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import { forwardRef, memo, useEffect, useRef, useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { ReactSortable } from 'react-sortablejs'
import { useColumnOrder, useFilters, useFlexLayout, useGlobalFilter, usePagination, useResizeColumns, useRowSelect, useSortBy, useTable } from 'react-table'
import { useSticky } from 'react-table-sticky'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $reportId, $reportSelector } from '../../GlobalStates'
import SearchIcn from '../../Icons/SearchIcn'
import { __ } from '../../Utils/i18nwrap'
import TableLoader2 from '../Loaders/TableLoader2'
import ConfirmModal from './ConfirmModal'
import Menu from './Menu'
import TableCheckBox from './TableCheckBox'

const IndeterminateCheckbox = forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = useRef()
    const resolvedRef = ref || defaultRef
    useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])
    return <TableCheckBox refer={resolvedRef} rest={rest} />
  },
)

function GlobalFilter({ globalFilter, setGlobalFilter, setSearch, leftHeaderComp }) {
  const [delay, setDelay] = useState(null)
  const handleSearch = e => {
    delay && clearTimeout(delay)
    const { value } = e.target

    setGlobalFilter(value || undefined)

    setDelay(setTimeout(() => {
      setSearch(value || undefined)
    }, 1000))
  }

  return (
    <div className="table-right-menu">

      <div className="flx">
        {/* <div className="f-search">
          <button type="button" className="icn-btn" aria-label="icon-btn" onClick={() => { setSearch(globalFilter || undefined) }}>
            <span className="btcd-icn icn-search" />
          </button>

           <label>
            <input
              value={globalFilter || ''}
              onChange={handleSearch}
              placeholder={__('Search', 'bitform')}
            />
          </label>

        </div> */}
        <div className="f-search mr-2">
          <span><SearchIcn size="16" /></span>
          <input
            value={globalFilter || ''}
            onChange={handleSearch}
            placeholder={__('Search', 'bitform')}
            className="search-input-box"
          />

        </div>
        {leftHeaderComp}

      </div>

    </div>
  )
}

function ColumnHide({ cols, setCols, tableCol, tableAllCols }) {
  return (
    <>
      <Menu icn="icn-remove_red_eye">
        <Scrollbars autoHide style={{ width: 200 }}>
          <ReactSortable list={cols} setList={l => setCols(l)} handle=".btcd-pane-drg">
            {tableCol.map((column, i) => (
              <div key={tableAllCols[i + 1].id} className={`btcd-pane ${(column.Header === 'Actions' || typeof column.Header === 'object') && 'd-non'}`}>
                <TableCheckBox cls="scl-7" id={tableAllCols[i + 1].id} title={column.Header} rest={tableAllCols[i + 1].getToggleHiddenProps()} />
                <span className="btcd-pane-drg">&#8759;</span>
              </div>
            ))}
          </ReactSortable>
        </Scrollbars>
      </Menu>
    </>
  )
}

function Table(props) {
  console.log('%c $render Table', 'background:blue;padding:3px;border-radius:5px;color:white')
  const [confMdl, setconfMdl] = useState({ show: false, btnTxt: '' })
  const { columns, data, fetchData, refreshResp, report } = props
  const [currentReportData, updateReportData] = useRecoilState($reportSelector)
  const reportId = useRecoilValue($reportId)

  const { getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setSortBy,
    setHiddenColumns,
    state,
    preGlobalFilteredRows,
    selectedFlatRows, // row select
    allColumns, // col hide
    setGlobalFilter,
    state: { pageIndex, pageSize, sortBy, filters, globalFilter, hiddenColumns, conditions },
    setColumnOrder } = useTable({
      debug: true,
      fetchData,
      columns,
      data,
      manualPagination: typeof props.pageCount !== 'undefined',
      pageCount: props.pageCount,
      initialState: {
        pageIndex: 0,
        hiddenColumns: (currentReportData && 'details' in currentReportData && typeof currentReportData.details === 'object' && 'hiddenColumns' in currentReportData.details) ? currentReportData.details.hiddenColumns : [],
        pageSize: (currentReportData && 'details' in currentReportData && typeof currentReportData.details === 'object' && 'pageSize' in currentReportData.details) ? currentReportData.details.pageSize : 10,
        sortBy: (currentReportData && 'details' in currentReportData && typeof currentReportData.details === 'object' && 'sortBy' in currentReportData.details) ? currentReportData.details.sortBy : [],
        filters: (currentReportData && 'details' in currentReportData && typeof currentReportData.details === 'object' && 'filters' in currentReportData.details) ? currentReportData.details.filters : [],
        globalFilter: (currentReportData && 'details' in currentReportData && typeof currentReportData.details === 'object' && 'globalFilter' in currentReportData.details) ? currentReportData.details.globalFilter : '',
        columnOrder: (currentReportData && 'details' in currentReportData && typeof currentReportData.details === 'object' && 'order' in currentReportData.details) ? currentReportData.details.order : [],
        conditions: (currentReportData && 'details' in currentReportData && typeof currentReportData.details === 'object' && 'conditions' in currentReportData.details) ? currentReportData.details.conditions : [],
      },
      autoResetPage: false,
      autoResetHiddenColumns: false,
      autoResetSortBy: false,
      autoResetFilters: false,
      autoResetGlobalFilter: false,
    },
      useFilters,
      useGlobalFilter,
      useSortBy,
      usePagination,
      useSticky,
      useColumnOrder,
      // useBlockLayout,
      useFlexLayout,
      props.resizable ? useResizeColumns : '', // resize
      props.rowSeletable ? useRowSelect : '', // row select
      props.rowSeletable ? (hooks => {
        hooks.allColumns.push(cols => [
          {
            id: 'selection',
            width: 50,
            maxWidth: 50,
            minWidth: 67,
            sticky: 'left',
            Header: ({ getToggleAllRowsSelectedProps }) => <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />,
            Cell: ({ row }) => <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />,
          },
          ...cols,
        ])
      }) : '')
  const [stateSavable, setstateSavable] = useState(false)

  const [search, setSearch] = useState(globalFilter)
  useEffect(() => {
    if (fetchData) {
      fetchData({ pageIndex, pageSize, sortBy, filters, globalFilter: search, conditions: currentReportData?.details?.conditions })
    }
  }, [refreshResp, pageIndex, pageSize, sortBy, filters, search])

  useEffect(() => {
    if (pageIndex > pageCount) {
      gotoPage(0)
    }
  }, [gotoPage, pageCount, pageIndex])

  useEffect(() => {
    if (!isNaN(report)) {
      let details

      if (currentReportData && currentReportData.details && typeof currentReportData.details === 'object') {
        details = { ...currentReportData.details, hiddenColumns, pageSize, sortBy, filters, globalFilter }
      } else {
        details = { hiddenColumns, pageSize, sortBy, filters, globalFilter }
      }
      updateReportData({ ...currentReportData, details, type: 'table' })
      setstateSavable(false)
    } else if (stateSavable) {
      setstateSavable(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, sortBy, filters, globalFilter, hiddenColumns])

  useEffect(() => {
    if (currentReportData && currentReportData.details && typeof currentReportData.details === 'object' && report !== undefined) {
      setHiddenColumns(currentReportData?.details?.hiddenColumns || [])
      setPageSize(currentReportData?.details?.pageSize || 10)
      setSortBy(currentReportData?.details?.sortBy || [])
      setGlobalFilter(currentReportData?.details?.globalFilter || '')

      //  setFilters(currentReportData.details.filters)
      // setColumnOrder(currentReportData.details.order)
      return
    }

    setHiddenColumns([])
    setPageSize(10)
    setSortBy([])
    setGlobalFilter('')
    // setFilters([])
    // setColumnOrder([])
  }, [reportId])

  useEffect(() => {
    if (columns.length && allColumns.length >= columns.length) {
      if (currentReportData && 'details' in currentReportData) {
        if (stateSavable && currentReportData.details) {
          const details = { ...currentReportData.details, order: ['selection', ...columns.map(singleColumn => ('id' in singleColumn ? singleColumn.id : singleColumn.accessor))], type: 'table' }
          if (state.columnOrder.length === 0 && typeof currentReportData.details === 'object' && 'order' in currentReportData.details) {
            setColumnOrder(currentReportData.details.order)
          } else {
            setColumnOrder(details.order)
            updateReportData({ ...currentReportData, details })
          }
        } else if (!stateSavable && typeof currentReportData.details === 'object' && currentReportData.details && 'order' in currentReportData.details) {
          setColumnOrder(currentReportData.details.order)
          setstateSavable(true)
        } else if (!stateSavable) {
          setstateSavable(true)
        }
      } else if (typeof props.pageCount !== 'undefined' && report) {
        const details = { hiddenColumns: state.hiddenColumns, order: ['selection', ...columns.map(singleColumn => ('id' in singleColumn ? singleColumn.id : singleColumn.accessor))], pageSize, sortBy: state.sortBy, filters: state.filters, globalFilter: state.globalFilter }
        updateReportData({ details, type: 'table' })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns])

  const showBulkDupMdl = () => {
    confMdl.action = () => { props.duplicateData(selectedFlatRows, data, { fetchData, data: { pageIndex, pageSize, sortBy, filters, globalFilter: search } }); closeConfMdl() }
    confMdl.btnTxt = __('Duplicate', 'bitform')
    confMdl.btn2Txt = null
    confMdl.btnClass = 'blue'
    confMdl.body = `${__('Do You want Deplicate these', 'bitform')} ${selectedFlatRows.length} ${__('item', 'bitform')} ?`
    confMdl.show = true
    setconfMdl({ ...confMdl })
  }

  const showStModal = () => {
    confMdl.action = (e) => { props.setBulkStatus(e, selectedFlatRows); closeConfMdl() }
    confMdl.btn2Action = (e) => { props.setBulkStatus(e, selectedFlatRows); closeConfMdl() }
    confMdl.btnTxt = __('Disable', 'bitform')
    confMdl.btn2Txt = __('Enable', 'bitform')
    confMdl.body = `${__('Do you want to change these', 'bitform')} ${selectedFlatRows.length} ${__('status', 'bitform')} ?`
    confMdl.show = true
    setconfMdl({ ...confMdl })
  }

  const showDelModal = () => {
    confMdl.action = () => { props.setBulkDelete(selectedFlatRows, { fetchData, data: { pageIndex, pageSize, sortBy, filters, globalFilter: search } }); closeConfMdl() }
    confMdl.btnTxt = __('Delete', 'bitform')
    confMdl.btn2Txt = null
    confMdl.btnClass = ''
    confMdl.body = `${__('Are you sure to delete these', 'bitform')} ${selectedFlatRows.length} ${__('items', 'bitform')} ?`
    confMdl.show = true
    setconfMdl({ ...confMdl })
  }

  const closeConfMdl = () => {
    confMdl.show = false
    setconfMdl({ ...confMdl })
  }

  return (
    <>
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
      <div className="btcd-t-actions">
        <div className="flx">

          {props.columnHidable && <ColumnHide cols={props.columns} setCols={props.setTableCols} tableCol={columns} tableAllCols={allColumns} />}
          {props.leftHeader}
          {props.rowSeletable && selectedFlatRows.length > 0
            && (
              <>
                {'setBulkStatus' in props
                  && (
                    <button onClick={showStModal} className="icn-btn btcd-icn-lg tooltip" style={{ '--tooltip-txt': '"Status"' }} aria-label="icon-btn" type="button">
                      <span className="btcd-icn icn-toggle_off" />
                    </button>
                  )}
                {'duplicateData' in props
                  && (
                    <button onClick={showBulkDupMdl} className="icn-btn btcd-icn-lg tooltip" style={{ '--tooltip-txt': '"Duplicate"' }} aria-label="icon-btn" type="button">
                      <span className="btcd-icn icn-file_copy" style={{ fontSize: 16 }} />
                    </button>
                  )}
                <button onClick={showDelModal} className="icn-btn btcd-icn-lg tooltip" style={{ '--tooltip-txt': '"Delete"' }} aria-label="icon-btn" type="button">
                  <span className="btcd-icn icn-trash-fill" style={{ fontSize: 16 }} />
                </button>
                <small className="btcd-pill">
                  {selectedFlatRows.length}
                  {' '}
                  {__('Row Selected', 'bitform')}
                </small>
              </>
            )}
        </div>
      </div>
      <>
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
          setSearch={setSearch}
          leftHeaderComp={props.rightHeader}
          data={props.data}
          cols={props.columns}
          formID={props.formID}
          report={report}
          fetchData={fetchData}

        />
        <div className="mt-2">
          <Scrollbars className="btcd-scroll" style={{ height: props.height }}>
            <div {...getTableProps()} className={`${props.className} ${props.rowClickable && 'rowClickable'}`}>
              <div className="thead">
                {headerGroups.map((headerGroup, i) => (
                  <div key={`t-th-${i + 8}`} className="tr" {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <div key={column.id} className="th flx" {...column.getHeaderProps()}>
                        <div {...column.id !== 't_action' && column.getSortByToggleProps()}>
                          {column.render('Header')}
                          {' '}
                          {(column.id !== 't_action' && column.id !== 'selection') && (
                            <span>
                              {column.isSorted
                                ? column.isSortedDesc
                                  ? String.fromCharCode(9662)
                                  : String.fromCharCode(9652)
                                : <span className="btcd-icn icn-sort" style={{ fontSize: 10, marginLeft: 5 }} />}
                            </span>
                          )}
                        </div>
                        {props.resizable
                          && (
                            <div
                              {...column.getResizerProps()}
                              className={`btcd-t-resizer ${column.isResizing ? 'isResizing' : ''}`}
                            />
                          )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              {props.loading ? <TableLoader2 /> : (
                <div className="tbody" {...getTableBodyProps()}>
                  {page.map(row => {
                    prepareRow(row)
                    return (
                      <div
                        key={`t-r-${row.index}`}
                        className={`tr ${row.isSelected ? 'btcd-row-selected' : ''}`}
                        {...row.getRowProps()}
                      >
                        {row.cells.map(cell => (
                          <div
                            key={`t-d-${cell.row.index}`}
                            className="td flx"
                            {...cell.getCellProps()}
                            onClick={(e) => props.rowClickable && typeof cell.column.Header === 'string' && props.onRowClick(e, row.cells, cell.row.index, { fetchData, data: { pageIndex, pageSize, sortBy, filters, globalFilter } })}
                            onKeyPress={(e) => props.rowClickable && typeof cell.column.Header === 'string' && props.onRowClick(e, row.cells, cell.row.index, { fetchData, data: { pageIndex, pageSize, sortBy, filters, globalFilter } })}
                            role="button"
                            tabIndex={0}
                            aria-label="cell"
                          >
                            {cell.render('Cell')}
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </Scrollbars>
        </div>
      </>

      <div className="btcd-pagination">
        <small>
          {props.countEntries >= 0 && (
            `${__('Total Response:', 'bitform')}
            ${props.countEntries}`
          )}
        </small>
        <div>
          <button aria-label="Go first" className="icn-btn" type="button" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            &laquo;
          </button>
          {' '}
          <button aria-label="Back" className="icn-btn" type="button" onClick={() => previousPage()} disabled={!canPreviousPage}>
            &lsaquo;
          </button>
          {' '}
          <button aria-label="Next" className="icn-btn" type="button" onClick={() => nextPage()} disabled={!canNextPage}>
            &rsaquo;
          </button>
          {' '}
          <button aria-label="Last" className="icn-btn" type="button" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            &raquo;
          </button>
          {' '}
          <small>
            &nbsp;
            {__('Page', 'bitform')}
            {' '}
            <strong>
              {pageIndex + 1}
              {' '}
              {__('of', 'bitform')}
              {' '}
              {pageOptions.length}
              {' '}
              &nbsp;
            </strong>
            {' '}
          </small>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label>
            <select
              className="btcd-paper-inp"
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value))
                if (props.getPageSize) {
                  props.getPageSize(e.target.value, pageIndex)
                }
              }}
            >
              {[10, 20, 30, 40, 50].map(pageSiz => (
                <option key={pageSiz} value={pageSiz}>
                  {__('Show', 'bitform')}
                  {' '}
                  {pageSiz}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

    </>
  )
}

export default memo(Table)
