import { memo, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import { __ } from '../../Utils/i18nwrap'
import FormEntryNotes from './FormEntryNotes'
import FormEntryPayments from './FormEntryPayments'
import FormEntryTimeline from './FormEntryTimeline'
import Modal from '../Utilities/Modal'
import GoogleAdInfo from './GoogleAdInfo'
import { $fieldLabels } from '../../GlobalStates'

function EntryRelatedInfo({ formID, entryID, rowDtl, setSnackbar, integrations, close }) {
  const allLabels = useRecoilValue($fieldLabels)
  const payPattern = /paypal|razorpay/
  const paymentFields = allLabels.filter(label => label.type.match(payPattern))
  return (
    <Modal lg show setModal={close} title={__('Related Info', 'bitform')}>
      <Tabs
        selectedTabClassName="s-t-l-active"
      >
        <TabList className="flx m-0">
          {!!(paymentFields?.length) && (
            <Tab className="btcd-s-tab-link">
              {__('Payment', 'bitform')}
            </Tab>
          )}
          <Tab className="btcd-s-tab-link">
            {__('Timeline', 'bitform')}
          </Tab>
          <Tab className="btcd-s-tab-link">
            {__('Notes', 'bitform')}
          </Tab>
          {!!(rowDtl?.GCLID) && (
            <Tab className="btcd-s-tab-link">
              {__('Google Ads Information', 'bitform')}
            </Tab>
          )}
        </TabList>

        {!!(paymentFields?.length) && (
          <TabPanel>
            <FormEntryPayments
              formID={formID}
              rowDtl={rowDtl}
            />
          </TabPanel>
        )}
        <TabPanel>
          <FormEntryTimeline
            formID={formID}
            entryID={entryID}
            integrations={integrations}
          />
        </TabPanel>
        <TabPanel>
          <FormEntryNotes
            formID={formID}
            entryID={entryID}
            allLabels={allLabels}
            setSnackbar={setSnackbar}
            rowDtl={rowDtl}
          />
        </TabPanel>
        {!!(rowDtl?.GCLID) && (
          <TabPanel>
            <GoogleAdInfo
              rowDtl={rowDtl}
            />
          </TabPanel>
        )}
      </Tabs>

    </Modal>
  )
}
export default memo(EntryRelatedInfo)
