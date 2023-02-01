import { useEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

StyleAccordion.defaultProps = {
  onOpen: () => { },
  open: false,
}

export default function StyleAccordion({ className, title, children, open, onOpen }) {
  const [tgl, setTgl] = useState(open)
  const [H, setH] = useState(0)

  const toggleAccordion = (val) => {
    setTgl(val)
    val && onOpen()
  }

  useEffect(() => {
    toggleAccordion(open)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <div className={`${className} ${tgl && 'active'}`}>
      <div
        className="btgl"
        tabIndex="0"
        role="button"
        onClick={() => toggleAccordion(!tgl)}
        onKeyPress={() => toggleAccordion(!tgl)}
      >
        <div className="flx flx-between">
          <span>{title}</span>
          <span className={`btcd-icn icn-${tgl ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}`} />
        </div>
      </div>

      <div style={{ height: H, transition: 'height 300ms' }}>
        <CSSTransition
          in={tgl}
          timeout={300}
          onEntering={el => setH(el.offsetHeight)}
          onEntered={() => setH('auto')}
          onExit={el => setH(el.offsetHeight)}
          onExiting={() => setH(0)}
          unmountOnExit
        >
          <div className="body">
            {children}
          </div>
        </CSSTransition>
      </div>
    </div>
  )
}
