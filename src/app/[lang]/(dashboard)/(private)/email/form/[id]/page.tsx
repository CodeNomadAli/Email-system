import Grid from '@mui/material/Grid'

import CustomersForm from '@/views/apps/customers/form'



interface Props {
    params: {
        id: string
    }
}



const CustomerFormView = async ({  }: Props) => {

    

    return (
        <>
            <Grid container spacing={6}>
                <Grid item xs={12} lg={12} md={12}>
                    <CustomersForm  />
                </Grid>
            </Grid>
        </>
    )
}

export default CustomerFormView
