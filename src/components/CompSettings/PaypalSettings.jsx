import { useContext } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { useRecoilState, useRecoilValue } from 'recoil'
import { __ } from '../../Utils/i18nwrap'
import { AppSettings } from '../../Utils/AppSettingsContext'
import { currencyCodes, fundLists, localeCodes } from '../../Utils/StaticData/paypalData'
import CheckBox from '../Utilities/CheckBox'
import SingleInput from '../Utilities/SingleInput'
import SingleToggle from '../Utilities/SingleToggle'
import Back2FldList from './Back2FldList'
import { $fields, $selectedFieldId } from '../../GlobalStates'
import { deepCopy } from '../../Utils/Helpers'

export default function PaypalSettings() {
  const fldKey = useRecoilValue($selectedFieldId)
  const [fields, setFields] = useRecoilState($fields)
  const fieldData = deepCopy(fields[fldKey])
  const formFields = Object.entries(fields)
  const { payments } = useContext(AppSettings)
  const isSubscription = fieldData?.payType === 'subscription'
  const isDynamicDesc = fieldData?.descType === 'dynamic'
  const isDynamicAmount = fieldData?.amountType === 'dynamic'
  const isDynamicShipping = fieldData?.shippingType === 'dynamic'
  const isDynamicTax = fieldData?.taxType === 'dynamic'

  const handleInput = (name, value) => {
    if (value) {
      fieldData[name] = value
    } else {
      delete fieldData[name]
    }
    if (name === 'locale') {
      const localeArr = fieldData.locale.split(' - ')
      fieldData.locale = localeArr[localeArr.length - 1]
    }
    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  const setSubscription = e => {
    if (e.target.checked) {
      fieldData.payType = 'subscription'
      delete fieldData.currency
    } else {
      fieldData.currency = 'USD'
      delete fieldData.payType
      delete fieldData.planId
    }
    delete fieldData.amountType
    delete fieldData.amount
    delete fieldData.amountFld

    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  const setAmountType = e => {
    if (e.target.value) fieldData.amountType = e.target.value
    else delete fieldData.amountType
    delete fieldData.amount
    delete fieldData.amountFld

    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  const setShippingType = e => {
    if (e.target.value) fieldData.shippingType = e.target.value
    else delete fieldData.shippingType
    delete fieldData.shipping
    delete fieldData.shippingFld

    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  const setTaxType = e => {
    if (e.target.value) fieldData.taxType = e.target.value
    else delete fieldData.taxType
    delete fieldData.tax
    delete fieldData.taxFld

    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  const setDescType = e => {
    if (e.target.value) fieldData.descType = e.target.value
    else delete fieldData.descType
    delete fieldData.description
    delete fieldData.descFld

    setFields(allFields => ({ ...allFields, ...{ [fldKey]: fieldData } }))
  }

  const getAmountFields = () => {
    const filteredFields = formFields.filter(field => field[1].typ.match(/number|radio/g))
    return filteredFields.map(itm => (<option key={itm[0]} value={itm[0]}>{itm[1].adminLbl || itm[1].lbl}</option>))
  }

  const getDescFields = () => {
    const filteredFields = formFields.filter(field => field[1].typ.match(/text/g))
    return filteredFields.map(itm => (<option key={itm[0]} value={itm[0]}>{itm[1].adminLbl || itm[1].lbl}</option>))
  }

  const localeCodeOptions = () => localeCodes.map(locale => ({
    label: (
      <div className="flx flx-between">
        <span className="btcd-ttl-ellipsis">{locale.region}</span>
        <code className="btcd-code">{locale.code}</code>
      </div>
    ),
    title: `${locale.region} - ${locale.code}`,
    value: `${locale.region} - ${locale.code}`,
  }))

  const getPaypalConfigs = () => {
    const paypalConfigs = payments.filter(pay => pay.type === 'PayPal')
    return paypalConfigs.map(paypal => (
      <option key={paypal.id} value={paypal.id}>{paypal.name}</option>
    ))
  }

  const fundOptions = () => fundLists.map(fund => ({ label: fund.label, value: fund.value }))

  return (
    <div className="ml-2 mr-4">
      <Back2FldList />
      <div className="mb-2">
        <span className="font-w-m">{__('Field Type : ', 'bitform')}</span>
        {__('Paypal', 'bitform')}
      </div>
      <div className="mt-3">
        <b>{__('Select Config', 'bitform')}</b>
        <br />
        <select name="payIntegID" id="payIntegID" onChange={e => handleInput(e.target.name, e.target.value)} className="btcd-paper-inp mt-1" value={fieldData.payIntegID}>
          <option value="">Select Config</option>
          {getPaypalConfigs()}
        </select>
      </div>

      {fieldData.payIntegID && (
        <>
          <div className="mt-2">
            <SingleToggle title={__('Subscription:', 'bitform')} action={setSubscription} isChecked={isSubscription} className="mt-3" />
            {isSubscription && <SingleInput inpType="text" title={__('Plan Id', 'bitform')} value={fieldData.planId || ''} action={e => handleInput('planId', e.target.value)} />}
          </div>
          {!isSubscription && (
            <>
              <div className="mt-2">
                <b>{__('Language', 'bitform')}</b>
                <MultiSelect
                  className="w-10 btcd-paper-drpdwn mt-1"
                  options={localeCodeOptions()}
                  onChange={val => handleInput('locale', val)}
                  largeData
                  singleSelect
                />
              </div>
              <div className="mt-2">
                <b>{__('Disable Card', 'bitform')}</b>
                <MultiSelect
                  className="w-10 btcd-paper-drpdwn mt-1 btcd-ttc"
                  options={fundOptions()}
                  onChange={val => handleInput('disableFunding', val)}
                />
              </div>
              <div className="mt-2">
                <b>{__('Amount Type', 'bitform')}</b>
                <br />
                <CheckBox onChange={setAmountType} radio checked={!isDynamicAmount} title={__('Fixed', 'bitform')} />
                <CheckBox onChange={setAmountType} radio checked={isDynamicAmount} title={__('Dynamic', 'bitform')} value="dynamic" />
              </div>
              {!isDynamicAmount && <SingleInput inpType="number" title={__('Amount', 'bitform')} value={fieldData.amount || ''} action={e => handleInput('amount', e.target.value)} />}
              {isDynamicAmount && (
                <div className="mt-3">
                  <b>{__('Select Amount Field', 'bitform')}</b>
                  <select onChange={e => handleInput(e.target.name, e.target.value)} name="amountFld" className="btcd-paper-inp mt-1" value={fieldData.amountFld}>
                    <option value="">{__('Select Field', 'bitform')}</option>
                    {getAmountFields()}
                  </select>
                </div>
              )}
              <div className="mt-2">
                <b>{__('Shipping Amount', 'bitform')}</b>
                <br />
                <CheckBox onChange={setShippingType} radio checked={!isDynamicShipping} title={__('Fixed', 'bitform')} />
                <CheckBox onChange={setShippingType} radio checked={isDynamicShipping} title={__('Dynamic', 'bitform')} value="dynamic" />
              </div>
              {!isDynamicShipping && <SingleInput inpType="number" title={__('Shipping Cost', 'bitform')} value={fieldData.shipping || ''} action={e => handleInput('shipping', e.target.value)} />}
              {isDynamicShipping && (
                <div className="mt-3">
                  <b>{__('Select Shipping Amount Field', 'bitform')}</b>
                  <select onChange={e => handleInput(e.target.name, e.target.value)} name="shippingFld" className="btcd-paper-inp mt-1" value={fieldData.shippingFld}>
                    <option value="">{__('Select Field', 'bitform')}</option>
                    {getAmountFields()}
                  </select>
                </div>
              )}
              <div className="mt-2">
                <b>{__('Tax Amount Type', 'bitform')}</b>
                <br />
                <CheckBox onChange={setTaxType} radio checked={!isDynamicTax} title={__('Fixed', 'bitform')} />
                <CheckBox onChange={setTaxType} radio checked={isDynamicTax} title={__('Dynamic', 'bitform')} value="dynamic" />
              </div>
              {!isDynamicTax && <SingleInput inpType="number" title={__('Tax (%)', 'bitform')} value={fieldData.tax || ''} action={e => handleInput('tax', e.target.value)} />}
              {isDynamicTax && (
                <div className="mt-3">
                  <b>{__('Select Amount Field', 'bitform')}</b>
                  <select onChange={e => handleInput(e.target.name, e.target.value)} name="taxFld" className="btcd-paper-inp mt-1" value={fieldData.taxFld}>
                    <option value="">{__('Select Field', 'bitform')}</option>
                    {getAmountFields()}
                  </select>
                </div>
              )}
              <div className="mt-2">
                <label htmlFor="recap-thm">
                  <b>{__('Currency', 'bitform')}</b>
                  <select onChange={e => handleInput(e.target.name, e.target.value)} name="currency" value={fieldData.currency} className="btcd-paper-inp mt-1">
                    {currencyCodes.map(itm => (
                      <option key={itm.currency} value={itm.code}>
                        {`${itm.currency} - ${itm.code}`}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="mt-2">
                <b>{__('Description', 'bitform')}</b>
                <br />
                <CheckBox onChange={setDescType} radio checked={!isDynamicDesc} title={__('Static', 'bitform')} />
                <CheckBox onChange={setDescType} radio checked={isDynamicDesc} title={__('Dynamic', 'bitform')} value="dynamic" />
              </div>
              {!isDynamicDesc && <textarea className="mt-1 btcd-paper-inp" placeholder="Order Description" name="description" rows="5" onChange={e => handleInput(e.target.name, e.target.value)} />}
              {isDynamicDesc && (
                <div className="mt-1">
                  <b>{__('Select Description Field', 'bitform')}</b>
                  <select onChange={e => handleInput(e.target.name, e.target.value)} name="descFld" className="btcd-paper-inp mt-1" value={fieldData.descFld}>
                    <option value="">{__('Select Field', 'bitform')}</option>
                    {getDescFields()}
                  </select>
                </div>
              )}
            </>
          )}
        </>
      )}

    </div>
  )
}
