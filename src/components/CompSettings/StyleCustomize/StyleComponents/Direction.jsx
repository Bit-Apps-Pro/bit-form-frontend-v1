/* eslint-disable no-undef */

import { __ } from '../../../../Utils/i18nwrap'
import StyleAccordion from '../ChildComp/StyleAccordion'

export default function Direction({ style, cls, styleConfig, styleDispatch, brkPoint }) {
  const dir = style?.[cls]?.direction || 'ltr'

  const setDirecation = value => {
    const property = 'direction'
    styleDispatch({ apply: [{ cls, property, delProp: false, value }], brkPoint })
  }

  return (
    <StyleAccordion className="style-acc w-9" title={__('Direction', 'bitform')}>
      <div className="mt-2 flx flx-between">
        <span className="f-5">{__('Content Direction', 'bitform')}</span>
        <select value={dir} className="btcd-paper-inp w-7" onChange={e => setDirecation(e.target.value)}>
          <option value="ltr">{__('Left to Right', 'bitform')}</option>
          <option value="rtl">{__('Right to Left', 'bitform')}</option>
        </select>
      </div>
    </StyleAccordion>
  )
}
