'use client'

// React Imports
import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { useForm } from 'react-hook-form'

import type { SubmitHandler } from 'react-hook-form'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Button from '@mui/material/Button'

import { showLoading, hideLoading, showSuccess, showError } from '@/utils/frontend-helper'

import CustomTextField from '@core/components/mui/TextField'

interface FormData {
    oldPassword: string
    password: string
    confirmPassword: string
}
interface props {
    userId: string
}

const ProfileChangePassword = ({ userId }: props) => {
    const [isOldPasswordShown, setIsOldPasswordShown] = useState(false)
    const [isPasswordShown, setIsPasswordShown] = useState(false)
    const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
    const router = useRouter()

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors }
    } = useForm<FormData>()

    const onSubmit: SubmitHandler<FormData> = async data => {
        showLoading()

        try {
            const req = await fetch(`/api/users/profile?userId=${userId}&profileChangePass=true`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            const res = await req.json()

            if (req.ok) {
                showSuccess(res.message)
                reset()
                router.refresh()
            } else {
                showError(res.message)
                res.error.forEach((err: any) => {
                    setError(err.path[0], { message: err.message })
                })
            }
        } catch (error) {
            console.error('Error submitting form:', error)
            showError('An unexpected error occurred. Please try again.')
        } finally {
            hideLoading()
        }
    }

    return (
        <Card>
            <CardHeader title='Change Password' />
            <CardContent className='flex flex-col gap-4'>
                <Alert icon={false} severity='warning'>
                    <AlertTitle>Ensure that these requirements are met</AlertTitle>
                    Minimum 8 characters long
                </Alert>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={4}>
                        <Grid item xs={7}>
                            <CustomTextField
                                fullWidth
                                label='Old Password'
                                type={isOldPasswordShown ? 'text' : 'password'}
                                {...register('oldPassword')}
                                error={!!errors.oldPassword}
                                helperText={errors.oldPassword?.message}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            <IconButton
                                                edge='end'
                                                onClick={() => setIsOldPasswordShown(!isOldPasswordShown)}
                                                onMouseDown={e => e.preventDefault()}
                                            >
                                                <i className={isOldPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>

                        <Grid item xs={7}>
                            <CustomTextField
                                fullWidth
                                label='Password'
                                type={isPasswordShown ? 'text' : 'password'}
                                {...register('password')}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            <IconButton
                                                edge='end'
                                                onClick={() => setIsPasswordShown(!isPasswordShown)}
                                                onMouseDown={e => e.preventDefault()}
                                            >
                                                <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>

                        <Grid item xs={7}>
                            <CustomTextField
                                fullWidth
                                label='Confirm Password'
                                type={isConfirmPasswordShown ? 'text' : 'password'}
                                {...register('confirmPassword')}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword?.message}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            <IconButton
                                                edge='end'
                                                onClick={() => setIsConfirmPasswordShown(!isConfirmPasswordShown)}
                                                onMouseDown={e => e.preventDefault()}
                                            >
                                                <i className={isConfirmPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} className='flex gap-4'>
                            <Button type='submit' variant='contained'>
                                Change Password
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    )
}

export default ProfileChangePassword
