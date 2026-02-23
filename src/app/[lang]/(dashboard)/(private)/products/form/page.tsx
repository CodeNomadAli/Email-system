import Grid from '@mui/material/Grid'

import ProductsForm from '@/views/apps/products/form'
import { fetchAllCategories } from '@/libs/fetchAllCategories'

const UserViewTab = async () => {

  const categories = await fetchAllCategories()

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12} lg={12} md={12}>
          <ProductsForm categories={categories} />
        </Grid>
      </Grid>
    </>
  )
}

export default UserViewTab
