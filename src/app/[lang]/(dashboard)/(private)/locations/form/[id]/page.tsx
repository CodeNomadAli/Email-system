// app/[lang]/(dashboard)/locations/[id]/page.tsx


import Grid from '@mui/material/Grid'

import { fetchLocationById } from '@/libs/fetchLocationById' // you'll create this
import LocationForm from '@/views/apps/location/form'

interface Props {
  params: {
    id: string
  }
}

const LocationViewPage = async ({ params }: Props) => {
  const location = await fetchLocationById(params.id)

  if (!location) {
    return null
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={12} md={12}>
        <LocationForm location={location} />
      </Grid>
    </Grid>
  )
}

export default LocationViewPage
