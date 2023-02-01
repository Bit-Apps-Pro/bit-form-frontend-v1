import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import { $bits } from '../../GlobalStates'
import bitsFetch from '../../Utils/bitsFetch'
import { __ } from '../../Utils/i18nwrap'
import CptTypeAdd from './CptTypeAdd'
import EditCpt from './EditCpt'

export default function Cpt() {
  const [posts, setPosts] = useState([])
  const [types, setTypes] = useState([])
  const bits = useRecoilValue($bits)
  const { isPro } = bits

  useEffect(() => {
    bitsFetch({}, 'bitforms_getAll_post_type').then((res) => {
      if (res?.success) {
        setPosts(res.data.all_cpt)
        setTypes(res.data.types)
      }
    })
  }, [])

  return (
    <div className="p-2 w-6">
      <div className="pos-rel">
        {!isPro && (
          <div className="pro-blur flx" style={{ height: '110%', left: -15, width: '104%', marginTop: 15 }}>
            <div className="pro">
              {__('Available On', 'bitform')}
              <a href="https://www.bitapps.pro/bit-form" target="_blank" rel="noreferrer">
                <span className="txt-pro">
                  &nbsp;
                  {__('Premium', 'bitform')}
                </span>
              </a>
            </div>
          </div>
        )}
        <Tabs
          selectedTabClassName="s-t-l-active"
        >
          <TabList className="flx mt-0">
            <Tab className="btcd-s-tab-link pb-2">
              <b>{__('Add New Post Type', 'bitform')}</b>
            </Tab>
            <Tab className="btcd-s-tab-link pb-2">
              <b>{__('Edit Post Types', 'bitform')}</b>
            </Tab>
          </TabList>
          <TabPanel>
            <CptTypeAdd
              types={types}
            />
          </TabPanel>
          <TabPanel>
            <EditCpt
              posts={posts}
              types={types}
            />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  )
}
