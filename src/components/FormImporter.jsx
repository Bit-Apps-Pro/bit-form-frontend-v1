/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react'
import { useSetRecoilState } from 'recoil'
import bitsFetch from '../Utils/bitsFetch'
import { deepCopy } from '../Utils/Helpers'
import { $forms } from '../GlobalStates'
import { formsReducer } from '../Utils/Reducers'
import LoaderSm from './Loaders/LoaderSm'

export default function FormImporter({ setModal, setTempModal, newFormId, setSnackbar }) {
  const setForms = useSetRecoilState($forms)
  const [importProp, setImportProp] = useState({ prop: ['all', 'additional', 'confirmation', 'workFlows', 'mailTem', 'integrations', 'reports'] })
  const [error, setError] = useState({ formDetail: '', prop: '' })
  const [isLoading, setLoading] = useState(false)
  const handleChange = (ev) => {
    if (error[ev.target.name]) {
      setError({ ...error, [ev.target.name]: '' })
    }
    if (ev.target.type === 'checkbox') {
      const tempProp = importProp.prop
      if (ev.target.checked && tempProp.indexOf(ev.target.value) < 0) {
        if (ev.target.value === 'all') {
          setImportProp({ ...importProp, prop: ['all', 'additional', 'confirmation', 'workFlows', 'mailTem', 'integrations', 'reports'] })
          return
        }
        tempProp.push(ev.target.value)
      }
      if (!ev.target.checked && tempProp.indexOf(ev.target.value) > -1) {
        // eslint-disable-next-line no-unused-expressions
        delete tempProp[tempProp.indexOf(ev.target.value)]
      }

      if (
        tempProp.indexOf('additional') < 0
        || tempProp.indexOf('confirmation') < 0
        || tempProp.indexOf('workFlows') < 0
        || tempProp.indexOf('mailTem') < 0
        || tempProp.indexOf('integrations') < 0
        || tempProp.indexOf('reports') < 0
      ) {
        delete tempProp[tempProp.indexOf('all')]
      }
      setImportProp({ ...importProp, prop: tempProp })
    } else {
      const file = ev.target.files[0]
      if (!file || file.type !== 'application/json') {
        setError({ ...error, formDetail: 'Please select an exported json file' })
        ev.target.value = ''
      } else {
        const reader = new FileReader()
        reader.readAsText(ev.target.files[0])
        reader.onload = () => {
          checkFile(reader.result, ev.target)
        }
      }
    }
  }
  const checkFile = (data, file) => {
    let formDetail = {}
    try {
      formDetail = JSON.parse(data)
    } catch (err) {
      setError({ ...error, formDetail: 'Please select an exported json file' })
      file.value = ''
    }
    if (formDetail && formDetail.layout && formDetail.fields) {
      setImportProp({ ...importProp, formDetail })
    } else {
      setError({ ...error, formDetail: 'Please select an exported json file' })
      file.value = ''
    }
  }
  const handleImport = () => {
    if (!importProp.formDetail?.layout || !importProp.formDetail?.fields) {
      setError({ ...error, formDetail: 'Please select an exported json file' })
      return
    }
    const formDetail = deepCopy(importProp.formDetail)
    for (const p of ['additional', 'workFlows', 'reports']) {
      if (importProp.prop.indexOf(p) === -1) {
        delete formDetail[p]
      }
    }
    if (formDetail.formSettings) {
      for (const p of ['confirmation', 'mailTem', 'integrations']) {
        if (importProp.prop.indexOf(p) === -1) {
          delete formDetail.formSettings[p]
        }
      }
    }
    setLoading(true)
    bitsFetch({ formDetail, newFormId }, 'bitforms_import_aform').then(response => {
      if (response.success) {
        const { data } = response
        setForms(allforms => formsReducer(allforms, { type: 'add', data: { formID: data.id, status: true, formName: data.form_name, shortcode: `bitform id='${data.id}'`, entries: 0, views: 0, conversion: 0.00, created_at: data.created_at } }))
        setSnackbar({ show: true, msg: data.message })
        setTempModal(false)
        setModal(false)
      } else if (response?.data) {
        setSnackbar({ show: true, msg: response.data })
      }
      setLoading(false)
    })
  }
  return (
    <div className="flx flx-col flx-center mt-4">
      <div className="fld-wrp">
        <input
          type="file"
          accept=".json"
          name="formDetail"
          onChange={handleChange}
        />
        {error.formDetail && <span className="btcd-btn-o-red">{error.formDetail}</span>}
      </div>
      <br />
      <br />
      <div className="fld-wrp">
        <div className="fld-lbl">Please select property you want to import with form</div>
        <div className="no-drg fld btcd-ck-con btcd-round">
          <label className="btcd-ck-wrp">
            <span>All</span>
            <input
              value="all"
              type="checkbox"
              defaultChecked
              checked={importProp.prop.indexOf('all') >= 0}
              name="prop"
              onChange={handleChange}
            />
            <span className="btcd-mrk ck" />
          </label>
          <label className="btcd-ck-wrp">
            <span>Form Settings</span>
            <input
              value="additional"
              type="checkbox"
              defaultChecked
              checked={importProp.prop.indexOf('additional') >= 0}
              name="prop"
              onChange={handleChange}
            />
            <span className="btcd-mrk ck" />
          </label>
          <label className="btcd-ck-wrp">
            <span>Confirmations</span>
            <input
              value="confirmation"
              type="checkbox"
              defaultChecked
              checked={importProp.prop.indexOf('confirmation') >= 0}
              name="prop"
              onChange={handleChange}
            />
            <span className="btcd-mrk ck" />
          </label>
          <label className="btcd-ck-wrp">
            <span>Conditional Logics</span>
            <input
              value="workFlows"
              type="checkbox"
              defaultChecked
              checked={importProp.prop.indexOf('workFlows') >= 0}
              name="prop"
              onChange={handleChange}
            />
            <span className="btcd-mrk ck" />
          </label>
          <label className="btcd-ck-wrp">
            <span>Email Templates</span>
            <input
              value="mailTem"
              type="checkbox"
              defaultChecked
              checked={importProp.prop.indexOf('mailTem') >= 0}
              name="prop"
              onChange={handleChange}
            />
            <span className="btcd-mrk ck" />
          </label>
          <label className="btcd-ck-wrp">
            <span>Integrations</span>
            <input
              value="integrations"
              type="checkbox"
              defaultChecked
              checked={importProp.prop.indexOf('integrations') >= 0}
              name="prop"
              onChange={handleChange}
            />
            <span className="btcd-mrk ck" />
          </label>
        </div>
      </div>
      <div className="flx flx-between w-5">
        <button onClick={() => setModal(false)} className="btn round btcd-btn-lg blue blue-sh" type="button"> Cancel </button>
        <button onClick={handleImport} className="btn round btcd-btn-lg blue blue-sh" type="button" disabled={isLoading}>
          Import
          {isLoading && <LoaderSm size={20} clr="#fff" className="ml-2" />}
        </button>
      </div>
    </div>
  )
}
