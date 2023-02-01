/* eslint-disable no-undef */

import { __ } from '../../../../Utils/i18nwrap'
import StyleAccordion from '../ChildComp/StyleAccordion'
import BtnGrp from '../ChildComp/BtnGrp'
import ColorPicker from '../ChildComp/ColorPicker'
import usePseudo from '../ChildComp/usePseudo'
import ResponsiveBtns from '../ChildComp/ResponsiveBtns'
import ColorIcn from '../../../../Icons/ColorIcn'
import NoneIcn from '../../../../Icons/NoneIcn'

const setPlceholderPseudo = (browserPrefix, cls) => {
  const clss = cls.split(',')
  return `${clss.join(`:${browserPrefix}placeholder,`)}:${browserPrefix}placeholder`
}

export default function Color({ style, cls, styleConfig, styleDispatch, brkPoint, setResponsiveView, formID }) {
  const [pseudo, pcls, setPseudo] = usePseudo(cls)
  const clr = style?.[pcls]?.color || style?.[cls]?.color
  const placeholderClr = style?.[setPlceholderPseudo(':', pcls)]?.color || style?.[setPlceholderPseudo(':', cls)]?.color
  const clrTyp = clr ? 'Color' : 'None'
  const placeholderClrTyp = placeholderClr ? 'Color' : 'None'

  const setClr = colr => {
    const value = styleConfig.important ? `${colr.style}!important` : colr.style
    const action = { apply: [{ cls: pcls, property: 'color', delProp: false, value }], brkPoint }
    if (styleConfig.checkBoxColor) {
      action.apply.push({ cls: `.fld-${formID}>.btcd-ck-wrp span:first-child`, property: 'color', delProp: false, value })
    }
    styleDispatch(action)
  }

  const setPlcholderClr = colr => {
    styleDispatch({
      apply: [
        { cls: setPlceholderPseudo(':', pcls), property: 'color', delProp: false, value: `${colr.style}!important` },
        { cls: setPlceholderPseudo(':-webkit-input-', pcls), property: 'color', delProp: false, value: `${colr.style}!important` },
        { cls: setPlceholderPseudo(':-ms-input-', pcls), property: 'color', delProp: false, value: `${colr.style}!important` },
        { cls: setPlceholderPseudo('-ms-input-', pcls), property: 'color', delProp: false, value: `${colr.style}!important` },
      ],
      brkPoint,
    })
  }

  const setClrTyp = typ => {
    const actn = { apply: [{ cls: pcls, property: 'color', delProp: false, value: 'rgba(0, 0, 0, 1)' }], brkPoint }
    if (typ === 'None' && style[cls].color) {
      actn.apply[0].delProp = true
    }
    styleDispatch(actn)
  }

  const setPlaceholderClrTyp = typ => {
    let delProp = false
    if (typ === 'None' && style[setPlceholderPseudo(':', pcls)].color) {
      delProp = true
    }
    const actn = {
      apply: [
        { cls: setPlceholderPseudo(':', pcls), property: 'color', delProp, value: 'rgba(0, 0, 0, 1)!important' },
        { cls: setPlceholderPseudo(':-webkit-input-', pcls), property: 'color', delProp, value: 'rgba(0, 0, 0, 1)!important' },
        { cls: setPlceholderPseudo(':-ms-input-', pcls), property: 'color', delProp, value: 'rgba(0, 0, 0, 1)!important' },
        { cls: setPlceholderPseudo('-ms-input-', pcls), property: 'color', delProp, value: 'rgba(0, 0, 0, 1)!important' },
      ],
      brkPoint,
    }
    styleDispatch(actn)
  }

  return (
    <StyleAccordion className="style-acc w-9" title={__('Color', 'bitform')}>
      {('hover' in styleConfig
        || 'focus' in styleConfig
        || 'responsive' in styleConfig)
        && (
          <div className="flx flx-between">
            {'responsive' in styleConfig && <ResponsiveBtns brkPoint={brkPoint} setResponsiveView={setResponsiveView} />}

            {('hover' in styleConfig
              || 'focus' in styleConfig)
              && (
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
              )}
          </div>
        )}
      <div className="flx flx-between mt-2">
        <span className="f-5">{__('Text Color', 'bitform')}</span>
        <BtnGrp
          value={clrTyp}
          onChange={setClrTyp}
          btns={[
            { lbl: __('Color', 'bitform'), icn: <ColorIcn /> },
            { lbl: __('None', 'bitform'), icn: <NoneIcn /> },
          ]}
        />
      </div>
      {clrTyp !== 'None' && (
        <div className="flx flx-between mt-2">
          <span className="f-5">{__('Color', 'bitform')}</span>
          <ColorPicker alwGradient={false} value={clr} onChange={setClr} />
        </div>
      )}
      {'placeholder' in styleConfig && (
        <div className="flx flx-between mt-2">
          <span className="f-5">{__('Placeholder Color', 'bitform')}</span>
          <BtnGrp
            value={placeholderClrTyp}
            onChange={setPlaceholderClrTyp}
            btns={[
              { lbl: __('Color', 'bitform'), icn: <ColorIcn /> },
              { lbl: __('None', 'bitform'), icn: <NoneIcn /> },
            ]}
          />
        </div>
      )}

      {'placeholder' in styleConfig && placeholderClrTyp !== 'None' && (
        <div className="flx flx-between mt-2">
          <span className="f-5">{__('Placeholder Color', 'bitform')}</span>
          <ColorPicker alwGradient={false} value={placeholderClr} onChange={setPlcholderClr} />
        </div>
      )}
    </StyleAccordion>
  )
}
