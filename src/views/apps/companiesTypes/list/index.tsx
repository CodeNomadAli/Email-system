import type { CompaniesTypes } from '@prisma/client'
import { Card, CardHeader, Button } from '@mui/material'

import CompaniesTypesListClient from './CompaniesTypesListTable'

// Props interface
interface CompaniesTypesListProps {
    companiesTypes: CompaniesTypes[]
    totalRecords: number
    totalPages: number
    page: number
    pageSize: number
}

// Server Component
const CompaniesTypesList: React.FC<CompaniesTypesListProps> = ({ companiesTypes, totalRecords, totalPages, page, pageSize }) => {
    return (
        <Card sx={{ padding: 2, marginTop: 2 }}>
            <CardHeader
                title='Companies Types List'
                action={
                    <>
                        <Button
                            variant='contained'
                            color='primary'
                            size='small'
                            startIcon={<i className='tabler-plus' />}
                            href='/companiesTypes/form'
                        >
                            Add Company Type
                        </Button>
                    </>
                }
            />
            <CompaniesTypesListClient
                companiesTypes={companiesTypes}
                totalRecords={totalRecords}
                totalPages={totalPages}
                page={page}
                pageSize={pageSize}
            />
        </Card>
    )
}

export default CompaniesTypesList
