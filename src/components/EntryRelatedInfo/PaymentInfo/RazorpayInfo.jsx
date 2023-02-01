import { useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { $bits, $fields } from '../../../GlobalStates'
import noData from '../../../resource/img/nodata.svg'
import { AppSettings } from '../../../Utils/AppSettingsContext'
import bitsFetch from '../../../Utils/bitsFetch'
import { dateTimeFormatter } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'

const generateParsedRazorpayInfo = info => {
  if (info?.payment_response) {
    return JSON.parse(info.payment_response)
  }

  if (info?.created_at) {
    return info
  }

  return {}
}

export default function RazorpayInfo({ paymentInfo, payInfoFound, fldKey, transactionID }) {
  const bits = useRecoilValue($bits)
  const { formID } = useParams()
  const { payments } = useContext(AppSettings)
  const fields = useRecoilValue($fields)
  const fldData = fields[fldKey]
  const { payIntegID } = fldData.options
  const razorpaySettings = payments.find(payment => payment.id === payIntegID)

  const dateTimeFormat = `${bits.dateFormat} ${bits.timeFormat}`
  const [razorpayInfo, setRazorpayInfo] = useState(paymentInfo)
  const [loading, setLoading] = useState(false)
  const razorpayResp = generateParsedRazorpayInfo(razorpayInfo)
  const createdatToMiliSeconds = razorpayResp.created_at * 1000

  useEffect(() => {
    if (payInfoFound.current === 2) {
      setLoading(true)
      bitsFetch({ formID, transactionID, razorpaySettings }, 'bitforms_razorpay_transaction_info')
        .then(resp => {
          if (resp.success) {
            setRazorpayInfo(resp.data)
            payInfoFound.current = 1
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [])

  return (
    <div>
      {loading && (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 70,
          transform: 'scale(0.7)',
        }}
        />
      )}
      {payInfoFound.current === 1
        ? (
          <>
            <h1>{__('Razorpay', 'bitform')}</h1>
            <div>
              <small>
                {dateTimeFormatter(createdatToMiliSeconds, dateTimeFormat)}
              </small>
              <br />
              <br />
              <small>{`${__('Status', 'bitform')}: ${razorpayResp.status}`}</small>
              <br />
              <br />
              <small>
                <b>{`${__('Transaction ID', 'bitform')}: ${razorpayResp.id}`}</b>
              </small>
              <br />
              <br />
              {/* <h3>{`${userInfo.name.given_name} ${userInfo.name.surname}`}</h3> */}
              <small>{`${__('Email', 'bitform')}: ${razorpayResp.email}`}</small>
              <br />
              <br />
              <small>{`${__('Contact', 'bitform')}: ${razorpayResp.contact}`}</small>
              <br />
              <p>
                {__('Total Paid', 'bitform')}
                :
                {' '}
                {razorpayResp.amount / 100}
                {' '}
                {razorpayResp.currency}
              </p>
            </div>
          </>
        )
        : !loading && <img src={noData} alt={__('no data found', 'bitform')} style={{ height: 150, width: '100%' }} />}
    </div>
  )
}
