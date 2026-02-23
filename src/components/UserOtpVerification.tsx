import { useState } from 'react'

import Link from 'next/link'

import { useParams, useRouter } from 'next/navigation'

import { useForm } from 'react-hook-form'
import { Typography, Button, InputAdornment, IconButton } from '@mui/material'

import DirectionalIcon from '@components/DirectionalIcon'
import CustomTextField from '@core/components/mui/TextField'
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'

import { showLoading, showSuccess, hideLoading, showError } from '@/utils/frontend-helper'

interface FormData {
  otp: string
  password: string
  confirmPassword: string
}

const ResetPassword = ({ email }: { email: string }) => {
  const { lang: locale } = useParams()
  const router = useRouter()
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    showLoading()

    try {
      const req = await fetch(`/api/users/user_forget_password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, ...data })
      })

      let res

      try {
        if (req.headers.get('Content-Type')?.includes('application/json')) {
          res = await req.json()
        } else {
          console.error('Server returned a non-JSON response')
          res = { error: 'Unexpected server response' }
        }
      } catch (err) {
        console.error('Failed to parse JSON response:', err)
        res = { error: 'Invalid response from server' }
      }

      if (req.ok) {
        showSuccess(res?.message || 'Password reset successful!')
        router.push('/login')
      } else {
        showError(res?.message || 'An error occurred')
        res.error.forEach((err: any) => {
          setError(err.path?.[0] || 'unknown', { message: err.message })
        })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      showError('Something went wrong. Please try again.')
    } finally {
      hideLoading()
    }
  }

  return (
    <>
      <div className='flex flex-col gap-1'>
        <Typography variant='h4'>Reset Password 🔒</Typography>
        <Typography>Enter the OTP sent to your email and reset your password</Typography>
      </div>

      <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
        <CustomTextField
          fullWidth
          label='OTP'
          placeholder='Enter 4-digit OTP'
          inputProps={{ maxLength: 4 }}
          {...register('otp')}
          error={!!errors.otp}
          helperText={errors.otp?.message}
        />

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

        <Button fullWidth variant='contained' type='submit'>
          Reset Password
        </Button>

        <Typography className='flex justify-center items-center' color='primary'>
          <Link href={getLocalizedUrl('/login', locale as Locale)} className='flex items-center gap-1.5'>
            <DirectionalIcon
              ltrIconClass='tabler-chevron-left'
              rtlIconClass='tabler-chevron-right'
              className='text-xl'
            />
            <span>Back to login</span>
          </Link>
        </Typography>
      </form>
    </>
  )
}

export default ResetPassword
