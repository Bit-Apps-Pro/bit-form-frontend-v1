import { useSetRecoilState } from 'recoil'
import { $selectedFieldId } from '../../GlobalStates'
import BackIcn from '../../Icons/BackIcn'
import { __ } from '../../Utils/i18nwrap'

export default function Back2FldList() {
  const setSelectedFieldId = useSetRecoilState($selectedFieldId)
  return (
    <div className="flx cp" onClick={() => setSelectedFieldId(null)} type="button" role="button" tabIndex="0" onKeyPress={() => setSelectedFieldId(null)}>
      <button className="icn-btn" type="button" aria-label="back to field list">
        <BackIcn />
      </button>
      <h4>{__('All Field List', 'bitform')}</h4>
    </div>
  )
}
