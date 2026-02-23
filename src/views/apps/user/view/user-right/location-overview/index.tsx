// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports

import UserLocationListing from './UserLocationListing'

// Data Imports

interface LocationTabProps {
  userId: string
}

const LocationViewTab = async ({ userId }: LocationTabProps) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserLocationListing userId={userId} />
      </Grid>
    </Grid>
  )
}

export default LocationViewTab
