import Grid from '@mui/material/Grid'

import ImportCustomerForm from '@/views/apps/viewemail/importExcelData'

import { fetchAllCompanies } from '@/libs/fetchAllCompanies'
import { fetchAllProducts } from '@/libs/fetchAllProducts'
import { fetchAllCountries } from '@/libs/fetchAllCountries'
import { fetchAllCompaniesTypes } from '@/libs/fetchAllCompaniesTypes'
import type { ExtendedProducts, ExtendedCompanies } from '@/utils/types'

const CustomerFormView = async () => {
  const [products, companies, countries, companiesTypes] = await Promise.all([
    fetchAllProducts(),
    fetchAllCompanies(),
    fetchAllCountries(),
    fetchAllCompaniesTypes()
  ])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ImportCustomerForm
          products={products as ExtendedProducts[]}
          companies={companies as ExtendedCompanies[]}
          countries={countries}
          companiesTypes={companiesTypes}
        />
      </Grid>
    </Grid>
  )
}

export default CustomerFormView
