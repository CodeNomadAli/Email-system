import Link from 'next/link'

import { useParams } from 'next/navigation'

import { useForm } from 'react-hook-form'
import { Typography, Button } from '@mui/material'

import DirectionalIcon from '@components/DirectionalIcon'
import CustomTextField from '@core/components/mui/TextField'
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'
import { showLoading, hideLoading, showSuccess } from '@/utils/frontend-helper'

const ForgotPassword = ({ onOtpSent }: { onOtpSent: (email: string) => void }) => {
  const { lang: locale } = useParams()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<{ email: string }>()

  const onSubmit = async (data: { email: string }) => {
    if (!data.email) {
      setError('email', { type: 'manual', message: 'Email is required' })

      return
    }

    if (!/\S+@\S+\.\S+/.test(data.email)) {
      setError('email', { type: 'manual', message: 'Invalid email format' })

      return
    }

    showLoading()

    try {
      const req = await fetch(`/api/users/user_forget_password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const res = await req.json()

      if (req.status === 404) {
        setError('email', { type: 'manual', message: res.message })

        return
      }

      if (!req.ok) {
        setError('email', { type: 'manual', message: res.message || 'Something went wrong' })

        return
      }

      showSuccess('Your OTP has been sent to your registered email. Please check your inbox.')

      onOtpSent(data.email)
    } catch (error) {
      console.error('Error submitting form:', error)
      setError('email', { type: 'manual', message: 'Something went wrong, please try again' })
    } finally {
      hideLoading()
    }
  }

  return (
    <>
      <div className='flex flex-col gap-1'>
        <Typography variant='h4'>Forgot Password 🔒</Typography>
        <Typography>Enter your email and we&#39;ll send you instructions to reset your password</Typography>
      </div>
      <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
        <CustomTextField
          autoFocus
          fullWidth
          label='Email'
          placeholder='Enter your email'
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <Button fullWidth variant='contained' type='submit'>
          Request OTP
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

export default ForgotPassword
