import { Box, Container, Typography, Grid } from '@mui/material';

import { getAuthUser } from '@/utils/backend-helper'
import { fetchUserById } from '@/libs/fetchUserById';
import AuthUserProfile from '@/views/apps/user/view/profile';
import type { ExtendedUser } from '@/utils/types';

interface TabConfig {
    id: string
    label: string
}

export default async function UserProfile() {
    let userData = null

    try {
        userData = await getAuthUser()
    } catch (error) {
        console.error('Authentication error:', error)
    }

    if (!userData?.id) {
        return (
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <div>User not authenticated</div>
                </Grid>
            </Grid>
        )
    }

    const user = await fetchUserById(userData?.id as string);

    if (!user) {
        return (
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <div>User not found</div>
                </Grid>
            </Grid>
        )
    }

    const tabList: TabConfig[] = [
        { id: 'overview', label: 'Overview' },
        { id: 'security', label: 'Security' }
    ]

    console.log(user, 'user')

    return (
        <Container maxWidth="lg">
            {/* Heading Section */}
            <Box sx={{ textAlign: 'center' }}>
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    sx={{ fontWeight: 'bold', color: 'primary.main' }}
                >
                    Profile
                </Typography>
                <Typography
                    variant="h6"
                    component="p"
                    color="text.secondary"
                >
                    Manage your account details and preferences
                </Typography>
            </Box>

            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <AuthUserProfile user={user as ExtendedUser} tabList={tabList} />
                </Grid>
            </Grid>
        </Container>
    )
}
