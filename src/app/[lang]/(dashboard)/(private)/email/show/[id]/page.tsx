import { Grid, Container } from '@mui/material';

import CustomersShowComponent from '@/views/apps/customers/show';
import { fetchCustomersById } from '@/libs/fetchCustomersById';
import type { ExtendedCustomers } from '@/utils/types';

interface Params {
    id: string;
}

interface Props {
    params: Params;
    searchParams: { [key: string]: string | string[] | undefined };
}

const CustomersShow = async ({ params }: Props) => {

    // Fetch customers and attendance data
    const customers = await fetchCustomersById(params.id);

    if (!customers) return null;


    return (
        <Container>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <CustomersShowComponent customers={customers as ExtendedCustomers} />
                </Grid>
            </Grid>
        </Container>
    );
};

export default CustomersShow;
