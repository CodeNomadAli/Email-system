'use client'

import { useState, useMemo } from 'react'
import type { SyntheticEvent } from 'react'

import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import Grid from '@mui/material/Grid'

import CustomTabList from '@core/components/mui/TabList'
import ProfileOverView from '@/views/apps/user/view/profile/user-overview'
import ProfileChangePassword from '@/views/apps/user/view/profile/change-password'
import type { ExtendedUser } from '@/utils/types'

interface TabConfig {
    id: string
    label: string
}

interface Props {
    user: ExtendedUser
    tabList: TabConfig[]
}

const AuthUserProfile = ({ user, tabList }: Props) => {
    const [activeTab, setActiveTab] = useState('overview')

    const handleChange = (event: SyntheticEvent, value: string) => {
        setActiveTab(value)
    }

    const tabContentList = useMemo(() => {
        const tabs: { [key: string]: JSX.Element } = {}

        tabList.forEach((tab) => {
            if (tab.id === 'overview') {
                tabs[tab.id] = <ProfileOverView user={user} />
            } else if (tab.id === 'security') {
                tabs[tab.id] = <ProfileChangePassword userId={user.id as string} />
            }
        })

        return tabs
    }, [tabList, user])

    return (
        <TabContext value={activeTab}>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <CustomTabList onChange={handleChange} variant="scrollable" pill="true">
                        {tabList.map((tab) => (
                            <Tab
                                key={tab.id}
                                icon={<i className={`tabler-${tab.id === 'overview' ? 'users' : 'lock'}`} />}
                                value={tab.id}
                                label={tab.label}
                                iconPosition="start"
                            />
                        ))}
                    </CustomTabList>
                </Grid>
                <Grid item xs={12}>
                    <TabPanel value={activeTab} className="p-0">
                        {tabContentList[activeTab] || <div>No content available for this tab</div>}
                    </TabPanel>
                </Grid>
            </Grid>
        </TabContext>
    )
}

export default AuthUserProfile
