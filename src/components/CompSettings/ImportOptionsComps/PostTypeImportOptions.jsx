/* eslint-disable prefer-destructuring */
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import toast from 'react-hot-toast'
import { $bits } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import { sortByField } from '../../../Utils/Helpers'
import LoaderSm from '../../Loaders/LoaderSm'
import SnackMsg from '../../Utilities/SnackMsg'

export const generatePostOptions = (importOpts, lblKey, valKey) => {
  const { data, lbl, vlu } = importOpts
  if (!data || !lbl || !vlu) return []
  const presets = data
  return presets.map(op => ({ [lblKey]: (op[lbl]).trim(), [valKey]: (op[vlu]).trim() }))
}

export default function PostTypeImportOptions({ importOpts, setImportOpts }) {
  const bits = useRecoilValue($bits)
  const isPro = typeof bits !== 'undefined' && bits.isPro
  const [snack, setsnack] = useState({ show: false })

  useEffect(() => {
    if (!isPro) return

    const uri = new URL(bits.ajaxURL)
    uri.searchParams.append('action', 'bitforms_get_wp_posts')
    uri.searchParams.append('_ajax_nonce', bits.nonce)

    const getWpPosts = fetch(uri)
      .then(resp => resp.json())
      .then(res => {
        if (res.data) {
          const { posts, postTypes } = res.data
          const tmpOpts = { ...importOpts }
          tmpOpts.data = posts
          localStorage.setItem('bf-options-posts', JSON.stringify(posts))
          tmpOpts.postTypes = Object.values(postTypes)
          tmpOpts.headers = Object.keys(tmpOpts.data[0])
          tmpOpts.lbl = tmpOpts.headers[6]
          tmpOpts.vlu = tmpOpts.headers[0]
          if (tmpOpts?.fieldObject === null) {
            tmpOpts.data = posts?.filter(item => item?.post_type === 'post')
            tmpOpts.fieldObject = {
              fieldType: 'post_field',
              filter:
              {
                orderBy: 'ID',
                order: 'ASC',
                postType: 'post',
                postStatus: 'all',
              },
              lebel: tmpOpts.lbl,
              value: tmpOpts.vlu,
              hiddenValue: tmpOpts?.vlu,
              oldOpt: [],
              type: 'post',
            }
          } else {
            const { fieldObject } = { ...tmpOpts }
            const { orderBy, order, postType, postStatus } = { ...fieldObject?.filter }
            const sortFieldData = sortByField(tmpOpts.data, orderBy, order)
            if (postStatus !== 'all') {
              tmpOpts.data = sortFieldData?.filter(item => item?.post_status === postStatus && item?.post_type === postType)
            } else {
              tmpOpts.data = sortFieldData
            }
            tmpOpts.lbl = fieldObject?.lebel
            tmpOpts.vlu = fieldObject?.hiddenValue
          }
          setImportOpts({ ...tmpOpts })
          return 'Successfully fetched wordpress posts.'
        }
        return 'posts not found'
      })

    toast.promise(getWpPosts, {
      success: data => data,
      failed: data => data,
      loading: __('Loading Posts...'),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleImportInput = e => {
    const { name, value } = e.target
    const tmpOpts = { ...importOpts }
    tmpOpts[name] = value
    const { fieldObject } = tmpOpts
    fieldObject.filter[name] = value
    const { orderBy, order, postType, postStatus } = fieldObject.filter
    let allPosts = localStorage.getItem('bf-options-posts')
    allPosts = sortByField(JSON.parse(allPosts), orderBy, order)
    if (postStatus !== 'all') {
      tmpOpts.data = allPosts?.filter(item => item?.post_status === postStatus && item?.post_type === postType)
    } else {
      tmpOpts.data = allPosts?.filter(item => item?.post_type === postType)
    }
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
            <div className="flx mt-3 w-10">
              <div className="w-5 mr-2">
                <b>Filter by Post Type</b>
                <select name="postType" onChange={handleImportInput} value={importOpts.fieldObject?.filter?.postType || ''} className="btcd-paper-inp mt-1">
                  {importOpts?.postTypes?.map((type, key) => (
                    <option key={`imp-${key * 2}`} value={type.name}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div className="w-5 mr-2">
                <b>Filter by Post Status</b>
                <select name="postStatus" onChange={handleImportInput} value={importOpts?.fieldObject?.filter?.postStatus || ''} className="btcd-paper-inp mt-1">
                  <option disabled selected>select status</option>
                  <option value="all">All</option>
                  <option value="publish">Publish</option>
                  <option value="draft">Draft</option>
                  <option value="auto-draft">Auto-Draft</option>
                  <option value="private">Private</option>
                  <option value="pending">Pending</option>
                  <option value="trash">Trash</option>
                </select>
              </div>

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
                  <select name="order" onChange={handleImportInput} value={importOpts.fieldObject?.filter?.order || ''} className="btcd-paper-inp mt-1">
                    <option value="ASC">Ascending</option>
                    <option value="DESC">Descending</option>
                  </select>
                </div>
              </div>

              {importOpts.headers && (
                <div className="flx mt-3 w-10">
                  <div className="w-5 mr-2">
                    <b>Label</b>
                    <select name="lbl" id="" className="btcd-paper-inp mt-1" onChange={handleImportInput} value={importOpts?.fieldObject?.lebel || ''}>
                      <option value="">Select Label</option>
                      {importOpts.headers.map(op => (<option key={op} value={op}>{op}</option>))}
                    </select>
                  </div>
                  <div className="w-5">
                    <b>Value</b>
                    <select name="vlu" id="" className="btcd-paper-inp mt-1" onChange={handleImportInput} value={importOpts?.fieldObject?.hiddenValue || ''}>
                      <option value="">Select Value</option>
                      {importOpts.headers.map(op => (<option key={op} value={op}>{op}</option>))}
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
