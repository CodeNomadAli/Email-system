import Grid from '@mui/material/Grid'

import { fetchAllCategories } from '@/libs/fetchAllCategories'
import { fetchProductsById } from '@/libs/fetchProductsById';

// MUI Imports

import ProductsForm from '@views/apps/products/form'
import type { ExtendedProducts } from '@/utils/types'

interface Params {
  id: string;
}

const UserViewTab = async ({ params }: { params: Params }) => {
  const [products, categories] = await Promise.all([
    fetchProductsById(params.id),
    fetchAllCategories()
  ]);

  if (!products) return null

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={12} md={12}>
        <ProductsForm products={products as ExtendedProducts} categories={categories} />
      </Grid>
    </Grid>
  )
}

export default UserViewTab
