import { useState } from 'react'
import { __ } from '../../Utils/i18nwrap'
import bitsFetch from '../../Utils/bitsFetch'
import ConfirmModal from '../Utilities/ConfirmModal'
import Loader from '../Loaders/Loader'

import LoaderSm from '../Loaders/LoaderSm'

export default function DeleteCpt({ slug, snack, setsnack, posts }) {
  const [confMdl, setConfMdl] = useState({ show: false })

  const [isLoading, setLoading] = useState(false)
  const closeConfMdl = () => {
    confMdl.show = false
    setConfMdl({ ...confMdl })
  }

  const confDelete = (e) => {
    confMdl.show = true
    setConfMdl({ ...confMdl })
  }

  const handleDelete = e => {
    const postFilter = posts.filter(post => post.name !== slug)
    e.preventDefault()
    setLoading(true)
    closeConfMdl()
    e.preventDefault()
    bitsFetch({ postData: postFilter },
      'bitforms_delete_post_type').then((res) => {
      if (res !== undefined && res.success) {
        setsnack({ ...{ show: true, msg: __('Delete successfully, refresh your window', 'bitform') } })
      }
      setLoading(false)
    })
  }
  return (
    <div>
      <button type="button" onClick={(e) => confDelete(e)} className="btn f-left btcd-btn-lg blue sh-sm flx ml-4" disabled={isLoading}>
        {__('Delete Post Type', 'bitform')}
        {isLoading && <LoaderSm size={20} clr="#fff" className="ml-2" />}
      </button>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="red"
        btnTxt="Ok"
        show={confMdl.show}
        close={closeConfMdl}
        action={handleDelete}
        title={__('Confirmation', 'bitform')}
      >
        <div className="txt-center mt-5 mb-4">
          {__('Are you sure to delete post type?', 'bitform')}
        </div>
        {isLoading && (
          <Loader style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 45,
            transform: 'scale(0.5)',
          }}
          />
        )}
      </ConfirmModal>
    </div>
  )
}
