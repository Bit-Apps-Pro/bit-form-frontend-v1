import { __ } from '../../../../Utils/i18nwrap'
import StyleAccordion from '../ChildComp/StyleAccordion'
import ResponsiveBtns from '../ChildComp/ResponsiveBtns'
import Range from '../ChildComp/Range'
import BorderIcn from '../../../../Icons/BorderIcn'
import { spreadIn4Value } from '../../../../Utils/Helpers'

export default function Padding({ style, cls, styleConfig, styleDispatch, brkPoint, setResponsiveView }) {
  let padding = style?.[cls]?.padding || '0px 0px 0px 0px'
  padding = spreadIn4Value(padding)

  const setPadding = val => {
    const value = styleConfig.important ? `${val}!important` : val
    styleDispatch({ apply: [{ cls, property: 'padding', delProp: false, value }], brkPoint })
  }

  return (
    <StyleAccordion className="style-acc w-9" title={__('Padding', 'bitform')}>
      {'responsive' in styleConfig && <ResponsiveBtns brkPoint={brkPoint} setResponsiveView={setResponsiveView} />}

      <Range
        info={[
          { icn: <BorderIcn borderWidth="3px 1px 1px 1px" />, lbl: __('Padding Top', 'bitform') },
          { icn: <BorderIcn borderWidth="1px 3px 1px 1px" />, lbl: __('Padding Right', 'bitform') },
          { icn: <BorderIcn borderWidth="1px 1px 3px 1px" />, lbl: __('Padding Bottom', 'bitform') },
          { icn: <BorderIcn borderWidth="1px 1px 1px 3px" />, lbl: __('Padding Left', 'bitform') },
          { icn: <BorderIcn borderWidth="3px 3px 3px 3px" />, lbl: __('All Side', 'bitform') },
        ]}
        className="btc-range"
        unit="px"
        maxRange={50}
        value={padding}
        onChange={setPadding}
      />
    </StyleAccordion>
  )
}
