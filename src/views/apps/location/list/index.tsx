// views/apps/location/list.tsx
import type { Location } from '@prisma/client'
import { Card, CardHeader, Button } from '@mui/material'

import LocationListClient from './LocationListTable'

// Props interface
interface LocationListProps {
  locations: Location[]
  totalRecords: number
  totalPages: number
  page: number
  pageSize: number
}

// Server Component
const LocationList: React.FC<LocationListProps> = ({ locations, totalRecords, totalPages, page, pageSize }) => {
  return (
    <Card sx={{ padding: 2, marginTop: 2 }}>
      <CardHeader
        title='Location List'
        action={
          <>
            <Button
              variant='contained'
              color='primary'
              size='small'
              startIcon={<i className='tabler-plus' />}
              href='/locations/form'
            >
              Add Location
            </Button>
          </>
        }
      />
      <LocationListClient
        locations={locations}
        totalRecords={totalRecords}
        totalPages={totalPages}
        page={page}
        pageSize={pageSize}
      />
    </Card>
  )
}

export default LocationList
