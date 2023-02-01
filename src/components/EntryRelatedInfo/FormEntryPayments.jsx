import { useEffect, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { $bits, $fieldLabels } from '../../GlobalStates'
import bitsFetch from '../../Utils/bitsFetch'
import { __ } from '../../Utils/i18nwrap'
import Loader from '../Loaders/Loader'
import PaypalInfo from './PaymentInfo/PaypalInfo'
import RazorpayInfo from './PaymentInfo/RazorpayInfo'

export default function FormEntryPayments({ formID, rowDtl }) {
  const allLabels = useRecoilValue($fieldLabels)
  const bits = useRecoilValue($bits)
  const { isPro } = bits
  const [paymentInfo, setPaymentInfo] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const payPattern = /paypal|razorpay/
  const paymentFields = allLabels.filter(label => label.type.match(payPattern))
  const payFld = paymentFields.find(field => rowDtl[field.key]) || {}
  const payInfoFound = useRef(0) // 1 - found, 2 - not found

  useEffect(() => {
    if (isPro) {
      setIsLoading(true)
      const transactionID = rowDtl?.[payFld?.key]
      bitsFetch({ formID, transactionID }, 'bitforms_payment_details')
        .then(result => {
          if (result.success && result.data.length === 1) {
            setPaymentInfo(result.data[0])
            payInfoFound.current = 1
          } else {
            payInfoFound.current = 2
          }
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
    return () => setPaymentInfo({})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  console.log('paymentInfo', paymentInfo)

  const showPaymentInfo = () => {
    switch (payFld?.type) {
      case 'paypal':
        return <PaypalInfo paymentInfo={paymentInfo} payInfoFound={payInfoFound} />
      case 'razorpay':
        return <RazorpayInfo paymentInfo={paymentInfo} payInfoFound={payInfoFound} fldKey={payFld?.key} transactionID={rowDtl?.[payFld?.key]} />
      default:
        return <h1>{__('No Payment Info Found!', 'bitform')}</h1>
    }
  }

  return (
    <div className="pos-rel">
      {!isPro && (
        <div className="pro-blur mt-4 flx">
          <div className="pro">
            {__('Available On', 'bitform')}
            <a href="https://www.bitapps.pro/bit-form" target="_blank" rel="noreferrer">
              <span className="txt-pro">
                {' '}
                {__('Premium', 'bitform')}
              </span>
            </a>
          </div>
        </div>
      )}
      {isLoading ? (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 70,
          transform: 'scale(0.7)',
        }}
        />
      ) : showPaymentInfo()}
    </div>
  )
}
