import { __ } from '../../../../Utils/i18nwrap'
import StyleAccordion from '../ChildComp/StyleAccordion'
import ResponsiveBtns from '../ChildComp/ResponsiveBtns'
import Range from '../ChildComp/Range'
import BorderIcn from '../../../../Icons/BorderIcn'
import { spreadIn4Value } from '../../../../Utils/Helpers'

export default function Margin({ style, cls, styleConfig, styleDispatch, brkPoint, setResponsiveView }) {
  let margin = style?.[cls]?.margin || '0px 0px 0px 0px'
  margin = spreadIn4Value(margin)

  const setMargin = val => {
    const value = styleConfig.important ? `${val}!important` : val
    styleDispatch({ apply: [{ cls, property: 'margin', delProp: false, value }], brkPoint })
  }

  return (
    <StyleAccordion className="style-acc w-9" title={__('Margin', 'bitform')}>
      {'responsive' in styleConfig && <ResponsiveBtns brkPoint={brkPoint} setResponsiveView={setResponsiveView} />}

      <Range
        info={[
          { icn: <BorderIcn borderWidth="3px 1px 1px 1px" />, lbl: __('Margin Top', 'bitform') },
          { icn: <BorderIcn borderWidth="1px 3px 1px 1px" />, lbl: __('Margin Right', 'bitform') },
          { icn: <BorderIcn borderWidth="1px 1px 3px 1px" />, lbl: __('Margin Bottom', 'bitform') },
          { icn: <BorderIcn borderWidth="1px 1px 1px 3px" />, lbl: __('Margin Left', 'bitform') },
          { icn: <BorderIcn borderWidth="3px 3px 3px 3px" />, lbl: __('All Side', 'bitform') },
        ]}
        className="btc-range"
        unit="px"
        maxRange={50}
        value={margin}
        onChange={setMargin}
      />
    </StyleAccordion>
  )
}
