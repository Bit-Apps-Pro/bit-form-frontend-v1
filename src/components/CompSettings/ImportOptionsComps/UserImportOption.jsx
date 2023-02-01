import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import toast from 'react-hot-toast'
import { __ } from '../../../Utils/i18nwrap'
import { sortByField } from '../../../Utils/Helpers'
import { $bits } from '../../../GlobalStates'
import SnackMsg from '../../Utilities/SnackMsg'

const getTrimmedString = str => (typeof str === 'string' ? str?.trim() : str?.toString())
export const generateUserOptions = (importOpts, lblKey, valKey) => {
  const { data, lbl, vlu } = importOpts
  if (!data || !lbl || !vlu) return []
  const presets = data
  return presets.map(op => ({ [lblKey]: getTrimmedString(op[lbl]), [valKey]: getTrimmedString(op[vlu]) }))
}

export default function UserImportOption({ importOpts, setImportOpts }) {
  const bits = useRecoilValue($bits)
  const { isPro } = bits
  const [snack, setsnack] = useState({ show: false })

  useEffect(() => {
    if (!isPro) return

    const uri = new URL(bits.ajaxURL)
    uri.searchParams.append('action', 'bitforms_get_wp_users')
    uri.searchParams.append('_ajax_nonce', bits.nonce)

    const getFetchUsers = fetch(uri)
      .then(resp => resp.json())
      .then(res => {
        if (res.data) {
          const { users } = res.data
          const tmpOpts = { ...importOpts }
          tmpOpts.data = users
          localStorage.setItem('bf-options-users', JSON.stringify(users))
          tmpOpts.headers = Object.keys(tmpOpts.data[0])
          const [lbl] = tmpOpts.headers
          tmpOpts.lbl = lbl
          tmpOpts.vlu = lbl
          if (tmpOpts?.fieldObject === null) {
            tmpOpts.fieldObject = {
              fieldType: 'user_field',
              filter: { orderBy: 'ID', role: 'all', order: 'ASC' },
              lebel: tmpOpts.lbl,
              value: tmpOpts.vlu,
              hiddenValue: tmpOpts?.vlu,
              oldOpt: [],
              type: 'user',
            }
          } else {
            const { fieldObject } = { ...tmpOpts }
            const { orderBy, order, role } = { ...fieldObject?.filter }
            const sortFieldData = sortByField(tmpOpts.data, orderBy, order)
            if (role !== 'all') tmpOpts.data = sortFieldData?.filter(item => item.role[0] === role)
            else tmpOpts.data = sortFieldData
            tmpOpts.lbl = fieldObject?.lebel
            tmpOpts.vlu = fieldObject?.hiddenValue
          }
          setImportOpts({ ...tmpOpts })
          return 'Successfully fetched users data.'
        }
        return 'users data not found'
      })

    toast.promise(getFetchUsers, {
      success: data => data,
      failed: data => data,
      loading: __('Loading Users...'),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleImportInput = e => {
    const { name, value } = e.target
    const tmpOpts = { ...importOpts }
    if (name === 'lbl' || name === 'vlu') tmpOpts[name] = value
    const { fieldObject } = tmpOpts
    fieldObject.filter[name] = value
    const { orderBy, order, role } = fieldObject.filter
    let users = localStorage.getItem('bf-options-users')
    users = sortByField(JSON.parse(users), orderBy, order)
    if (role !== 'all') tmpOpts.data = users?.filter(item => item.role[0] === role)
    else tmpOpts.data = users
    tmpOpts.fieldObject.lebel = tmpOpts?.lbl
    tmpOpts.fieldObject.hiddenValue = tmpOpts?.vlu
    setImportOpts({ ...tmpOpts })
  }

  return (
    <div className="mt-2">
      <div>
        <SnackMsg snack={snack} setSnackbar={setsnack} />

        <div>
          {!!importOpts?.data && (
            <div className="w-10 mr-2">
              <b>Filter by Role</b>
              <select name="role" onChange={handleImportInput} value={importOpts?.fieldObject?.filter?.role || ''} className="btcd-paper-inp mt-1">
                <option selected disabled>select role</option>
                <option value="all">all</option>
                <option value="administrator">Administrator</option>
                <option value="author">Author</option>
                <option value="contributor">Contributor</option>
                <option value="editor">Editor</option>
                <option value="subscriber">Subscriber</option>
              </select>
            </div>
          )}

          {!!importOpts?.data?.length && (
            <div>
              <div className="flx mt-3 w-10">
                <div className="w-5 mr-2">
                  <b>Order By</b>
                  <select name="orderBy" onChange={handleImportInput} value={importOpts?.fieldObject?.filter?.orderBy || ''} className="btcd-paper-inp mt-1">
                    {importOpts?.headers?.map(op => (<option key={op} value={op}>{op}</option>))}
                  </select>
                </div>
                <div className="w-5 mr-2">
                  <b>Order</b>
                  <select name="order" onChange={handleImportInput} value={importOpts?.fieldObject?.filter?.order || ''} className="btcd-paper-inp mt-1">
                    <option value="ASC">Ascending</option>
                    <option value="DESC">Descending</option>
                  </select>
                </div>
              </div>

              {importOpts?.headers && (
                <div className="flx mt-3 w-10">
                  <div className="w-5 mr-2">
                    <b>Label</b>
                    <select name="lbl" id="" className="btcd-paper-inp mt-1" onChange={handleImportInput} value={importOpts?.fieldObject?.lebel || ''}>
                      <option value="">Select Label</option>
                      {importOpts?.headers?.map(op => (<option key={op} value={op}>{op}</option>))}
                    </select>
                  </div>
                  <div className="w-5">
                    <b>Value</b>
                    <select name="vlu" id="" className="btcd-paper-inp mt-1" onChange={handleImportInput} value={importOpts?.fieldObject?.hiddenValue || ''}>
                      <option value="">Select Value</option>
                      {importOpts?.headers?.map(op => (<option key={op} value={op}>{op}</option>))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
