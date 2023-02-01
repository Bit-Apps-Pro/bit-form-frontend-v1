/* eslint-disable max-len */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useEffect, useState, useRef } from 'react'
import { __ } from '../../Utils/i18nwrap'
import bitsFetch from '../../Utils/bitsFetch'
import TableCheckBox from '../Utilities/TableCheckBox'
import SnackMsg from '../Utilities/SnackMsg'
import LoaderSm from '../Loaders/LoaderSm'
import DeleteCpt from './DeleteCpt'

export default function AllCpt({ posts, types }) {
  const [chekcType, setchekcType] = useState(false)
  const [slugName, setSlugName] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [editPost, setEditPost] = useState({})
  const [snack, setsnack] = useState({ show: false })
  const formRef = useRef(null)

  const searchPostHandle = (slug) => {
    setSlugName(slug)
    const result = posts?.find(post => post.name === slug)
    setchekcType(true)
    setEditPost(result)
  }
  const handleUpdate = e => {
    e.preventDefault()
    const formData = new FormData(formRef.current)
    setLoading(true)
    e.preventDefault()
    bitsFetch(formData, 'bitforms_update_post_type')
      .then((res) => {
        if (res !== undefined && res.success) {
          setsnack({ ...{ show: true, msg: __('cpt type update successfully, refresh your window', 'bitform') } })
        }
        setLoading(false)
      })
  }

  const handleInput = (e, typ) => {
    const tmpData = { ...editPost }
    if (e.target.checked && typ === 'check') {
      tmpData[e.target.name] = 1
    } else {
      tmpData[e.target.name] = 0
    }
    if (typ === 'text') {
      tmpData[e.target.name] = e.target.value
    }
    setEditPost(tmpData)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setsnack} />
      <form
        method="POST"
        onSubmit={handleUpdate}
        ref={formRef}
        onKeyDown={e => {
          e.key === 'Enter'
            && e.target.tagName !== 'TEXTAREA'
            && e.preventDefault()
        }}
      >
        <div className="mt-2"><b>{__('Post Type', 'bitform')}</b></div>
        <select name="post_type" className="btcd-paper-inp mt-1" onChange={(e) => searchPostHandle(e.target.value)} value="">
          <option disabled value="">{__('Select Type *', 'bitform')}</option>
          {Object.values(types).map((type, key) => (
            <option key={`k${key * 43}`} value={type}>{type}</option>
          ))}
        </select>
        {chekcType && (
          <div>
            <div className="mt-2">
              <label htmlFor="slug">
                {__('Post Type Slug *', 'bitform')}
                <input id="name" name="name" className="btcd-paper-inp mt-1" onChange={(e) => handleInput(e, 'text')} placeholder="" value={editPost?.name} type="text" readOnly />
              </label>
            </div>
            <div className="mt-2">
              <label htmlFor="singular_label">
                {__('Singular Label *', 'bitform')}
                <input id="singular_label" name="singular_label" className="btcd-paper-inp mt-1" onChange={(e) => handleInput(e, 'text')} value={editPost?.singular_label} placeholder="(e.g. Video)" type="text" required />
              </label>
            </div>
            <div className="mt-2">
              <label htmlFor="singular_label">
                {__('Menu Name *', 'bitform')}
                <input id="menu_name" name="menu_name" onChange={(e) => handleInput(e, 'text')} value={editPost?.menu_name} className="btcd-paper-inp mt-1" placeholder="(e.g. My Videos)" type="text" required />
              </label>
            </div>
            <div className="mt-2">
              <label htmlFor="singular_label">
                {__('Menu Icon *', 'bitform')}
                <input id="menu_icon" name="menu_icon" onChange={(e) => handleInput(e, 'text')} value={editPost?.menu_icon} className="btcd-paper-inp mt-1" placeholder="" type="text" />
                <span className="mt-1">
                  <a target="blank" href="https://developer.wordpress.org/resource/dashicons/#admin-site-alt">Dashicon class name </a>
                  {' '}
                  to use for icon.
                </span>
              </label>
            </div>
            <div className="d-flx flx-wrp">
              <TableCheckBox onChange={(e) => handleInput(e, 'check')} checked={editPost?.public === 1} className="wdt-200 mt-4 mr-2" name="public" value={editPost?.public} title={__('public', 'bitform')} subTitle={__('Posts of this type should be shown in the admin UI and is publicly queryable', 'bitform')} />
              <TableCheckBox onChange={(e) => handleInput(e, 'check')} checked={editPost?.public_queryable === 1} className="wdt-200 mt-4 mr-2" value={editPost?.public_queryable} name="public_queryable" style={{ marginLeft: 60 }} title={__('Publicly Queryable', 'bitform')} subTitle={__('Queries can be performed on the front end as part of parse_request()', 'bitform')} />
            </div>
            <div className="d-flx flx-wrp">
              <TableCheckBox onChange={(e) => handleInput(e, 'check')} checked={editPost?.show_in_rest === 1} className="wdt-200 mt-4 mr-2" value={editPost?.show_in_rest} name="show_in_rest" title={__('Show in REST API', 'bitform')} subTitle={__('To show this post type data in the WP REST API', 'bitform')} />
              <TableCheckBox onChange={(e) => handleInput(e, 'check')} checked={editPost?.show_in_menu === 1} className="wdt-200 mt-4 mr-2" value={editPost?.show_in_menu} name="show_in_menu" style={{ marginLeft: 60 }} title={__('Show in Menu', 'bitform')} subTitle={__('This show the post type in the admin menu and where to show that menu', 'bitform')} />
            </div>
            <div className="d-flx flx-wrp">
              <TableCheckBox onChange={(e) => handleInput(e, 'check')} checked={editPost?.show_ui === 1} name="show_ui" className="wdt-200 mt-4 mr-2 " value={editPost?.show_ui} title={__('Show UI', 'bitform')} subTitle={__('Generate a default UI for managing this post type', 'bitform')} />
            </div>
            <div className="d-flx flx-wrp">
              <button type="submit" className="btn f-left btcd-btn-lg blue sh-sm flx" disabled={isLoading}>
                {__('Update Post Type', 'bitform')}
                {isLoading && <LoaderSm size={20} clr="#fff" className="ml-2" />}
              </button>
              {'  '}
              <DeleteCpt
                slug={slugName}
                stack={snack}
                setsnack={setsnack}
                posts={posts}
              />
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
