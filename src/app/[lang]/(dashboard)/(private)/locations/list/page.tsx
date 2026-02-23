// app/[lang]/(dashboard)/(private)/locations/list/page.tsx
import { fetchLocations } from '@/libs/fetcLocations'
import LocationList from '@/views/apps/location/list'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: {
    page?: string
    pageSize?: string
  }
}

const LocationsPage = async ({ searchParams }: Props) => {
  const page = parseInt(searchParams.page || '1', 10)
  const pageSize = parseInt(searchParams.pageSize || '10', 10)

  try {
    const data = await fetchLocations(page, pageSize)

    return (
      <div>
        <LocationList
          locations={data.locations}
          totalPages={data.totalPages}
          totalRecords={data.totalRecords}
          page={page}
          pageSize={pageSize}
        />
      </div>
    )
  } catch (err) {
    console.error('Error loading locations:', err)

    return <div>Failed to load locations. Please try again later.</div>
  }
}

export default LocationsPage
