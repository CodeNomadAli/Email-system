import Grid from '@mui/material/Grid'

import CustomerForm from '@/views/apps/customers/form'



import { fetchAllCompaniesTypes } from '@/libs/fetchAllCompaniesTypes'
import type { ExtendedProducts, ExtendedCompanies } from '@/utils/types'


const CustomerFormView = async () => {


    return (
        <>
            <Grid container spacing={6}>
                <Grid item xs={12} lg={12} md={12}>
                    <CustomerForm   />
                </Grid>
            </Grid>
        </>
    )
}

export default CustomerFormView
