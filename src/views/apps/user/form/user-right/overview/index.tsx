'use client'

// MUI Imports
import { useState, useCallback, useEffect } from 'react'

import type { Dispatch, SetStateAction } from 'react'

import { useRouter } from 'next/navigation'

import Grid from '@mui/material/Grid'

import type { Roles, Location } from '@prisma/client'

import { Card, CardContent, CardHeader, TextField, InputAdornment, IconButton } from '@mui/material'

import { Controller, useForm } from 'react-hook-form'

import Button from '@mui/material/Button'

import FormControl from '@mui/material/FormControl'

import InputLabel from '@mui/material/InputLabel'

import FormHelperText from '@mui/material/FormHelperText'

import Select from '@mui/material/Select'

import MenuItem from '@mui/material/MenuItem'

import { showLoading, hideLoading, showError, showSuccess } from '@/utils/frontend-helper'

import type { ExtendedUser } from '@/utils/types'

interface OverViewTabProps {
  user: ExtendedUser
  setUserData: Dispatch<SetStateAction<ExtendedUser>>
}

const OverViewTab: React.FC<OverViewTabProps> = ({ user, setUserData }) => {
  const router = useRouter()
  const [locations, setLocations] = useState<Location[]>([])
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors }
  } = useForm({
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: user.password,
      role: Array.isArray(user.roles) ? user.roles : [],
      location: Array.isArray(user.locations) ? user.locations : []
    }
  })

  useEffect(() => {
    reset({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: user.password,
      role: Array.isArray(user.roles) ? user.roles : [],
      location: Array.isArray(user.locations) ? user.locations : []
    })
  }, [user, reset])

  const [roles, setRoles] = useState<Roles[]>([])

  const fetchRoles = useCallback(async () => {
    showLoading()

    try {
      // Fetch roles
      const req = await fetch('/api/roles')
      const res = await req.json()

      if (req.ok) {
        setRoles(res.data)
      }
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message)
      } else {
        showError('An unknown error occurred')
      }
    } finally {
      hideLoading()
    }
  }, [])

  const fetchLocation = useCallback(async () => {
    showLoading()

    try {
      // Fetch Locations
      const req = await fetch('/api/locations')
      const res = await req.json()

      if (req.ok) {
        setLocations(res.data.locations)
      }
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message)
      } else {
        showError('An unknown error occurred')
      }
    } finally {
      hideLoading()
    }
  }, [])

  useEffect(() => {
    fetchLocation()
    fetchRoles()
  }, [fetchLocation, fetchRoles])

  const submitData = async () => {
    showLoading()

    try {
      const req = await fetch('/api/users', {
        method: user.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      })

      const res = await req.json()

      if (req.ok) {
        showSuccess(res.message)
        router.push('/user/list')
      } else {
        res.error.forEach((err: any) => {
          setError(err.path[0], { message: err.message })
        })
        showError(res.message)
      }
    } catch (error) {
      console.error(error)
    } finally {
      hideLoading()
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='User Overview' />
          <CardContent>
            <form onSubmit={handleSubmit(submitData)} className='gap-6' noValidate>
              <Grid container spacing={6}>
                <Grid item xs={6}>
                  <Controller
                    name='first_name'
                    control={control}
                    rules={{ required: 'First Name is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label='First Name'
                        required
                        error={!!errors.first_name}
                        helperText={errors.first_name?.message}
                        className='w-full'
                        onChange={e => {
                          field.onChange(e)
                          setUserData(prevState => ({ ...prevState, first_name: e.target.value }))
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name='last_name'
                    control={control}
                    rules={{ required: 'Last Name is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label='Last Name'
                        required
                        error={!!errors.last_name}
                        helperText={errors.last_name?.message}
                        className='w-full'
                        onChange={e => {
                          field.onChange(e)
                          setUserData({ ...user, last_name: e.target.value })
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name='email'
                    control={control}
                    rules={{ required: 'Email is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label='Email'
                        required
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        className='w-full'
                        onChange={e => {
                          field.onChange(e)
                          setUserData({ ...user, email: e.target.value })
                        }}
                      />
                    )}
                  />
                </Grid>
                {!user.id && (
                  <Grid item xs={6}>
                    <Controller
                      name='password'
                      control={control}
                      rules={{ required: 'Password is required' }}
                      render={({ field }) => (
                        <TextField
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
                          onChange={e => {
                            field.onChange(e)
                            setUserData({ ...user, password: e.target.value })
                          }}
                        />
                      )}
                    />
                  </Grid>
                )}

                <Grid item xs={6}>
                  <Controller
                    name='role'
                    control={control}
                    rules={{ required: 'Minimum one role is required' }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl className='w-full' error={!!error}>
                        <InputLabel htmlFor='role'>Role</InputLabel>

                        <Select
                          {...field}
                          id='role'
                          multiple
                          required
                          error={!!errors.role}
                          value={field.value || []}
                          onChange={e => {
                            field.onChange(e)
                            setUserData({
                              ...user,
                              roles: Array.isArray(e.target.value) ? e.target.value : []
                            })
                          }}
                          label='Role'
                        >
                          {roles.map(role => (
                            <MenuItem key={role.id} value={role.id}>
                              {role.name}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>{errors.role?.message || 'Select a role'}</FormHelperText>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={!user.id ? 6 : 12}>
                  <Controller
                    name='location'
                    control={control}
                    render={({ field }) => (
                      <FormControl className='w-full'>
                        <InputLabel htmlFor='location'>Location</InputLabel>
                        <Select
                          {...field}
                          id='location'
                          multiple
                          label='Location'
                          onChange={e => {
                            field.onChange(e)
                            setUserData({ ...user, locations: Array.isArray(e.target.value) ? e.target.value : [] })
                          }}
                        >
                          {locations?.map(location => (
                            <MenuItem key={location.id} value={location.id}>
                              {location.name}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>Select Location</FormHelperText>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} container justifyContent='flex-end'>
                  <Button variant='contained' color='primary' type='submit'>
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

export default OverViewTab
