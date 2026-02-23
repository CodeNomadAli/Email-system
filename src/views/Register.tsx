'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

import { useForm, Controller } from 'react-hook-form'
import { signIn } from 'next-auth/react'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'

// import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'

// import FormControlLabel from '@mui/material/FormControlLabel'

// Third-party Imports
import classnames from 'classnames'

import { showSuccess, showLoading, hideLoading, showError } from '@/utils/frontend-helper'

// Type Imports
import type { SystemMode } from '@core/types'
import type { Locale } from '@configs/i18n'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Styled Custom Components
const RegisterIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 600,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 450
  }
}))

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 345,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

const Register = ({ mode }: { mode: SystemMode }) => {
  const router = useRouter()
  const { lang: locale } = useParams()

  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)

  // Vars
  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/auth-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-register-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-register-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-register-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-register-light-border.png'

  // Hooks
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  const onSubmit = async (data: any) => {
    showLoading()

    try {
      const req = await fetch('/api/users/register_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const res = await req.json()

      if (req.ok) {
        const signInResponse = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false
        })

        if (signInResponse && signInResponse.ok && !signInResponse.error) {
          const searchParams = new URLSearchParams(window.location.search)
          const redirectURL = searchParams.get('redirectTo') ?? '/'

          router.replace(getLocalizedUrl(redirectURL, locale as Locale))
          showSuccess(res.message)
        } else {
          showError('Please try again')
        }
      } else {
        res.error.forEach((err: any) => {
          setError(err.path[0], { message: err.message })
        })
        showError(res.message)
      }
    } catch (error: any) {
      console.error('Error during registration:', error.message)
    } finally {
      hideLoading()
    }
  }

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-2 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <RegisterIllustration src={characterIllustration} alt='character-illustration' />
        {!hidden && <MaskImg alt='mask' src={authBackground} />}
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <Link
          href={getLocalizedUrl('/login', locale as Locale)}
          className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'
        >
          <Logo />
        </Link>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-8 sm:mbs-11 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>Adventure starts here 🚀</Typography>
            <Typography>Make your app management easy and fun!</Typography>
          </div>
          <form autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <Controller
              name='first_name'
              control={control}
              rules={{ required: 'First Name is required' }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  label='First Name'
                  required
                  error={!!errors.first_name}
                  helperText={errors.first_name?.message}
                  className='w-full'
                />
              )}
            />
            <Controller
              name='last_name'
              control={control}
              rules={{ required: 'Last Name is required' }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  label='Last Name'
                  required
                  error={!!errors.last_name}
                  helperText={errors.last_name?.message}
                  className='w-full'
                />
              )}
            />

            <Controller
              name='email'
              control={control}
              rules={{ required: 'Email is required' }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  label='Email'
                  required
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  className='w-full'
                />
              )}
            />
            <Controller
              name='password'
              control={control}
              rules={{ required: 'Password is required' }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Password'
                  type={isPasswordShown ? 'text' : 'password'}
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
              )}
            />

            <Controller
              name='confirmPassword'
              control={control}
              rules={{ required: 'Confirm Password is required' }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Confirm Password'
                  type={isConfirmPasswordShown ? 'text' : 'password'}
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
              )}
            />

            {/* <FormControlLabel
              control={<Checkbox />}
              label={
                <>
                  <span>I agree to </span>
                  <Link className='text-primary' href='/' onClick={e => e.preventDefault()}>
                    privacy policy & terms
                  </Link>
                </>
              }
            /> */}

            <Button fullWidth variant='contained' type='submit'>
              Sign Up
            </Button>
            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>Already have an account?</Typography>
              <Typography component={Link} href={getLocalizedUrl('/login', locale as Locale)} color='primary'>
                Sign in instead
              </Typography>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
