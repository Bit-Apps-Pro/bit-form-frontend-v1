import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import toast from 'react-hot-toast'
import { $bits } from '../../../GlobalStates'
import { sortByField } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import CheckBox from '../../Utilities/CheckBox'
import Cooltip from '../../Utilities/Cooltip'
import SnackMsg from '../../Utilities/SnackMsg'

const getTrimmedString = str => (typeof str === 'string' ? str?.trim() : str?.toString())

export const generateTermsOptions = (importOpts, lblKey, valKey) => {
  const { data, lbl, vlu } = importOpts
  if (!data || !lbl || !vlu) return []
  const presets = data
  return presets.map(op => ({ [lblKey]: getTrimmedString(op[lbl]), [valKey]: getTrimmedString(op[vlu]) }))
}

export default function TaxonomyImportOption({ importOpts, setImportOpts }) {
  const bits = useRecoilValue($bits)
  const { isPro } = bits
  const [snack, setsnack] = useState({ show: false })

  useEffect(() => {
    if (!isPro) return
    localStorage.removeItem('bf-options-taxanomy')
    const uri = new URL(bits.ajaxURL)
    uri.searchParams.append('action', 'bitforms_get_wp_taxonomy')
    uri.searchParams.append('_ajax_nonce', bits.nonce)

    const getFetchTerms = fetch(uri)
      .then(resp => resp.json())
      .then(res => {
        if (res.data) {
          const { allCategoreis, taxonomies } = res.data
          const tmpOpts = { ...importOpts }
          tmpOpts.data = allCategoreis
          localStorage.setItem('bf-options-categories', JSON.stringify(allCategoreis))
          localStorage.setItem('bf-options-taxanomy', JSON.stringify(taxonomies))
          tmpOpts.taxonomies = Object.values(taxonomies)
          tmpOpts.headers = Object.keys(tmpOpts.data[0])
          const [vlu, lbl] = tmpOpts.headers
          tmpOpts.lbl = lbl
          tmpOpts.vlu = vlu
          if (tmpOpts?.fieldObject === null) {
            tmpOpts.data = allCategoreis?.filter(item => item.taxonomy === 'category')
            tmpOpts.fieldObject = {
              fieldType: 'taxanomy_field',
              filter: { orderBy: 'term_id', taxanomy: 'category', order: 'ASC' },
              lebel: tmpOpts.lbl,
              value: tmpOpts.vlu,
              hiddenValue: tmpOpts?.vlu,
              oldOpt: [],
              isTaxonomy: false,
              isHierarchical: true,
              type: 'terms',
            }
          } else {
            const { fieldObject } = { ...tmpOpts }
            const { orderBy, order, taxanomy } = { ...fieldObject?.filter }
            tmpOpts.data = allCategoreis?.filter(item => item.taxonomy === taxanomy)
            const sortFieldData = sortByField(tmpOpts.data, orderBy, order)
            tmpOpts.data = sortFieldData
            tmpOpts.lbl = fieldObject?.lebel
            tmpOpts.vlu = fieldObject?.hiddenValue
            tmpOpts.fieldObject.isHierarchical = fieldObject?.isHierarchical
          }
          setImportOpts({ ...tmpOpts })
          return 'Successfully fetched wordpress terms.'
        }
        return 'terms data not found'
      })

    toast.promise(getFetchTerms, {
      success: data => data,
      failed: data => data,
      loading: __('Loading Terms...'),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleTaxonomyField = e => {
    const tmpOpts = { ...importOpts }
    if (e.target.checked) tmpOpts.fieldObject.isTaxonomy = true
    else tmpOpts.fieldObject.isTaxonomy = false
    setImportOpts({ ...tmpOpts })
  }

  const handleImportInput = e => {
    const { name, value } = e.target
    const tmpOpts = { ...importOpts }
    tmpOpts[name] = value
    const { fieldObject } = tmpOpts
    fieldObject.filter[name] = value
    const { orderBy, taxanomy, order } = fieldObject.filter
    let allCategories = localStorage.getItem('bf-options-categories')
    const taxanomies = JSON.parse(localStorage.getItem('bf-options-taxanomy'))
    allCategories = sortByField(JSON.parse(allCategories), orderBy, order)
    tmpOpts.data = allCategories?.filter(item => item.taxonomy === taxanomy)
    tmpOpts.fieldObject.isHierarchical = taxanomies?.find(tax => tax.name === taxanomy)?.hierarchical
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
              <b>Filter by Taxonomy</b>
              <select name="taxanomy" onChange={handleImportInput} value={importOpts?.fieldObject?.filter?.taxanomy || ''} className="btcd-paper-inp mt-1">
                {importOpts?.taxonomies?.map((taxonomy, key) => (
                  <option key={`imp-${key * 2}`} value={taxonomy?.name}>{`${taxonomy?.singular_name}-${taxonomy?.name}`}</option>
                ))}
              </select>
            </div>
          )}
          {!!importOpts?.data?.length && (
            <div>
              <div className="w-5 flx">
                <CheckBox onChange={handleTaxonomyField} title={__('Use Post Taxonomy Fields', 'bitform')} checked={importOpts?.fieldObject?.isTaxonomy === true} value={false} />
                <Cooltip width={250} icnSize={17} className="ml-1">
                  <div className="txt-body">
                    if selected then its work also post taxanomy field.
                    <br />
                  </div>
                </Cooltip>
              </div>

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

              {importOpts.headers && (
                <div className="flx mt-3 w-10">
                  <div className="w-5 mr-2">
                    <b>Label</b>
                    <select name="lbl" id="" className="btcd-paper-inp mt-1" onChange={handleImportInput} value={importOpts?.fieldObject?.lebel || ''}>
                      <option disabled>Select Label</option>
                      {importOpts.headers.map(op => (<option key={op} value={op}>{op}</option>))}
                    </select>
                  </div>
                  <div className="w-5">
                    <b>Value</b>
                    <select name="vlu" id="" className="btcd-paper-inp mt-1" onChange={handleImportInput} value={importOpts?.fieldObject?.hiddenValue || ''}>
                      <option disabled>Select Value</option>
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
