import { __ } from '../../../../Utils/i18nwrap'
import StyleAccordion from '../ChildComp/StyleAccordion'
import BtnGrp from '../ChildComp/BtnGrp'
import ColorPicker from '../ChildComp/ColorPicker'
import Range from '../ChildComp/Range'
import usePseudo from '../ChildComp/usePseudo'
import ResponsiveBtns from '../ChildComp/ResponsiveBtns'
import BorderIcn from '../../../../Icons/BorderIcn'
import BlurIcn from '../../../../Icons/BlurIcn'
import SpreadIcn from '../../../../Icons/SpreadIcn'
import InsideIcn from '../../../../Icons/InsideIcn'
import NoneIcn from '../../../../Icons/NoneIcn'

export default function Shadow({ style, cls, styleConfig, styleDispatch, brkPoint, setResponsiveView }) {
  const [pseudo, pcls, setPseudo] = usePseudo(cls)

  let shadw = style?.[pcls]?.['box-shadow'] || style?.[cls]?.['box-shadow']
  let shadwClr = ''
  let shadwTyp = 'None'
  let shadwInset = ''

  if (shadw !== undefined) {
    if (shadw.match(/inset/g)) {
      shadwTyp = 'Inside'
      shadwInset = 'inset'
    } else {
      shadwTyp = 'Outside'
    }
    const sd = shadw.replace('inset', '').trim().split(' ')
    shadw = sd.slice(0, 4).join(' ')
    shadwClr = sd.slice(4, sd.length).join(' ')
  }

  const setShadwType = (typ) => {
    const isImportant = styleConfig.important ? '!important' : ''
    if (typ === 'Outside') {
      if (style?.[pcls]?.['box-shadow'] === undefined) {
        styleDispatch({ apply: [{ cls: pcls, property: 'box-shadow', delProp: false, value: `0px 0px 8px -5px rgba(0, 0, 0, 1)${isImportant}` }], brkPoint })
      } else {
        const replaceOld = style?.[pcls]?.['box-shadow'].replace('inset', '')
        styleDispatch({ apply: [{ cls: pcls, property: 'box-shadow', delProp: false, value: replaceOld }], brkPoint })
      }
    } else if (typ === 'Inside') {
      if (style?.[pcls]?.['box-shadow'] === undefined) {
        styleDispatch({ apply: [{ cls: pcls, property: 'box-shadow', delProp: false, value: `0px 0px 8px -5px rgba(0, 0, 0, 1) inset${isImportant}` }], brkPoint })
      } else if (!style?.[pcls]?.['box-shadow'].match(/inset/g)) {
        const replaceOld = `${style?.[pcls]?.['box-shadow']} inset`
        styleDispatch({ apply: [{ cls: pcls, property: 'box-shadow', delProp: false, value: replaceOld }], brkPoint })
      }
    } else if (typ === 'None') {
      styleDispatch({ apply: [{ cls: pcls, property: 'box-shadow', delProp: true, value: '' }], brkPoint })
    }
  }

  const setShadow = val => {
    const value = (styleConfig.important && !val.match(/!important/g)) ? `${val}!important` : val
    styleDispatch({ apply: [{ cls: pcls, property: 'box-shadow', delProp: false, value }], brkPoint })
  }

  return (
    <StyleAccordion className="style-acc w-9" title={__('Shadow', 'bitform')}>
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
                { lbl: __('Default', 'bitform'), icn: 'Default' },
                ...('hover' in styleConfig ? [{ lbl: __('On Mouse Over', 'bitform'), icn: 'Hover' }] : []),
                ...('focus' in styleConfig ? [{ lbl: __('On Focus', 'bitform'), icn: 'Focus' }] : []),
              ]}
            />
          </div>
        )}
      <div className="flx flx-between mt-2">
        <span className="f-5">{__('Type', 'bitform')}</span>
        <BtnGrp
          value={shadwTyp}
          onChange={setShadwType}
          btns={[
            { lbl: __('Inside', 'bitform'), icn: <InsideIcn /> },
            { lbl: __('Outside', 'bitform'), icn: <SpreadIcn /> },
            { lbl: __('None', 'bitform'), icn: <NoneIcn /> },
          ]}
        />
      </div>
      {shadwTyp !== 'None' && (
        <>
          <div className="flx flx-between mb-2 mt-2">
            <span className="f-5">{__('Shadow Color', 'bitform')}</span>
            <ColorPicker alwGradient={false} value={shadwClr} onChange={clr => setShadow(`${shadw} ${clr.style} ${shadwInset}`)} />
          </div>
          <span className="f-5">{__('Shadow Style', 'bitform')}</span>
          <Range
            info={[
              { icn: <BorderIcn borderWidth="1px 4px 1px 4px" />, lbl: 'X-axis' },
              { icn: <BorderIcn borderWidth="4px 1px 4px 1px" />, lbl: 'Y-axis' },
              { icn: <BlurIcn />, lbl: 'Blur' },
              { icn: <SpreadIcn />, lbl: 'Spread' },
            ]}
            className="btc-range"
            unit="px"
            master={false}
            maxRange={10}
            minRange={-10}
            value={shadw}
            onChange={val => setShadow(`${val} ${shadwClr} ${shadwInset}`)}
          />
        </>
      )}
    </StyleAccordion>
  )
}
