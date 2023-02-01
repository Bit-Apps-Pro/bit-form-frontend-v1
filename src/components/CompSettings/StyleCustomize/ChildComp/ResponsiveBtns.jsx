import { __ } from '../../../../Utils/i18nwrap'

export default function ResponsiveBtns({ brkPoint, setResponsiveView }) {
  return (
    <div className="resp-btn pos-rel flx">
      {[
        { lbl: 'sm', icn: 'phone_android', tip: __('Phone View', 'bitform') },
        { lbl: 'md', icn: 'tablet_android', tip: __('Tablet View', 'bitform') },
        { lbl: 'lg', icn: 'laptop_mac', tip: __('Laptop View', 'bitform') }]
        .map(itm => (
          <button
            key={itm.icn}
            title={itm.tip}
            onClick={() => setResponsiveView(itm.lbl)}
            className={`br-50 flx mr-1 ${itm.lbl === brkPoint && 'blue'}`}
            type="button"
            aria-label="reponcive view"
          >
            <span className={`btcd-icn icn-${itm.icn}`} />
          </button>
        ))}
    </div>
  )
}
