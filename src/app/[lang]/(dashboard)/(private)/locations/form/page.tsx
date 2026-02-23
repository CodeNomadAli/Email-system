'use client'

import Grid from '@mui/material/Grid'

import LocationForm from '@/views/apps/location/form'

const UserViewTab = () => {
  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12} lg={12} md={12}>
          <LocationForm />
        </Grid>
      </Grid>
    </>
  )
}

export default UserViewTab
