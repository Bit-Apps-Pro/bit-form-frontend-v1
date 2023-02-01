/* eslint-disable no-undef */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-console */
/* eslint-disable react/jsx-one-expression-per-line */

import { lazy, Suspense, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter as Router, Link, NavLink, Route, Switch } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import Loader from './components/Loaders/Loader'
import TableLoader from './components/Loaders/TableLoader'
import { $bits } from './GlobalStates'
import './resource/icons/style.css'
import logo from './resource/img/bit-form-logo.svg'
import './resource/sass/app.scss'
// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from './Utils/i18nwrap'

const AllForms = lazy(() => import('./pages/AllForms'))
const AppSettings = lazy(() => import('./pages/AppSettings'))
const FormDetails = lazy(() => import('./pages/FormDetails'))
const FormEntries = lazy(() => import('./pages/FormEntries'))
const Error404 = lazy(() => import('./pages/Error404'))

export default function App() {
  const loaderStyle = { height: '90vh' }
  const bits = useRecoilValue($bits)

  useEffect(() => {
    removeUnwantedCSS()
    // checkProVersionForUpdates(bits)
  }, [])

  return (
    <Suspense fallback={(<Loader className="g-c" style={loaderStyle} />)}>
      <Toaster
        position="bottom-right"
        containerStyle={{ inset: '-25px 30px 20px -10px' }}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
            bottom: 40,
            padding: '15px 18px',
            boxShadow: '0 0px 7px rgb(0 0 0 / 30%), 0 3px 30px rgb(0 0 0 / 20%)',
          },
        }}
      />
      <Router basename={typeof bits !== 'undefined' ? bits.baseURL : '/'}>
        <div className="Btcd-App">
          <div className="nav-wrp">
            <div className="flx">
              <div className="logo flx" title={__('Bit Form', 'bitform')}>
                <Link to="/" className="flx">
                  <img src={logo} alt="bit form logo" className="ml-2" />
                  <span className="ml-2">Bit Form</span>
                </Link>
              </div>
              <nav className="top-nav ml-2">
                <NavLink
                  exact
                  to="/"
                  activeClassName="app-link-active"
                >
                  {__('My Forms', 'bitform')}
                </NavLink>

                <NavLink
                  to="/app-settings/recaptcha"
                  activeClassName="app-link-active"
                  isActive={(m, l) => l.pathname.match(/app-settings|recaptcha|gclid|cpt|api|smtp|payments/g)}
                >
                  {__('App Settings', 'bitform')}
                </NavLink>
              </nav>
            </div>
          </div>

          <div className="route-wrp">
            <Switch>
              <Route exact path="/">
                <Suspense fallback={<TableLoader />}>
                  <AllForms />
                </Suspense>
              </Route>
              <Route path="/form/:page/:formType/:formID?/:option?">
                <Suspense fallback={<Loader className="g-c" style={loaderStyle} />}>
                  <FormDetails />
                </Suspense>
              </Route>
              <Route path="/formEntries/:formID">
                <Suspense fallback={<TableLoader />}>
                  <FormEntries />
                </Suspense>
              </Route>
              <Route path="/app-settings">
                <Suspense fallback={<Loader className="g-c" style={loaderStyle} />}>
                  <AppSettings />
                </Suspense>
              </Route>
              <Route path="*">
                <Error404 />
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
    </Suspense>
  )
}

function removeUnwantedCSS() {
  const conflictStyles = ['bootstrap']
  const styles = document.styleSheets

  for (let i = 0; i < styles.length; i += 1) {
    if (styles[i].href !== null) {
      const regex = new RegExp(conflictStyles.join('.*css|'), 'gi')
      if (styles[i]?.href.match(regex)) {
        styles[i].disabled = true
      }
    }
  }
}
