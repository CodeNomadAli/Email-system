'use client'

import { useRouter } from 'next/navigation'

import Grid from '@mui/material/Grid'
import { Tooltip, Card, CardContent, CardHeader, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import Button from '@mui/material/Button'

// Types

import type { ExtendedUser } from '@/utils/types'
import { showLoading, hideLoading, showError, showSuccess } from '@/utils/frontend-helper'

interface FormData {
    first_name: string
    last_name: string
}

interface ProfileOverViewProps {
    user: ExtendedUser
}

const ProfileOverView = ({ user }: ProfileOverViewProps) => {
    const router = useRouter()

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormData>({
        defaultValues: {
            first_name: user.first_name || '',
            last_name: user.last_name || '',
        },
    })

    const submitData = async (data: FormData) => {
        showLoading()

        try {
            const req = await fetch(`/api/users/profile?userId=${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            const res = await req.json()

            if (req.ok) {
                showSuccess(res.message)

                reset({
                    first_name: data.first_name,
                    last_name: data.last_name
                })
                router.refresh()

            } else {
                showError(res.message)
            }
        } catch (error) {
            console.error('Form submission error:', error)
            showError('An error occurred while submitting the form')
        } finally {
            hideLoading()
        }
    }

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title="User Overview" />
                    <CardContent>
                        <form onSubmit={handleSubmit(submitData)} noValidate>
                            <Grid container spacing={6}>
                                <Grid item xs={12} sm={4}>
                                    <Controller
                                        name="first_name"
                                        control={control}
                                        rules={{ required: 'First Name is required' }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label="First Name"
                                                required
                                                error={!!errors.first_name}
                                                helperText={errors.first_name?.message}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Controller
                                        name="last_name"
                                        control={control}
                                        rules={{ required: 'Last Name is required' }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label="Last Name"
                                                required
                                                error={!!errors.last_name}
                                                helperText={errors.last_name?.message}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        value={user.email || ''}
                                        disabled
                                    />
                                </Grid>

                                {/* Role and location with span 2-2 */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Roles"
                                        value={(user.roles ?? []).map((role) => role.role.name).join(', ') || ''}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Tooltip title={(user.locations ?? []).map((location) => location.location.name).join(', ') || ''}>
                                        <TextField
                                            fullWidth
                                            label="Locations"
                                            value={(user.locations ?? []).map((location) => location.location.name).join(', ') || ''}
                                            disabled
                                        />
                                    </Tooltip>
                                </Grid>

                                <Grid item xs={12} container justifyContent="flex-end">
                                    <Button variant="contained" type="submit">
                                        Submit
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}

export default ProfileOverView
