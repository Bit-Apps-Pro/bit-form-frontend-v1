import { Link } from 'react-router-dom'
import CopyIcn from '../../Icons/CopyIcn'
import EditIcn from '../../Icons/EditIcn'
import TrashIcn from '../../Icons/TrashIcn'

export default function MenuBtn(props) {
  const handleMenuClose = (e) => {
    const el = e.target
    setTimeout(() => {
      el.parentNode.children[1].classList.remove('btcd-m-a')
      el.parentNode.parentNode.parentNode.style.zIndex = 'auto'
    }, 100)
  }

  const hadleClick = (e) => {
    if (e.target.parentNode.children[1].classList.contains('btcd-m-a')) {
      e.target.parentNode.children[1].classList.remove('btcd-m-a')
      e.target.parentNode.parentNode.parentNode.style.zIndex = 'auto'
      e.target.blur()
    } else {
      e.target.parentNode.parentNode.parentNode.style.zIndex = 10
      e.target.parentNode.children[1].classList.add('btcd-m-a')
    }
  }

  return (
    <div className="btcd-menu">
      <button className="btcd-menu-btn btcd-mnu sh-sm" onClick={hadleClick} onBlur={handleMenuClose} aria-label="toggle menu" type="button" />
      <div className="btcd-menu-list">
        <Link to={`/form/builder/edit/${props.formID}/fs`} type="button" className="flx" aria-label="actions">
          <EditIcn size={16} />
          &nbsp;
          Edit
        </Link>
        <button type="button" aria-label="actions" className="flx" onClick={props.dup}>
          <CopyIcn size={26} />
          &nbsp;
          Duplicate
        </button>
        <button type="button" aria-label="actions" className="flx" onClick={props.export}>
          <span className="btcd-icn icn-file_download" />
          &nbsp;
          Export
        </button>
        <button type="button" aria-label="actions" className="flx" onClick={props.del}>
          <TrashIcn size={15} />
          &nbsp;
          Delete
        </button>
      </div>
    </div>
  )
}
