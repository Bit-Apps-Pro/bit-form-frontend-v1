/* eslint-disable no-param-reassign */

import { __ } from '../../../Utils/i18nwrap'
import TableCheckBox from '../../Utilities/TableCheckBox'

export default function RapidmailActions({ rapidmailConf, setRapidmailConf, formFields }) {
  const actionHandler = (e, type) => {
    const newConf = { ...rapidmailConf }
    if (type === 'send_activationmail') {
      if (e.target.checked) {
        newConf.actions.send_activationmail = true
      } else {
        delete newConf.actions.send_activationmail
      }
    }
    setRapidmailConf({ ...newConf })
  }

  return (

    <div className="pos-rel d-flx w-8">
      <TableCheckBox checked={rapidmailConf.actions?.send_activationmail || false} onChange={(e) => actionHandler(e, 'send_activationmail')} className="wdt-200 mt-4 mr-2" value="send_activationmail" title={__('Send Activation Email', 'bitform')} subTitle={__('Add Send Activation Email', 'bitform')} />
    </div>
  )
}
