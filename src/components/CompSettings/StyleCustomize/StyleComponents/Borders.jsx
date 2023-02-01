import { __ } from '../../../../Utils/i18nwrap'
import Range from '../ChildComp/Range'
import StyleAccordion from '../ChildComp/StyleAccordion'
import BtnGrp from '../ChildComp/BtnGrp'
import ColorPicker from '../ChildComp/ColorPicker'
import usePseudo from '../ChildComp/usePseudo'
import ResponsiveBtns from '../ChildComp/ResponsiveBtns'
import NoneIcn from '../../../../Icons/NoneIcn'
import BdrDoubleIcn from '../../../../Icons/BdrDoubleIcn'
import BdrDashIcn from '../../../../Icons/BdrDashIcn'
import BdrDottedIcn from '../../../../Icons/BdrDottedIcn'
import BdrSolidIcn from '../../../../Icons/BdrSolidIcn'
import BorderIcn from '../../../../Icons/BorderIcn'
import { spreadIn4Value } from '../../../../Utils/Helpers'

export default function Borders({ style, cls, styleConfig, styleDispatch, brkPoint, setResponsiveView }) {
  const [pseudo, pcls, setPseudo] = usePseudo(cls)
  const bdrStyle = style?.[pcls]?.['border-style']?.replace(/!important/g, '') || style?.[cls]?.['border-style']?.replace(/!important/g, '') || 'None'
  const bdrClr = style?.[pcls]?.['border-color'] || style?.[cls]?.['border-color']
  let bdrW = style?.[pcls]?.['border-width'] || style?.[cls]?.['border-width']
  let bdrRad = style?.[pcls]?.['border-radius'] || style?.[cls]?.['border-radius']
  bdrW = spreadIn4Value(bdrW)
  bdrRad = spreadIn4Value(bdrRad)

  const setBdrStyle = bStyle => {
    const actions = [
      { cls: pcls, property: 'border-style', delProp: false, value: 'solid' },
      { cls: pcls, property: 'border-width', delProp: false, value: '1px 1px 1px 1px' },
      { cls: pcls, property: 'border-color', delProp: false, value: 'rgba(0, 0, 0, 1)' },
      { cls: pcls, property: 'border-radius', delProp: false, value: '0px 0px 0px 0px' },
    ]
    if (bStyle === 'None' && style?.[pcls]) {
      actions[0].delProp = true
      actions[1].delProp = true
      actions[2].delProp = true
      actions[3].delProp = true
    } else {
      actions[0].value = styleConfig.important ? `${bStyle}!important` : bStyle
      if (style?.[pcls]?.['border-width']) {
        actions[1].value = style?.[pcls]?.['border-width']
      }
      if (style?.[pcls]?.['border-color']) {
        actions[2].value = style?.[pcls]?.['border-color']
      }
      if (style?.[pcls]?.['border-radius']) {
        actions[3].value = style?.[pcls]?.['border-radius']
      }
    }
    styleDispatch({ apply: actions, brkPoint })
  }

  const setBdr = (property, val) => {
    const value = styleConfig.important ? `${val}!important` : val
    styleDispatch({ apply: [{ cls: pcls, property, delProp: false, value }], brkPoint })
  }

  return (
    <StyleAccordion className="style-acc w-9" title={__('Border', 'bitform')}>
      {('hover' in styleConfig
        || 'focus' in styleConfig
        || 'responsive' in styleConfig)
        && (
          <div className="flx flx-between">
            {'responsive' in styleConfig && <ResponsiveBtns brkPoint={brkPoint} setResponsiveView={setResponsiveView} />}
            <BtnGrp
              className="txt-center"
              value={pseudo}
              onChange={setPseudo}
              btns={[
                { lbl: 'Default', icn: 'Default' },
                ...('hover' in styleConfig ? [{ lbl: 'On Mouse Over', icn: 'Hover' }] : []),
                ...('focus' in styleConfig ? [{ lbl: 'On Focus', icn: 'Focus' }] : []),
              ]}
            />
          </div>
        )}
      <div className="flx flx-between mt-2">
        <span className="f-5">{__('Type', 'bitform')}</span>
        <BtnGrp
          value={bdrStyle}
          onChange={setBdrStyle}
          btns={[
            { lbl: 'solid', icn: <BdrSolidIcn /> },
            { lbl: 'dotted', icn: <BdrDottedIcn /> },
            { lbl: 'dashed', icn: <BdrDashIcn /> },
            { lbl: 'double', icn: <BdrDoubleIcn /> },
            { lbl: 'None', icn: <NoneIcn /> },
          ]}
        />
      </div>

      {bdrClr && (
        <div className="flx flx-between mt-2">
          <span className="f-5">{__('Border Color', 'bitform')}</span>
          <ColorPicker alwGradient={false} value={bdrClr} onChange={clr => setBdr('border-color', clr.style)} />
        </div>
      )}

      {styleConfig.width && bdrW && (
        <div className="mt-2">
          <span className="f-5">{__('Border Width', 'bitform')}</span>
          <Range
            info={[
              { icn: <BorderIcn borderWidth="3px 1px 1px 1px" />, lbl: 'Border Top' },
              { icn: <BorderIcn borderWidth="1px 3px 1px 1px" />, lbl: 'Border Right' },
              { icn: <BorderIcn borderWidth="1px 1px 3px 1px" />, lbl: 'Border Bottom' },
              { icn: <BorderIcn borderWidth="1px 1px 1px 3px" />, lbl: 'Border Left' },
              { icn: <BorderIcn borderWidth="3px 3px 3px 3px" />, lbl: 'All Side' },
            ]}
            className="btc-range"
            unit="px"
            maxRange={20}
            value={bdrW}
            onChange={val => setBdr('border-width', val)}
          />
        </div>
      )}
      {styleConfig.radius && bdrRad && (
        <div className="mt-2">
          <span className="f-5">{__('Border Radius', 'bitform')}</span>
          <Range
            info={[
              { icn: <BorderIcn borderRadius="6px 1px 1px 1px" />, lbl: 'Radius Top Left' },
              { icn: <BorderIcn borderRadius="1px 6px 1px 1px" />, lbl: 'Radius Top Right' },
              { icn: <BorderIcn borderRadius="1px 1px 6px 1px" />, lbl: 'Radius Bottom Right' },
              { icn: <BorderIcn borderRadius="1px 1px 1px 6px" />, lbl: 'Radius Bottom Left' },
              { icn: <BorderIcn />, lbl: 'All Side' },
            ]}
            className="btc-range"
            unit="px"
            maxRange={30}
            value={bdrRad}
            onChange={val => setBdr('border-radius', val)}
          />
        </div>
      )}
    </StyleAccordion>
  )
}
