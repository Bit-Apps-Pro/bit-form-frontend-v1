export default function ImportStepOne() {
  sessionStorage.removeItem('file_header')
  sessionStorage.removeItem('file_data')
  const fileUpload = event => {
    event.preventDefault()
    const selectedFile = event.target.files[0]
    // const fileTypeError = 'File format not supported.Please use a .CSV, .TSV, .XLS, .XLSX or .TXT file.'
    // if (file.files[0].type !== 'application/vnd.ms-excel') {
    //   alert(fileTypeError)
    //   file.value = null
    // }
    const fileReader = new FileReader()
    fileReader.onload = function (e) {
      const data = e.target.result
      // eslint-disable-next-line no-undef
      const workbook = XLSX.read(data, { type: 'binary' })
      const wsname = workbook.SheetNames[0]
      const ws = workbook.Sheets[wsname]
      // eslint-disable-next-line no-undef
      const roa = XLSX.utils.sheet_to_json(ws, { header: 1 })
      const head = []
      // const headers = roa[0]
      for (let i = 0; i < roa[0].length; i += 1) {
        head[i] = `${roa[0][i].replace(' ', '')}${i}`
      }
      const headers = []
      for (let i = 0; i < roa[0].length; i += 1) {
        headers[i] = `${roa[0][i].replace(' ', '')}${i}`
        // headers[i] = roa[0][i]
      }
      console.log(headers)
      // eslint-disable-next-line no-undef
      XLSX.utils.sheet_add_aoa(ws, [head])
      sessionStorage.setItem('file_header', roa[0])
      sessionStorage.setItem('file_header_key', head)
      // const sheetData = []
      //   for (let i = 0; i < roa.length - 1; i += 1) {
      //     sheetData[i] = arrayConbine(roa[0], roa[i + 1]);
      //   }
      //   console.log(sheetData)
      // let rowObject = []
      workbook.SheetNames.forEach(sheet => {
        // eslint-disable-next-line no-undef
        const objArray = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet])
        const objString = JSON.stringify(objArray)
        sessionStorage.setItem('file_data', objString)
      })
      console.log(sessionStorage.getItem('file_data'))
    }
    fileReader.readAsBinaryString(selectedFile)
  }
  const arrayConbine = (keys, values) => {
    const result = {}
    const keycount = keys && keys.length
    let i = 0
    if (typeof keys !== 'object' || typeof values !== 'object' // Only accept arrays or array-like objects
      || typeof keycount !== 'number' || typeof values.length !== 'number' || !keycount) { // Require arrays to have a count
      return false
    }
    if (keycount !== values.length) {
      return false
    }
    for (i = 0; i < keycount; i += 1) {
      result[keys[i]] = values[i]
    }
    return result
  }

  return (
    <div>
      <div className="mt-3 flx">
        <b style={{ width: 200 }}>File Type: </b>
        <select className="btcd-paper-inp ml-2" style={{ width: 250 }}>
          <option value="EXCEL_FORMAT">Excel</option>
          <option value="CSV_FORMAT">CSV(Comma-separated Values)</option>
          <option value="TSV_FORMAT">TSV(Tab-separated Values)</option>
        </select>
      </div>
      <div className="mt-3 flx">
        <b style={{ width: 266 }}>Choose the file to Upload: </b>
        <input name="file" onChange={e => fileUpload(e)} type="file" id="file" className="btcd-paper-inp w-9" placeholder="file upload" />
      </div>
      <div>
        <button type="submit" className="btn btn-md blue btcd-mdl-btn">Next</button>
      </div>
    </div>
  )
}
