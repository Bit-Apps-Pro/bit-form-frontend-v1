import { useEffect, useState } from 'react'
import bitsFetch from '../../Utils/bitsFetch'
import Loader from '../Loaders/Loader'

export default function GoogleAdInfo({ rowDtl }) {
  const [row, setRow] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    bitsFetch({ gclid: rowDtl?.GCLID }, 'bitforms_get_gclid_info').then((res) => {
      if (res !== undefined && res.success) {
        if (res.data[0]) {
          setRow(JSON.parse(res.data[0].gclid_response))
        }
      }
      setIsLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {
        isLoading
          ? (
            <Loader style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 70,
              transform: 'scale(0.7)',
            }}
            />
          )
          : (
            <div>
              <table className="btcd-row-detail-tbl">
                <tbody>
                  <tr className="txt-dp">
                    <td className="td">Account</td>
                    <td className="td">{row['@attributes']?.account}</td>
                  </tr>
                  <tr className="txt-dp">
                    <td className="td">Campaign ID</td>
                    <td className="td">{row['@attributes']?.campaignID}</td>
                  </tr>
                  <tr className="txt-dp">
                    <td className="td">AdGroup Id</td>
                    <td className="td">{row['@attributes']?.adGroupID}</td>
                  </tr>
                  <tr className="txt-dp">
                    <td className="td">Ad Id</td>
                    <td className="td">{row['@attributes']?.adID}</td>
                  </tr>
                  <tr className="txt-dp">
                    <td className="td">Keyword Id</td>
                    <td className="td">{row['@attributes']?.keywordID}</td>
                  </tr>
                  <tr className="txt-dp">
                    <td className="td">Keyword</td>
                    <td className="td">{row['@attributes']?.CriteriaParameters}</td>
                  </tr>
                  <tr className="txt-dp">
                    <td className="td">Match type</td>
                    <td className="td">{row['@attributes']?.KeywordMatchType}</td>
                  </tr>
                  <tr className="txt-dp">
                    <td className="td">Click type</td>
                    <td className="td">{row['@attributes']?.clickType}</td>
                  </tr>
                  <tr className="txt-dp">
                    <td className="td">Device Type</td>
                    <td className="td">{row['@attributes']?.device}</td>
                  </tr>
                  <tr className="txt-dp">
                    <td className="td">Search Partner Network</td>
                    <td className="td">{row['@attributes']?.networkWithSearchPartners}</td>
                  </tr>
                  <tr className="txt-dp">
                    <td className="td">Ad Campaign Name</td>
                    <td className="td">{row['@attributes']?.campaign}</td>
                  </tr>
                  <tr className="txt-dp">
                    <td className="td">Ad group Name</td>
                    <td className="td">{row['@attributes']?.adGroup}</td>
                  </tr>
                  <tr className="txt-dp">
                    <td className="td">Ad Network</td>
                    <td className="td">{row['@attributes']?.network}</td>
                  </tr>
                  <tr className="txt-dp">
                    <td className="td">Ad Click Date</td>
                    <td className="td">{row['@attributes']?.day}</td>
                  </tr>
                  <tr className="txt-dp">
                    <td className="td">Customer ID</td>
                    <td className="td">{row['@attributes']?.customerID}</td>
                  </tr>
                  <tr className="txt-dp">
                    <td className="td">GCLID</td>
                    <td className="td">{row['@attributes']?.googleClickID}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )
      }
    </>
  )
}
