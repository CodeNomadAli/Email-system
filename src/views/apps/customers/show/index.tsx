import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import type { ExtendedCustomers } from '@/utils/types';

interface Props {
    customers: ExtendedCustomers;
}

const CustomersShowComponent = ({ customers }: Props) => {
    return (
        <Grid container spacing={3}>
            {/* Left Side: Customer Details and Country Details */}
            <Grid item xs={12} md={6} lg={6}>
                <Grid container spacing={3}>
                    {/* Card 1: Customer Details */}
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader title="Customer Details" />
                            <CardContent>
                                <Table>
                                    <TableRow>
                                        <TableCell>First Name</TableCell>
                                        <TableCell>{customers?.firstName}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Last Name</TableCell>
                                        <TableCell>{customers?.lastName}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Email</TableCell>
                                        <TableCell>{customers?.email}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Address</TableCell>
                                        <TableCell>{customers?.address || 'N/A'}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Phone Number</TableCell>
                                        <TableCell>
                                            {"+" + (customers?.countries?.phonecode ?? '')} {customers?.phoneNumber}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Created At</TableCell>
                                        <TableCell>{new Date(customers?.createdAt).toLocaleDateString()}</TableCell>
                                    </TableRow>
                                </Table>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Card 4: Country Details */}
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader title="Country Details" />
                            <CardContent>
                                <Table>
                                    <TableRow>
                                        <TableCell>Country Name</TableCell>
                                        <TableCell>{customers?.countries?.name || 'N/A'}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>ISO3</TableCell>
                                        <TableCell>{customers?.countries?.iso3 || 'N/A'}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Phone Code</TableCell>
                                        <TableCell>{customers?.countries?.phonecode || 'N/A'}</TableCell>
                                    </TableRow>
                                </Table>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>

            {/* Right Side: Company Details and Product Details */}
            <Grid item xs={12} md={6} lg={6}>
                <Grid container spacing={3}>
                    {/* Card 2: Company Details */}
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader title="Company Details" />
                            <CardContent>
                                <Table>
                                    <TableRow>
                                        <TableCell>Company Name</TableCell>
                                        <TableCell>{customers?.companies?.name || 'N/A'}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Company Email</TableCell>
                                        <TableCell>{customers?.companies?.email || 'N/A'}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Company Address</TableCell>
                                        <TableCell>{customers?.companies?.address || 'N/A'}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Company Type</TableCell>
                                        <TableCell>{customers?.companies?.companiesTypes?.name || 'N/A'}</TableCell>
                                    </TableRow>
                                </Table>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Card 3: Product Details */}
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader title="Products Details" />
                            <CardContent>
                                {customers?.customerProducts.length > 0 ? (
                                    <Table>
                                        <TableRow>
                                            <TableCell><strong>Products</strong></TableCell>
                                            <TableCell><strong>Categories</strong></TableCell>
                                        </TableRow>
                                        {customers.customerProducts.map((cp) => (
                                            <TableRow key={cp.id}>
                                                <TableCell>{cp.products.name}</TableCell>
                                                <TableCell>{cp.products.categoriesId ? 'Available' : 'N/A'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </Table>
                                ) : (
                                    <p>No products associated with this customer.</p>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default CustomersShowComponent;
