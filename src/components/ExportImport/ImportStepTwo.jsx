import { useState } from 'react'
import { Tab, TabList, Tabs } from 'react-tabs'

export default function ImportStepTwo({ fileResponses, fileColumns, tableColumns }) {
  const [mappingCount, setMappingCount] = useState(0)
  const [mappingColumn, setMappingColumn] = useState([])

  const fieldMaping = e => {
    const field = e.target.options[e.target.options.selectedIndex].text
    const filedmappError = `${field} has already been mapped with ${field} from file`
    if (mappingColumn.includes(e.target.value)) {
      // confirm(filedmappError)
      const mapOver = confirm(filedmappError)
      if (mapOver === true) {
        setMappingColumn(mappingColumn.splice(mappingColumn.indexOf(e.target.value), 1))
        setMappingColumn([...mappingColumn, e.target.value])
      } else {
        e.target.options.selectedIndex = 0
      }
    } else {
      setMappingCount(mappingCount + 1)
      setMappingColumn([...mappingColumn, e.target.value])
    }
  }
  const resetMapping = () => {
    const selections = document.querySelectorAll('.btcd-paper-inp')
    if (typeof selections !== 'undefined' && selections.length > 0) {
      for (let i = 0; i <= selections.length - 1; i += 1) {
        selections[i].options.selectedIndex = 0
        setMappingCount(0)
        setMappingColumn([])
      }
    }
  }
  return (
    <div>
      <div className="mt-3 flx">
        <b style={{ width: 400 }}>First row of the data is field label names </b>
      </div>
      <p>
        All Mapped(
        {mappingCount}
        )   Unmapped (
        {tableColumns.length - mappingCount}
        )
      </p>
      <Tabs
        selectedTabClassName="s-t-l-active"
      >
        <TabList className="flx mt-2 mb-2">
          <Tab className="btcd-s-tab-link">
            Field Map
          </Tab>
          <Tab className="btcd-s-tab-link">
            Assign Default Value
          </Tab>
        </TabList>
      </Tabs>
      {' '}
      <table style={{ width: '100%', overflowX: 'scroll', overflowY: 'scroll' }}>
        <thead>
          <tr>
            <th>FIELDS IN FILE</th>
            <th>FIELDS IN Bitform</th>
          </tr>
        </thead>
        <tbody>
          {tableColumns.map((value, index) => (
            <tr>
              <td style={{ textAlign: 'center' }}>
                <select className="btcd-paper-inp ml-2" onChange={e => fileValue(e)}>
                  <option selected>Select Field</option>
                  {fileColumns.map((val) => (
                    <option value={val} selected={false}>{val}</option>
                  ))}
                </select>
              </td>
              <td style={{ textAlign: 'center' }} key={`imp-${index * 2}`}>
                <select className="btcd-paper-inp ml-2" onChange={e => fieldMaping(e)}>
                  <option selected>Select Field</option>
                  {tableColumns.map((col) => (
                    <option value={col.accessor} selected={false}>{col.Header}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <span
          className="wdt-100"
          role="button"
          tabIndex="-1"
          style={{ cursor: 'pointer' }}
          onClick={() => resetMapping()}
          onKeyPress={() => resetMapping()}
        >
          Reset Field Mapping
        </span>
      </div>
      <h5>Preview Data </h5>
      {' '}
      <table className="f-table" style={{ overflowX: 'scroll', overflowY: 'scroll' }}>
        <tr className="tr">
          {fileColumns.map((value, index) => (
            <th className="th" key={`imp-${index * 2}`}>{value}</th>
          ))}
        </tr>
        {JSON.parse(fileResponses).map((response, key) => (
          <tr key={`imp-${key * 2}`}>
            {/* <td style={{ textAlign: 'center' }}>{response.}</td> */}
          </tr>
        ))}
      </table>
      <div>
        <button type="submit" className="btn btn-md blue btcd-mdl-btn">Import Data</button>
        {'  '}
        <button type="button" className="btn btn-md white btcd-mdl-btn">Cancel</button>
      </div>
    </div>
  )
}
