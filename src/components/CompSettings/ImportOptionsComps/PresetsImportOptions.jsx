import { useEffect, useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { useRecoilValue } from 'recoil'
import { $bits } from '../../../GlobalStates'
import LoaderSm from '../../Loaders/LoaderSm'

export default function PresetsImportOptions({ importOpts, setImportOpts }) {
  const bits = useRecoilValue($bits)
  const { isPro } = bits
  const [loading, setLoading] = useState(false)
  const presetVersion = 1.1
  const presetURL = 'https://static.bitapps.pro/bitform/options-presets.json'

  useEffect(() => {
    if (!isPro) return
    let oldPresets = localStorage.getItem('bf-options-presets')
    const tmpOpts = { ...importOpts }
    if (oldPresets) {
      oldPresets = JSON.parse(oldPresets)
    }

    if (!oldPresets || (oldPresets && Number(oldPresets.version) < presetVersion)) {
      setLoading(true)
      fetch(presetURL)
        .then(resp => resp.json())
        .then(res => {
          if (res.data) {
            const { data } = res
            tmpOpts.data = formatData(data)
            tmpOpts.presetOpts = formatOpts(data)
            localStorage.setItem('bf-options-presets', JSON.stringify(res))
            setImportOpts({ ...tmpOpts })
          }
          setLoading(false)
        })
    } else {
      const { data } = oldPresets
      tmpOpts.data = formatData(data)
      tmpOpts.presetOpts = formatOpts(data)
      setImportOpts({ ...tmpOpts })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formatData = data => data.reduce((newData, item) => ({ ...newData, ...item.childs }), {})
  const formatOpts = data => data.map(item => ({ title: item.title, type: 'group', childs: Object.keys(item.childs).map(opt => ({ label: opt, value: opt })) }))

  const setPresetName = val => {
    const tmpOpts = { ...importOpts }
    tmpOpts.preset = val
    if (val && tmpOpts?.data?.[val]?.length) {
      tmpOpts.headers = Object.keys(tmpOpts.data[val][0])
      const [lbl] = tmpOpts.headers
      tmpOpts.lbl = lbl
      tmpOpts.vlu = lbl
    } else {
      delete tmpOpts.headers
      delete tmpOpts.lbl
      delete tmpOpts.vlu
    }
    setImportOpts({ ...tmpOpts })
  }

  const handleImportInput = e => {
    const tmpOpts = { ...importOpts }
    const { name, value } = e.target
    tmpOpts[name] = value
    setImportOpts({ ...tmpOpts })
  }

  return (
    <div className="mt-2">
      {loading && (
        <div className="flx mb-2">
          <LoaderSm size={20} clr="#022217" className="mr-1" />
          <p className="m-0">Presets are loading from server. This process is only for the first time.</p>
        </div>
      )}
      <div>
        <b>Preset</b>
        <MultiSelect
          className="btcd-paper-drpdwn mt-1 w-10"
          options={importOpts.presetOpts}
          defaultValue={importOpts.preset}
          onChange={setPresetName}
          singleSelect
          closeOnSelect
        />
      </div>
      {importOpts.headers && (
        <div className="flx mt-3 w-10">
          <div className="w-5 mr-2">
            <b>Label</b>
            <select name="lbl" id="" className="btcd-paper-inp mt-1" onChange={handleImportInput} value={importOpts.lbl || ''}>
              <option value="">Select Label</option>
              {importOpts.headers.map(op => (<option key={op} value={op}>{op}</option>))}
            </select>
          </div>
          <div className="w-5">
            <b>Value</b>
            <select name="vlu" id="" className="btcd-paper-inp mt-1" onChange={handleImportInput} value={importOpts.vlu || ''}>
              <option value="">Select Value</option>
              {importOpts.headers.map(op => (<option key={op} value={op}>{op}</option>))}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}
