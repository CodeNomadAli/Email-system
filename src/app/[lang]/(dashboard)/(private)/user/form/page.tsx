// app/[lang]/(dashboard)/(private)/users/[id]/page.tsx

import AddNewUser from '@/views/apps/user/form/AddNewUser'
import { fetchLocations } from '@/libs/fetcLocations'
import { fetchRoles } from '@/libs/fetchRoles'

interface Props {
  params: { id: string }
  searchParams: { page?: string; pageSize?: string }
}

const UserViewTab = async ({ searchParams }: Props) => {
  const page = parseInt(searchParams.page || '1', 10)
  const pageSize = parseInt(searchParams.pageSize || '10', 10)

  const [locationsData, rolesData] = await Promise.all([fetchLocations(page, pageSize), fetchRoles()])

  return <AddNewUser locations={locationsData.locations} roles={rolesData.roles} /> // Ensure rolesData is defined in AddNewUserProps
}

export default UserViewTab
