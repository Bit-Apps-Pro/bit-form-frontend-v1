/* eslint-disable max-len */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useEffect, useRef, useState } from 'react'
import bitsFetch from '../../Utils/bitsFetch'
import { __ } from '../../Utils/i18nwrap'
import LoaderSm from '../Loaders/LoaderSm'
import SnackMsg from '../Utilities/SnackMsg'
import TableCheckBox from '../Utilities/TableCheckBox'

export default function Cpt({ settab, types }) {
  const [snack, setsnack] = useState({ show: false })
  const [cptConfig, setCptConfig] = useState({
    public: 1,
    public_queryable: 1,
    show_in_rest: 1,
    show_in_menu: 1,
    show_ui: 1,
  })

  const [isLoading, setLoading] = useState(false)
  const formRef = useRef(null)

  const handleSubmit = (e) => {
    const formData = new FormData(formRef.current)
    setLoading(true)
    e.preventDefault()
    bitsFetch(formData,
      'bitforms_add_post_type')
      .then((res) => {
        if (res !== undefined && res.success) {
          setsnack({ ...{ show: true, msg: __('cpt added successfully, refresh your window', 'bitform') } })
          document.getElementById('form').reset()
        }
        setLoading(false)
      })
  }

  const handleAction = (e, type) => {
    const newConf = { ...cptConfig }
    if (e.target.checked && type === 'check') {
      newConf[e.target.name] = 1
    } else {
      newConf[e.target.name] = 0
    }
    if (type === 'text') {
      newConf[e.target.name] = e.target.value
    }
    setCptConfig(newConf)
  }

  const existPostType = val => {
    const exists = types.find(post => post === val)
    if (exists) {
      document.getElementById('slug').value = ''
      alert('Slug already exists')
    }
  }

  return (
    <>
      <SnackMsg snack={snack} setSnackbar={setsnack} />
      <form
        method="POST"
        id="form"
        onSubmit={handleSubmit}
        ref={formRef}
        onKeyDown={e => {
          e.key === 'Enter'
            && e.target.tagName !== 'TEXTAREA'
            && e.preventDefault()
        }}
      >

        <div className="mt-3">
          <label htmlFor="slug">
            <b>{__('Post Type Slug *', 'bitform')}</b>
            <input id="slug" name="slug" onChange={e => existPostType(e.target.value)} className="btcd-paper-inp mt-1" placeholder="(e.g. slug)" type="text" required />
          </label>
        </div>
        <div className="mt-2">
          <label htmlFor="singular_label">
            <b>{__('Singular Label *', 'bitform')}</b>
            <input id="singular_label" name="singular_label" className="btcd-paper-inp mt-1" placeholder="(e.g. Video)" type="text" required />
          </label>
        </div>
        <div className="mt-2">
          <label htmlFor="menu_name">
            <b>{__('Menu Name *', 'bitform')}</b>
            <input id="menu_name" name="menu_name" className="btcd-paper-inp mt-1" placeholder="(e.g. My Videos)" type="text" required />
          </label>
        </div>
        <div className="mt-2">
          <label htmlFor="menu_icon">
            <b>{__('Menu Icon ', 'bitform')}</b>
            <input id="menu_icon" name="menu_icon" className="btcd-paper-inp mt-1" style={{ marginBottom: 6 }} placeholder="(e.g. dashicons-admin-site-alt)" type="text" />
            <small className="mt-1">
              <a className="btcd-link" target="blank" href="https://developer.wordpress.org/resource/dashicons/#admin-site-alt">Dashicon class name </a>
              to use for icon.
            </small>
          </label>
        </div>
        <div className="d-flx flx-wrp">
          <TableCheckBox onChange={(e) => handleAction(e, 'check')} checked={!!cptConfig.public} className="wdt-200 mt-4 mr-2" name="public" value={cptConfig.public} title={<b>{__('Public', 'bitform')}</b>} subTitle={__('This type should be shown in the admin UI and is publicly queryable', 'bitform')} />
          <TableCheckBox onChange={(e) => handleAction(e, 'check')} checked={!!cptConfig.public_queryable} className="wdt-200 mt-4 mr-2" value={cptConfig.public_queryable} name="public_queryable" style={{ marginLeft: 60 }} title={<b>{__('Publicly Queryable', 'bitform')}</b>} subTitle={__('Queries can be performed on the front end as part of parse_request()', 'bitform')} />
          <TableCheckBox onChange={(e) => handleAction(e, 'check')} checked={!!cptConfig.show_in_rest} className="wdt-200 mt-4 mr-2" value={cptConfig.show_in_rest} name="show_in_rest" title={<b>{__('Show in REST API', 'bitform')}</b>} subTitle={__('To show this post type data in the WP REST API', 'bitform')} />
        </div>
        <div className="d-flx flx-wrp">
          <TableCheckBox onChange={(e) => handleAction(e, 'check')} checked={!!cptConfig.show_in_menu} className="wdt-200 mt-4 mr-2" value={cptConfig.show_in_menu} name="show_in_menu" style={{ marginLeft: 60 }} title={<b>{__('Show in Menu', 'bitform')}</b>} subTitle={__('This show the post type in the admin menu and where to show that menu.', 'bitform')} />
          <TableCheckBox onChange={(e) => handleAction(e, 'check')} checked={!!cptConfig.show_ui} name="show_ui" className="wdt-200 mt-4 mr-2 " value={cptConfig.show_ui} title={<b>{__('Show UI', 'bitform')}</b>} subTitle={__('Whether or not to generate a default UI for managing this post type', 'bitform')} />
        </div>
        <button type="submit" className="btn btcd-btn-lg blue flx" disabled={isLoading}>
          {__('Add Post Type', 'bitform')}
          {isLoading && <LoaderSm size={20} clr="#fff" className="ml-2" />}
        </button>

      </form>
    </>
  )
}
