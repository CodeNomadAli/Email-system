'use client'

import { useRouter, useParams } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import { Controller, useForm } from 'react-hook-form'
import type { CompaniesTypes } from '@prisma/client'

import { showLoading, hideLoading, showSuccess, showError } from '@/utils/frontend-helper'
import Form from '@components/Form'

interface CompaniesTypesFormProps {
    companiesTypes?: CompaniesTypes
}

const CompaniesTypesForm = ({ companiesTypes }: CompaniesTypesFormProps) => {
    const router = useRouter()
    const { id } = useParams()

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: companiesTypes?.name || '',

        }
    })

    const onSubmit = async (data: any) => {
        showLoading()

        try {
            const response = await fetch(`/api/companiesTypes?companiesTypesId=${id}`, {
                method: companiesTypes?.id ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            const res = await response.json()

            if (response.ok) {
                showSuccess(res.message)
                router.push('/companiesTypes/list')
                router.refresh()
            } else if (res.error) {
                showError(res.message)
                res.error.forEach((err: any) => {
                    setError(err.path[0], { message: err.message })
                })
            }
        } catch (error) {
            console.error('Error submitting form:', error)
        } finally {
            hideLoading()
        }
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={2} lg={2} md={2} />
            <Grid item xs={12} lg={8} md={12}>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader title='Company Type Form' />
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Controller
                                        name='name'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label='Name'
                                                variant='outlined'
                                                fullWidth
                                                error={!!errors.name}
                                                helperText={errors.name?.message}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ textAlign: 'right', marginTop: 2 }}>
                                        <Button type='submit' variant='contained'>
                                            Submit
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Form>
            </Grid>
        </Grid>
    )
}

export default CompaniesTypesForm
