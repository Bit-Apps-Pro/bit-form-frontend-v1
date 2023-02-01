import { useState } from 'react'
import DownloadIcon from '../../Icons/DownloadIcon'
import OutlineDownloadIcn from '../../Icons/OutlineDownloadIcn'
import { __ } from '../../Utils/i18nwrap'
import Export from './Export'

export default function ExportImportMenu({ formID, cols, report }) {
  // const [showImportMdl, setshowImportMdl] = useState(false)
  const [showExportMdl, setshowExportMdl] = useState(false)
  // const importShow = () => {
  //   setshowImportMdl(true)
  // }
  const exportShow = () => {
    setshowExportMdl(true)
  }
  return (
    <div>
      {/*  <Import
        showImportMdl={showImportMdl}
        close={setshowImportMdl}
        formID={formID}
        cols={cols}
      /> */}
      <Export
        showExportMdl={showExportMdl}
        close={setshowExportMdl}
        formID={formID}
        cols={cols}
        report={report}
      />
      <div className="btcd-menu">
        {/* <button onClick={() => importShow()} className="" type="button">Import Data</button>
        {' '} */}
        <button onClick={() => exportShow()} className="btn btn-date-range  mb3 tooltip" style={{ '--tooltip-txt': `'${__('Export')}'` }} type="button">
          {' '}
          <OutlineDownloadIcn size="16" />
          {' '}
        </button>
      </div>
    </div>

  )
}
