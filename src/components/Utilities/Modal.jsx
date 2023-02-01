import { CSSTransition } from 'react-transition-group'
import CloseIcn from '../../Icons/CloseIcn'

export default function Modal({ show, setModal, sm, lg, style, className, title, warning, hdrActn, children, subTitle, autoHeight, onCloseMdl = null }) {
  const handleClickOutside = e => {
    if (e.target.classList.contains('btcd-modal-wrp')) {
      if (onCloseMdl) {
        onCloseMdl()
      } else {
        setModal(false)
      }
    }
  }

  const handleCloseBtnClick = () => {
    if (onCloseMdl) {
      onCloseMdl()
    } else {
      setModal(false)
    }
  }

  return (
    <CSSTransition
      in={show}
      timeout={210}
      classNames="btc-mdl-trn"
      unmountOnExit
    >
      <div
        role="button"
        tabIndex={0}
        onKeyPress={handleClickOutside}
        onClick={handleClickOutside}
        className="btcd-modal-wrp"
      >
        <div
          className={`btcd-modal ${sm ? 'btcd-m-sm' : ''} ${lg ? 'btcd-m-lg' : ''} ${className} ${autoHeight ? 'auto-height' : ''}`}
          style={style}
        >
          <div className="btcd-modal-content">
            {hdrActn}
            <button onClick={handleCloseBtnClick} className="icn-btn btcd-mdl-close" aria-label="modal-close" type="button"><CloseIcn size={16} stroke={3} /></button>
            {typeof title === 'string' && <h2 className="btcd-mdl-title flx" style={{ color: warning ? 'red' : '' }}>{title}</h2>}
            {typeof title === 'object' && title}
            <small className="btcd-mdl-subtitle">{subTitle}</small>
            {!sm && <div className="btcd-mdl-div" />}
            {children}
          </div>
        </div>
      </div>
    </CSSTransition>
  )
}
