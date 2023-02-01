import produce from 'immer'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, NavLink, useRouteMatch } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { $mailTemplates } from '../GlobalStates'
import CopyIcn from '../Icons/CopyIcn'
import EditIcn from '../Icons/EditIcn'
import TrashIcn from '../Icons/TrashIcn'
import bitsFetch from '../Utils/bitsFetch'
import { deepCopy } from '../Utils/Helpers'
import { __ } from '../Utils/i18nwrap'
import Button from './Utilities/Button'
import ConfirmModal from './Utilities/ConfirmModal'
import Table from './Utilities/Table'

export default function AllEmailTemplates({ formID }) {
  const [mailTem, setMailTem] = useRecoilState($mailTemplates)
  const [confMdl, setconfMdl] = useState({ show: false })

  const { url } = useRouteMatch()

  const duplicateTem = i => {
    const newMailTemObj = produce(mailTem, draft => {
      draft.splice(i + 1, 0, { title: draft[i].title, sub: draft[i].sub, body: draft[i].body })
      draft.push({ updateTem: 1 })
    })
    setMailTem(newMailTemObj)
  }

  const delTem = (i, templateData) => {
    if (templateData.original.id) {
      const deletePromise = bitsFetch({ formID, id: templateData.original.id }, 'bitforms_delete_mailtemplate')
        .then(res => {
          if (res !== undefined && res.success) {
            const mailTemp = deepCopy(mailTem)
            mailTemp.splice(i, 1)
            setMailTem(mailTemp)
          }
        })
      toast.promise(deletePromise, {
        loading: 'Deleting',
        success: 'Successfully Deleted',
        error: 'Error Occurred',
      })
    } else {
      const mailTemp = deepCopy(mailTem)
      mailTemp.splice(i, 1)
      setMailTem(mailTemp)
    }
  }

  const closeConfMdl = () => {
    confMdl.show = false
    setconfMdl({ ...confMdl })
  }
  const temDelConf = (i, templateData) => {
    confMdl.btnTxt = __('Delete', 'bitform')
    confMdl.body = __('Are you sure to delete this template', 'bitform')
    confMdl.btnClass = ''
    confMdl.action = () => { delTem(i, templateData); closeConfMdl() }
    confMdl.show = true
    setconfMdl({ ...confMdl })
  }

  const temDupConf = i => {
    confMdl.btnTxt = __('Duplicate', 'bitform')
    confMdl.body = __('Are you sure to duplicate this template?', 'bitform')
    confMdl.btnClass = 'blue'
    confMdl.action = () => { duplicateTem(i); closeConfMdl() }
    confMdl.show = true
    setconfMdl({ ...confMdl })
  }
  const col = [
    {
      Header: __('Template Name', 'bitform'),
      accessor: 'title',
      Cell: row => (
        <NavLink to={`${url}/${row.row.index}`}>
          <b>{row.cell.value}</b>
        </NavLink>
      ),
    },
    {
      Header: __('Action', 'bitform'),
      accessor: 'action',
      Cell: row => (
        <>
          <Button onClick={() => temDupConf(row.row.index)} className="icn-btn mr-2 tooltip pos-rel" style={{ '--tooltip-txt': `'${__('Duplicate', 'bitform')}'` }}>
            <CopyIcn size="22" />
          </Button>
          <NavLink to={`${url}/${row.row.index}`} className="icn-btn mr-2 flx flx-center tooltip pos-rel" style={{ '--tooltip-txt': `'${__('Edit', 'bitform')}'` }}>
            <EditIcn size="22" />
          </NavLink>
          <Button onClick={() => temDelConf(row.row.index, row.row)} className="icn-btn tooltip pos-rel" style={{ '--tooltip-txt': `'${__('Delete', 'bitform')}'` }}>
            <TrashIcn size="21" />
          </Button>
        </>
      ),
    },
  ]

  return (
    <div className="w-7">
      <ConfirmModal
        show={confMdl.show}
        close={closeConfMdl}
        btnTxt={confMdl.btnTxt}
        btnClass={confMdl.btnClass}
        body={confMdl.body}
        action={confMdl.action}
      />
      <h2>{__('Email Templates', 'bitform')}</h2>
      <h5>
        How to setup Email Templates & Send Email Notification:
        &nbsp;
        <a href="https://youtu.be/HpMUF5EO-Gg" target="_blank" rel="noreferrer" style={{ color: 'red' }}>
          YouTube
        </a>
      </h5>
      <div className="">
        <Link to={`${url}/new`} className="btn blue">
          <span className="btcd-icn icn-layout" />
          &nbsp;
          {__('Add New Template', 'bitform')}
        </Link>
        {mailTem.length > 0 ? (
          <Table
            height="60vh"
            className="btcd-neu-table mr-1"
            columns={col}
            data={mailTem}
          />
        )
          : (
            <div className="txt-center btcd-empty">
              <span className="btcd-icn icn-stack" />
              {__('Empty', 'bitform')}
            </div>
          )}
      </div>
    </div>
  )
}
