// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import type { User } from '@prisma/client'

import UserDetails from './UserDetails'

// Types

interface Props {
  user: User
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
