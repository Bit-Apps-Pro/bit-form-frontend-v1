/* eslint-disable no-undef */
import StyleAccordion from '../ChildComp/StyleAccordion'
import usePseudo from '../ChildComp/usePseudo'
import Range from '../ChildComp/Range'

export default function Height({ style, cls, styleConfig, styleDispatch, brkPoint }) {
  const [, pcls] = usePseudo(cls)
  const height = style?.[pcls]?.height || style?.[cls]?.height || '40px'

  const setHeight = value => {
    const property = 'height'
    const val = styleConfig.important ? `${value}!important` : value
    styleDispatch({ apply: [{ cls: pcls, property, delProp: false, value: val }], brkPoint })
  }

  return (
    <StyleAccordion className="style-acc w-9" title="Height">
      <div className="mt-2">
        <span className="f-5">Input Height</span>
        <Range
          info={[
            { icn: <i className="font-w-m">H</i>, lbl: 'Height' },
          ]}
          className="btc-range"
          unit="px"
          master={false}
          maxRange={100}
          minRange={40}
          value={height}
          onChange={setHeight}
        />
      </div>
    </StyleAccordion>
  )
}
