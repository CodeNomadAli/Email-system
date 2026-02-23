'use client'

// app/components/AddNewUser.tsx


import { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import Autocomplete from '@mui/material/Autocomplete'



import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import Grid from '@mui/material/Grid'

import type { Location, Roles } from '@prisma/client'

import { showLoading, hideLoading, showError, showSuccess } from '@/utils/frontend-helper'

// Define the form data type
interface FormData {
  first_name: string
  last_name: string
  email: string
  password: string
  role: string[]
  location: string[]
  manager_id: string | null
}

// Define props
interface AddNewUserProps {
  locations: Location[]
  roles: Roles[]

}


function AddNewUserForm({ roles, }: AddNewUserProps) {
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [allUsers, setAllUsers] = useState<{ id: string; fullName: string }[]>([])

  const router = useRouter()

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      role: [],

      // location: [],
      manager_id: null
    }

  })

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/users');
        const result = await res.json();

        const users = result.data.users.map((user: any) => ({
          id: user.id,
          fullName: `${user.first_name} ${user.last_name}`
        }));



        setAllUsers(users);

        console.log('Fetched users:', users);


      } catch (err) {
        console.error('Failed to fetch users:', err);
        setAllUsers([]);
      }
    }

    fetchUsers();
  }, []);


  const onSubmit = async (data: FormData) => {
    showLoading()

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await res.json()

      if (res.ok) {
        showSuccess(result.message || 'User created successfully')
        router.push('/user/list')
      } else {
        if (Array.isArray(result.error)) {
          result.error.forEach((err: any) => {
            if (err?.path && err?.message) {
              setError(err.path[0], { message: err.message })
            }
          })
        } else if (typeof result.error === 'string') {
          showError(result.error)
        }

        showError(result.message || 'Failed to create user')
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      hideLoading()
    }
  }



  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Add New User" />
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='first_name'
                    control={control}
                    rules={{ required: 'First Name is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='First Name'

                        // required validation handled by react-hook-form
                        error={!!errors.first_name}
                        helperText={errors.first_name?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='last_name'
                    control={control}
                    rules={{ required: 'Last Name is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Last Name'
                        required
                        error={!!errors.last_name}
                        helperText={errors.last_name?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='email'
                    control={control}
                    rules={{
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Email'
                        type='email'
                        required
                        error={!!errors.email}
                        helperText={errors.email?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='password'
                    control={control}
                    rules={{
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Password'
                        type={isPasswordShown ? 'text' : 'password'}
                        required
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onClick={() => setIsPasswordShown(!isPasswordShown)}
                                aria-label='toggle password visibility'
                              >
                                <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='role'
                    control={control}
                    rules={{ required: 'At least one role is required' }}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.role}>
                        <InputLabel id='role-label'>Role</InputLabel>
                        <Select
                          {...field}
                          labelId='role-label'
                          label='Role'
                          multiple
                          value={field.value || []}
                          onChange={field.onChange}
                        >
                          {roles.map(role => (
                            <MenuItem key={role.id} value={role.id}>
                              {role.name}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>{errors.role?.message}</FormHelperText>
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name='manager_id'
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        options={allUsers}
                        getOptionLabel={(option) => option?.fullName || ''}
                        onChange={(_, selected) => field.onChange(selected ? selected.id : null)}
                        value={allUsers.find(user => user.id === field.value) ?? null}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label='Manager'
                            placeholder='Select Manager'
                            fullWidth
                          />
                        )}
                      />
                    )}
                  />

                </Grid>

                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant='contained' type='submit'>
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form >
          </CardContent >
        </Card >
      </Grid >
    </Grid >
  )
}

export default AddNewUserForm
