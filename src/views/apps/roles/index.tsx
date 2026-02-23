'use client'

import { useState, useCallback, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Type Imports
// import type { Roles as RoleType } from '@prisma/client'
import { showLoading, hideLoading, showError } from '@/utils/frontend-helper'
import type { RolesExtended } from '@/utils/types'

// Component Imports
import RoleCards from './RoleCards'

const Roles = () => {
  const [roles, setRoles] = useState<RolesExtended[]>([])

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

  useEffect(() => {
    fetchRoles()
  }, [fetchRoles])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4' className='mbe-1'>
          Roles List
        </Typography>
        <Typography>
          A role provided access to predefined menus and features so that depending on assigned role an administrator
          can have access to what he need
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <RoleCards fetchRoles={fetchRoles} setRoles={setRoles} roles={roles} />
      </Grid>
      {/* <Grid item xs={12} className='!pbs-12'>
        <Typography variant='h4' className='mbe-1'>
          Total users with their roles
        </Typography>
        <Typography>Find all of your company&#39;s administrator accounts and their associate roles.</Typography>
      </Grid>
      <Grid item xs={12}>
        <RolesTable tableData={userData} />
      </Grid> */}
    </Grid>
  )
}

export default Roles
