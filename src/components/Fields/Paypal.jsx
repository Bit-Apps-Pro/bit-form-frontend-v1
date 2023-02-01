/* eslint-disable react/jsx-props-no-spreading */
import { FUNDING, PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { useContext, useEffect, useState } from 'react'
import { isFormValidatedWithoutError } from '../../user-frontend/frontendHelpers'
import validateForm from '../../user-frontend/validation'
import { AppSettings } from '../../Utils/AppSettingsContext'
import bitsFetchFront from '../../Utils/bitsFetchFront'
import { select } from '../../Utils/globalHelpers'
import InputWrapper from '../InputWrapper'

function Paypal({ fieldKey, formID, attr, contentID, resetFieldValue, isBuilder, handleFormValidationErrorMessages }) {
  const appSettingsContext = useContext(AppSettings)
  const [clientID, setClientID] = useState('')
  const [render, setrender] = useState(false)
  const [amount, setAmount] = useState(attr?.amount || 1)
  const [shipping, setShipping] = useState(attr?.shipping || 0)
  const [tax, setTax] = useState(attr?.tax || 0)
  const [description, setDescription] = useState(attr?.description || '')
  const { currency } = attr
  const isSubscription = attr.payType === 'subscription'
  const isStandalone = attr.style.layout === 'standalone'

  const setDefaultValues = (isInitial) => {
    const dynamicFlds = {
      amountFld: [setAmount],
      shippingFld: [setShipping],
      taxFld: [setTax],
      descFld: [setDescription],
    }

    Object.entries(dynamicFlds).map(dynFld => {
      if (attr?.[dynFld[0]]) {
        const fldName = attr[dynFld[0]]
        let fld = select(`[name="${fldName}"]`)
        if (fld?.type === 'radio') {
          fld = select(`[name="${fldName}"]:checked`)
        }
        if (fld) {
          const { value } = fld
          if (isInitial) {
            dynFld[1][0](value)
          }
          dynamicFlds[dynFld[0]][1] = value
        }
      }
    })
    return dynamicFlds
  }

  useEffect(() => {
    let key = ''
    if (typeof bitFormsFront !== 'undefined') {
      // eslint-disable-next-line no-undef
      key = atob(bitFormsFront?.paymentKeys?.paypalKey || '')
    }

    if (!key && typeof bits !== 'undefined') {
      const payInteg = appSettingsContext?.payments?.find(pay => pay.id && attr.payIntegID && Number(pay.id) === Number(attr.payIntegID))
      if (payInteg) {
        key = payInteg.clientID
      }
    }
    setClientID(key)
    setDefaultValues(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attr.payIntegID])

  useEffect(() => {
    if (resetFieldValue) {
      const paypalField = document.getElementById('paypalfield')
      if (paypalField) {
        paypalField.remove()
      }
    }
  }, [resetFieldValue])

  useEffect(() => {
    setrender(false)
    setTimeout(() => {
      setrender(true)
    }, 1)
  }, [clientID, attr.currency, attr.payType, attr.locale, attr.disableFunding])

  const createSubscriptionHandler = (_, actions) => {
    if (!validateForm({ form: contentID })) throw new Error('form validation is failed!')
    return actions.subscription.create({ plan_id: attr?.planId })
  }

  const createOrderHandler = (_, actions) => {
    const dynValues = setDefaultValues()
    const orderAmount = (Number(dynValues.amountFld[1] || amount)).toFixed(2) * 1
    const shippingAmount = (Number(dynValues.shippingFld[1] || shipping)).toFixed(2) * 1
    const taxAmount = ((Number(dynValues.taxFld[1] || tax) * orderAmount) / 100).toFixed(2) * 1
    const totalAmount = (orderAmount + shippingAmount + taxAmount).toFixed(2) * 1
    return actions.order.create({
      purchase_units: [{
        description: dynValues.descFld[1] || description,
        amount:
        {
          currency_code: attr.currency,
          value: totalAmount,
          breakdown:
          {
            item_total: { currency_code: attr.currency, value: orderAmount },
            shipping: { currency_code: attr.currency, value: shippingAmount },
            tax_total: { currency_code: attr.currency, value: taxAmount },
          },
        },
      }],
    })
  }

  const onApproveHanlder = (_, actions) => {
    const formParent = document.getElementById(`${contentID}`)
    formParent.classList.add('pos-rel', 'form-loading')
    const order = isSubscription ? actions.subscription.get() : actions.order.capture()
    order.then(result => {
      const form = document.getElementById(`form-${contentID}`)
      if (typeof form !== 'undefined' && form !== null) {
        const input = document.createElement('input')
        input.setAttribute('type', 'hidden')
        input.setAttribute('name', fieldKey)
        input.setAttribute('id', 'paypalfield')
        input.setAttribute('value', result.id)
        form.appendChild(input)
        let submitBtn = form.querySelector('button[type="submit"]')
        if (!submitBtn) {
          submitBtn = document.createElement('input')
          submitBtn.setAttribute('type', 'submit')
          submitBtn.style.display = 'none'
          form.appendChild(submitBtn)
        }
        submitBtn.click()
        const paymentParams = {
          formID,
          transactionID: result.id,
          payment_name: 'paypal',
          payment_type: isSubscription ? 'subscription' : 'order',
          payment_response: result,
        }
        bitsFetchFront(paymentParams, 'bitforms_payment_insert')
          .then(() => formParent.classList.remove('pos-rel', 'form-loading'))
      }
    })
  }

  const getOptions = () => {
    const options = { 'client-id': clientID }
    if (!isSubscription) options.currency = currency
    if (isSubscription) {
      options.vault = true
      options.intent = 'subscription'
    }
    if (attr.locale) options.locale = attr.locale
    if (attr.disableFunding) options['disable-funding'] = attr.disableFunding

    return options
  }

  const getStyles = () => {
    const style = {
      color: attr.style.color,
      shape: attr.style.shape,
      label: isSubscription ? 'subscribe' : attr.style.label,
    }
    if (!isStandalone) style.layout = attr.style.layout
    if (attr.style?.height) style.height = Number(attr.style.height)

    return style
  }

  const handleOnClick = () => isFormValidatedWithoutError(contentID, handleFormValidationErrorMessages)
    .then(() => true)
    .catch(() => false)

  return (
    <InputWrapper
      formID={formID}
      fieldData={attr}
      noLabel
      isBuilder={isBuilder}
    >
      <div
        style={{
          width: 'auto',
          minWidth: 150,
          maxWidth: 750,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {(render && clientID) && (
          <PayPalScriptProvider
            options={getOptions()}
          >
            <PayPalButtons
              style={getStyles()}
              fundingSource={isStandalone ? FUNDING[attr.style.payBtn] : undefined}
              createSubscription={isSubscription ? (data, actions) => createSubscriptionHandler(data, actions) : undefined}
              createOrder={!isSubscription ? (data, actions) => createOrderHandler(data, actions) : undefined}
              onClick={handleOnClick}
              onApprove={(data, actions) => onApproveHanlder(data, actions)}
              forceReRender={[amount, attr.style]}
              onError={() => { }}
            />
          </PayPalScriptProvider>
        )}
        {!attr.payIntegID && (
          <p>Select a config from field settings to render the PayPal.</p>
        )}
      </div>
    </InputWrapper>
  )
}

export default Paypal
