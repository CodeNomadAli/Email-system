// MUI Imports
import Grid from '@mui/material/Grid'

import type { ExtendedUser } from '@/utils/types'

// Component Imports

import UserDetails from './UserDetails'

// Types

interface Props {
  user: ExtendedUser
}

const UserLeftOverview = ({ user }: Props) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserDetails user={user} />
      </Grid>
    </Grid>
  )
}

export default UserLeftOverview
