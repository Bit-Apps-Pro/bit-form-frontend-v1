import { createContext, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { $bits } from '../GlobalStates'

export const AppSettings = createContext()

export default function AppSettingsProvider({ children }) {
  const bits = useRecoilValue($bits)
  const setReCaptchaState = ver => {
    let captcha
    if (ver === 'v2') captcha = bits?.allFormSettings?.gReCaptcha
    else if (ver === 'v3') captcha = bits?.allFormSettings?.gReCaptchaV3
    if (captcha) {
      if (Array.isArray(captcha)) {
        return captcha[0]
      }
      return captcha
    }
    return {
      siteKey: '',
      secretKey: '',
    }
  }

  const [reCaptchaV2, setreCaptchaV2] = useState(setReCaptchaState('v2'))
  const [reCaptchaV3, setreCaptchaV3] = useState(setReCaptchaState('v3'))

  const paymentsState = () => {
    if (bits?.allFormSettings?.payments) {
      const pays = bits.allFormSettings.payments
      if (Array.isArray(pays)) return pays
      return [pays]
    }
    return []
  }

  const [payments, setPayments] = useState(paymentsState())
  return (
    <AppSettings.Provider value={{ reCaptchaV2, setreCaptchaV2, reCaptchaV3, setreCaptchaV3, payments, setPayments }}>
      {children}
    </AppSettings.Provider>
  )
}
