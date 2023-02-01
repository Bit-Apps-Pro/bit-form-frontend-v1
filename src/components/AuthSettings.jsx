/* eslint-disable no-param-reassign */
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import toast from 'react-hot-toast'
import produce from 'immer'
import { __ } from '../Utils/i18nwrap'
import { $bits, $fieldsArr } from '../GlobalStates'
import CheckBox from './Utilities/CheckBox'
import Login from './WPAuth/Login'
import Forgot from './WPAuth/Forgot'
import ResetPassword from './WPAuth/ResetPassword'
import Register from './WPAuth/Registration/Registration'
import bitsFetch from '../Utils/bitsFetch'
import LoaderSm from './Loaders/LoaderSm'
import SingleToggle2 from './Utilities/SingleToggle2'
import { checkMappedUserFields } from './WPAuth/Registration/UserHelperFunction'
import SnackMsg from './Utilities/SnackMsg'
import Loader from './Loaders/Loader'
import { fogotPassTamplate, activationTamplate, activationMessage } from '../Utils/StaticData/tamplate'

export default function AdditionalSettings() {
  const bits = useRecoilValue($bits)
  const { isPro } = bits
  const [isLoading, setIsLoading] = useState(false)
  const [isLoad, setIsLoad] = useState(false)
  const formFields = useRecoilValue($fieldsArr)
  const [type, setType] = useState('register')
  const { formID } = useParams()

  const [dataConf, setDataConf] = useState({
    register: {
      user_map: [{}],
      succ_msg: 'Registration successfully done.',
      meta_map: [{}],
      sub: 'Activate Your Account',
      body: activationTamplate,
      acti_succ_msg: 'Your account has been activated successfully.&nbsp;You can now login.',
      already_activated_msg: 'Your account is already activated!',
      invalid_key_msg: 'Sorry! Your URL Is Invalid!!',
    },
    login: {
      login_map: [{}],
      succ_msg: 'You have been successfully logged in.',
    },
    forgot: {
      forgot_map: [{}],
      succ_msg: 'We have e-mailed your password reset link!',
      sub: 'Email Subject',
      body: fogotPassTamplate,
    },
    reset: {
      reset_map: [{}],
      succ_msg: 'Your password has been reset!.',
    },
  })

  const [pages, setPages] = useState([])
  const [status, setStatus] = useState(0)
  const [snack, setSnackbar] = useState({ show: false })

  useEffect(() => {
    setIsLoad(true)
    bitsFetch({ formID }, 'bitforms_get_auth_set').then((res) => {
      const tmpConf = { ...dataConf }
      if (res?.success && !res?.data?.errors) {
        tmpConf[res.data[0]?.integration_name] = JSON.parse(res.data[0]?.integration_details)
        setDataConf(tmpConf)
        setType(res.data[0]?.integration_name)
        setStatus(Number(res.data[0]?.status))
      }
      setIsLoad(false)
    })
    bitsFetch({}, 'bitforms_get_all_wp_pages').then((res) => {
      if (res !== undefined && res.success) {
        setPages(res?.data)
      }
    })
  }, [])

  const handleInput = e => {
    const { name, value } = e.target
    setType(value)
    const tmpData = { ...dataConf }
    tmpData[name] = value
    setDataConf(tmpData)
  }

  const handleStatus = (e) => {
    if (e.target.checked) {
      setStatus(1)
    } else {
      setStatus(0)
    }
  }

  const validation = () => {
    let submission = true
    if (type === 'register' && !checkMappedUserFields(dataConf[type], 'user_map', 'userField')) {
      setSnackbar({ show: true, msg: 'Please mapped required fields.' })
      submission = false
    } if (type === 'register' && !dataConf[type]?.user_role) {
      setSnackbar({ show: true, msg: 'User Role field is required.' })
      submission = false
    } if (type === 'forgot' && !checkMappedUserFields(dataConf[type], 'forgot_map', 'forgotField')) {
      setSnackbar({ show: true, msg: 'Please mapped required fields.' })
      submission = false
    } if (type === 'forgot' && !dataConf[type]?.redirect_url) {
      setSnackbar({ show: true, msg: 'redirect page link is required.' })
      submission = false
    } if (type === 'reset' && !checkMappedUserFields(dataConf[type], 'reset_map', 'resetField')) {
      setSnackbar({ show: true, msg: 'Please mapped required fields.' })
      submission = false
    } if (type === 'login' && !checkMappedUserFields(dataConf[type], 'login_map', 'loginField')) {
      setSnackbar({ show: true, msg: 'Please mapped required fields.' })
      submission = false
    }
    return submission
  }

  const saveSettings = (e) => {
    e.preventDefault()
    setIsLoading(true)
    const tmpConf = produce(dataConf, draft => {
      Object.keys(draft).forEach(key => type !== key && delete draft[key])
      draft.formId = formID
      draft.type = type
      draft.status = status
    })
    const submission = validation()
    if (!submission) {
      setIsLoading(false)
      return
    }
    const prom = bitsFetch(tmpConf,
      'bitforms_save_auth_settings')
      .then((res) => {
        if (res !== undefined && res.success) {
          setIsLoading(false)
        }
      })
    toast.promise(prom, {
      success: __('Saved successfully.', 'bitform'),
      loading: __('Saving...', 'bitform'),
      error: __('Something went wrong, Try again.', 'bitform'),
    })
  }

  const userManagementType = () => {
    switch (type) {
      case 'login':
        return (
          <Login
            fields={formFields}
            dataConf={dataConf}
            setDataConf={setDataConf}
            pages={pages}
            type={type}
            status={status}
          />
        )
      case 'forgot':
        return (
          <Forgot
            fields={formFields}
            dataConf={dataConf}
            setDataConf={setDataConf}
            pages={pages}
            type={type}
            status={status}
          />
        )
      case 'reset':
        return (
          <ResetPassword
            fields={formFields}
            dataConf={dataConf}
            setDataConf={setDataConf}
            pages={pages}
            type={type}
            status={status}
          />
        )
      case 'register':
        return (
          <Register
            formFields={formFields}
            dataConf={dataConf}
            setDataConf={setDataConf}
            pages={pages}
            type={type}
            status={status}
          />
        )
      default:
        break
    }
  }
  return (
    <div className="pos-rel">
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <h2 className="">{__('WP Authentication', 'bitform')}</h2>
      {!isPro && (
        <div className="pro-blur flx" style={{ height: '111%', left: -53, width: '104%' }}>
          <div className="pro">
            {__('Available On', 'bitform')}
            <a href="https://www.bitapps.pro/bit-form" target="_blank" rel="noreferrer">
              <span className="txt-pro">
                {__('Premium', 'bitform')}
              </span>
            </a>
          </div>
        </div>
      )}
      {
        isLoad
          ? (
            <Loader style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 70,
              transform: 'scale(0.7)',
            }}
            />
          ) : (
            <div>
              <div className="mt-2">
                <label htmlFor="status">
                  <b>{__('', 'bitform')}</b>
                  <CheckBox radio name="type" onChange={handleInput} checked={type === 'register'} title={<small className="txt-dp"><b>Registration</b></small>} value="register" />
                  <CheckBox radio name="type" onChange={handleInput} checked={type === 'login'} title={<small className="txt-dp"><b>Log In</b></small>} value="login" />
                  <CheckBox radio name="type" onChange={handleInput} checked={type === 'forgot'} title={<small className="txt-dp"><b>Forgot Password</b></small>} value="forgot" />
                  <CheckBox radio name="type" onChange={handleInput} checked={type === 'reset'} title={<small className="txt-dp"><b>Reset Password</b></small>} value="reset" />
                </label>
              </div>

              <div className="mt-2 ml-1 flx">
                <label htmlFor="status">
                  <b>{__('Enable', 'bitform')}</b>
                </label>
                <SingleToggle2 action={handleStatus} checked={status === 1} className="ml-4 flx" />
              </div>

              {userManagementType()}

              <button
                type="button"
                id="secondary-update-btn"
                onClick={saveSettings}
                className="btn btcd-btn-lg blue flx"
                disabled={isLoading}
              >
                {__('Save ', 'bitform')}
                {isLoading && <LoaderSm size={20} clr="#fff" className="ml-2" />}
              </button>
              <div>
                {type !== 'register' && (
                  <p className="p-1 f-m">
                    <strong>Note : </strong>
                    {' '}
                    When the login, forgot password or reset password any of these feature enabled in the form, the entries will not be saved in the WP database.
                  </p>
                )}
              </div>
            </div>
          )
      }

    </div>
  )
}
