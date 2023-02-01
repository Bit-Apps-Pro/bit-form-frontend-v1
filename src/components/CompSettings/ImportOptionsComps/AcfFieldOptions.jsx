/* eslint-disable prefer-destructuring */
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import toast from 'react-hot-toast'
import { __ } from '../../../Utils/i18nwrap'
import { $bits } from '../../../GlobalStates'
import SnackMsg from '../../Utilities/SnackMsg'

export const generateAcfOptions = (importOpts, lblKey, valKey) => {
  // eslint-disable-next-line no-nested-ternary
  const trim = str => (str ? (typeof str === 'string' ? str.trim() : str.toString().trim()) : '')
  const { options, lbl, vlu } = importOpts
  if (!options || !lbl || !vlu) return []
  const presets = options
  // return presets.map(op => ({ [lblKey]: (op[lbl]), [valKey]: (op[vlu]) }))
  return presets.map(op => ({ [lblKey]: trim(op[lbl]), [valKey]: trim(op[vlu]) }))
}

export default function AcfFieldOptions({ importOpts, setImportOpts }) {
  const bits = useRecoilValue($bits)
  const isPro = typeof bits !== 'undefined' && bits.isPro
  // const [loading, setLoading] = useState(false)
  const [snack, setsnack] = useState({ show: false })

  useEffect(() => {
    if (!isPro) return

    const uri = new URL(bits.ajaxURL)
    uri.searchParams.append('action', 'bitforms_get_acf_group_fields')
    uri.searchParams.append('_ajax_nonce', bits.nonce)

    // setLoading(true)
    const getGroupFields = fetch(uri)
      .then(resp => resp.json())
      .then(res => {
        if (res.data) {
          const data = res.data
          const tmpOpts = { ...importOpts }
          localStorage.setItem('bf-options-acf_field_op', JSON.stringify(data))
          tmpOpts.groups = res.data
          tmpOpts.lbl = 1
          tmpOpts.vlu = 0
          if (tmpOpts?.fieldObject === null) {
            tmpOpts.fieldObject = {
              fieldType: 'acf_options',
              filter: { fieldkey: '' },
              type: 'acf',
              oldOpt: [],
            }
          } else {
            const { fieldObject } = { ...tmpOpts }
            const { fieldkey } = { ...fieldObject?.filter }
            const filder = tmpOpts.groups?.find(item => item?.key === fieldkey)
            tmpOpts.options = Object.entries(filder?.choices)
            tmpOpts.keys = Object.keys(tmpOpts.options)
            tmpOpts.vlu = tmpOpts?.keys[tmpOpts?.vlu]
            tmpOpts.lbl = tmpOpts?.keys[tmpOpts?.lbl]
          }

          setImportOpts({ ...tmpOpts })
          // setLoading(false)
          return 'Successfully fetched ACF fields options.'
        }
        // setLoading(false)
        return 'ACF fields options not found'
      })

    toast.promise(getGroupFields, {
      success: data => data,
      failed: data => data,
      loading: __('Loading ACF fields...'),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleImportInput = e => {
    const { name, value } = e.target
    const tmpOpts = { ...importOpts }
    tmpOpts.fieldObject.filter[name] = value
    const options = localStorage.getItem('bf-options-acf_field_op')
    const fieldkey = tmpOpts.fieldObject?.filter?.fieldkey
    const filder = JSON.parse(options)?.find(item => item?.key === fieldkey)
    tmpOpts.options = Object.entries(filder?.choices)
    tmpOpts.keys = Object.keys(tmpOpts.options)
    tmpOpts.vlu = tmpOpts?.keys[tmpOpts?.vlu]
    tmpOpts.lbl = tmpOpts?.keys[tmpOpts?.lbl]
    setImportOpts({ ...tmpOpts })
  }

  return (
    <div className="mt-2">
      <SnackMsg snack={snack} setSnackbar={setsnack} />
      <div>
        <div>
          {!!importOpts?.groups && (
            <div className="flx mt-3 w-10">
              <div className="w-10 mr-2">
                <b>ACF Options Field</b>
                <select name="fieldkey" onChange={handleImportInput} value={importOpts?.fieldObject?.filter?.fieldkey || ''} className="btcd-paper-inp mt-1">
                  <option value="">select option</option>
                  {importOpts?.groups?.map((group, key) => (
                    <option key={`imp-${key * 2}`} value={group.key}>
                      {`${group.group_title}-${group.name}`}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  )
}
