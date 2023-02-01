import { lazy, Suspense } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $fieldsArr, $integrations } from '../../GlobalStates'
import { deepCopy } from '../../Utils/Helpers'
import { __ } from '../../Utils/i18nwrap'
import Loader from '../Loaders/Loader'

const ZohoCRM = lazy(() => import('./ZohoCRM/ZohoCRM'))
const ZohoAnalytics = lazy(() => import('./ZohoAnalytics/ZohoAnalytics'))
const ZohoBigin = lazy(() => import('./ZohoBigin/ZohoBigin'))
const ZohoCampaigns = lazy(() => import('./ZohoCampaigns/ZohoCampaigns'))
const ZohoCreator = lazy(() => import('./ZohoCreator/ZohoCreator'))
const ZohoDesk = lazy(() => import('./ZohoDesk/ZohoDesk'))
const ZohoMail = lazy(() => import('./ZohoMail/ZohoMail'))
const ZohoMarketingHub = lazy(() => import('./ZohoMarketingHub/ZohoMarketingHub'))
const ZohoProjects = lazy(() => import('./ZohoProjects/ZohoProjects'))
const ZohoRecruit = lazy(() => import('./ZohoRecruit/ZohoRecruit'))
const ZohoSheet = lazy(() => import('./ZohoSheet/ZohoSheet'))
const ZohoSign = lazy(() => import('./ZohoSign/ZohoSign'))
const ZohoWorkDrive = lazy(() => import('./ZohoWorkDrive/ZohoWorkDrive'))
const GoogleSheet = lazy(() => import('./GoogleSheet/GoogleSheet'))
const MailChimp = lazy(() => import('./MailChimp/MailChimp'))
const Rapidmail = lazy(() => import('./Rapidmail/Rapidmail'))
const Hubspot = lazy(() => import('./Hubspot/Hubspot'))
const Getgist = lazy(() => import('./Getgist/Getgist'))
const ElasticEmail = lazy(() => import('./ElasticEmail/ElasticEmail'))
const Acf = lazy(() => import('./Acf/Acf'))
const Metabox = lazy(() => import('./Metabox/Metabox'))
const MailPoet = lazy(() => import('./MailPoet/MailPoet'))
const SendinBlue = lazy(() => import('./SendinBlue/SendinBlue'))
const WooCommerce = lazy(() => import('./WooCommerce/WooCommerce'))
const ActiveCampaign = lazy(() => import('./ActiveCampaign/ActiveCampaign'))
const WebHooks = lazy(() => import('./WebHooks/WebHooks'))
const Zapier = lazy(() => import('./Zapier/Zapier'))
const Integromat = lazy(() => import('./Integromat/Integromat'))
const ZohoFlow = lazy(() => import('./ZohoFlow/ZohoFlow'))
const Integrately = lazy(() => import('./Integrately/Integrately'))
const Pabbly = lazy(() => import('./Pabbly/Pabbly'))
const Pods = lazy(() => import('./Pods/Pods'))
const Telegram = lazy(() => import('./Telegram/Telegram'))
const FluentCrm = lazy(() => import('./FluentCRM/FluentCrm'))
const Encharge = lazy(() => import('./Encharge/Encharge'))
const Autonami = lazy(() => import('./Autonami/Autonami'))
const Dropbox = lazy(() => import('./Dropbox/Dropbox'))
const Acumbamail = lazy(() => import('./Acumbamail/Acumbamail'))
const OneDrive = lazy(() => import('./OneDrive/OneDrive'))
const Groundhogg = lazy(() => import('./Groundhogg/Groundhogg'))
const SendFox = lazy(() => import('./SendFox/SendFox'))
const MailerLite = lazy(() => import('./MailerLite/MailerLite'))
const Twilio = lazy(() => import('./Twilio/Twilio'))

export default function NewInteg({ allIntegURL }) {
  const { integUrlName } = useParams()
  const [integs, setIntegration] = useRecoilState($integrations)
  const integrations = deepCopy(integs)
  const formFields = useRecoilValue($fieldsArr)
  const NewIntegs = () => {
    switch (integUrlName) {
      case 'Zoho CRM':
        return <ZohoCRM allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Zoho Recruit':
        return <ZohoRecruit allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Zoho Analytics':
        return <ZohoAnalytics allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Zoho Campaigns':
        return <ZohoCampaigns allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Zoho Desk':
        return <ZohoDesk allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Zoho WorkDrive':
        return <ZohoWorkDrive allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Zoho Mail':
        return <ZohoMail allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Zoho Sheet':
        return <ZohoSheet allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Zoho Projects':
        return <ZohoProjects allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Zoho Sign':
        return <ZohoSign allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Zoho Marketing Hub':
        return <ZohoMarketingHub allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Zoho Creator':
        return <ZohoCreator allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Zoho Bigin':
        return <ZohoBigin allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Google Sheet':
        return <GoogleSheet allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Mail Chimp':
        return <MailChimp allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Rapidmail':
        return <Rapidmail allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Hubspot':
        return <Hubspot allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Getgist':
        return <Getgist allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'ElasticEmail':
        return <ElasticEmail allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'ACF':
        return <Acf allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'MetaBox':
        return <Metabox allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Mail Poet':
        return <MailPoet allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'SendinBlue':
        return <SendinBlue allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'WooCommerce':
        return <WooCommerce allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'ActiveCampaign':
        return <ActiveCampaign allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Web Hooks':
        return <WebHooks allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Zapier':
        return <Zapier allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Integromat':
        return <Integromat allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Integrately':
        return <Integrately allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Pabbly':
        return <Pabbly allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Pods':
        return <Pods allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Zoho Flow':
        return <ZohoFlow allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Telegram':
        return <Telegram allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Fluent CRM':
        return <FluentCrm allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Encharge':
        return <Encharge allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Autonami':
        return <Autonami allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Dropbox':
        return <Dropbox allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Acumbamail':
        return <Acumbamail allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'OneDrive':
        return <OneDrive allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Groundhogg':
        return <Groundhogg allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'SendFox':
        return <SendFox allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'MailerLite':
        return <MailerLite allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      case 'Twilio':
        return <Twilio allIntegURL={allIntegURL} formFields={formFields} integrations={integrations} setIntegration={setIntegration} />
      default:
        return <></>
    }
  }

  return (
    <div>
      <div className="flx">
        <Link to={allIntegURL} className="btn btcd-btn-o-gray">
          <span className="btcd-icn icn-chevron-left" />
          &nbsp;Back
        </Link>
        <div className="w-8 txt-center">
          <div className="mb-1"><b className="f-lg">{integUrlName}</b></div>
          <div>{__('Integration Settings', 'bitform')}</div>
        </div>
      </div>

      <Suspense fallback={<Loader className="g-c" style={{ height: '90vh' }} />}>
        <NewIntegs />
      </Suspense>
    </div>
  )
}
