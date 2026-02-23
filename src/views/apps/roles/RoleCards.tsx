'use client'

// MUI Imports
import type { SetStateAction, Dispatch } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import type { TypographyProps } from '@mui/material/Typography'
import type { CardProps } from '@mui/material/Card'

import RoleDialog from '@components/dialogs/role-dialog'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import Link from '@components/Link'
import { showSuccess, showLoading, hideLoading, showError } from '@/utils/frontend-helper'
import type { RolesExtended } from '@/utils/types'

interface props {
  roles: RolesExtended[]
  fetchRoles: () => void
  setRoles: Dispatch<SetStateAction<RolesExtended[]>>
}

const RoleCards = ({ roles, setRoles, fetchRoles }: props) => {
  // Vars
  const typographyProps: TypographyProps = {
    children: 'Edit Role',
    component: Link,
    color: '#3f50b5',
    onClick: e => e.preventDefault()
  }

  const handleDeleteRole = async (id: string) => {
    showLoading()

    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this role?')

      if (!confirmDelete) return
      const req = await fetch(`/api/roles?roleId=${id}`, { method: 'DELETE' })
      const res = await req.json()

      if (!req.ok) {
        showError(res.message)

        return
      }

      showSuccess(res.message)
      setRoles(prevState => prevState.filter((row: RolesExtended) => row.id !== id))
    } catch (error) {
      console.error(error)
      showError('Something went wrong!')
    } finally {
      hideLoading()
    }
  }

  const CardProps: CardProps = {
    className: 'cursor-pointer bs-full',
    children: (
      <Grid container className='bs-full'>
        <Grid item xs={5}>
          <div className='flex items-end justify-center bs-full'>
            <img alt='add-role' src='/images/illustrations/characters/5.png' height={130} />
          </div>
        </Grid>
        <Grid item xs={7}>
          <CardContent>
            <div className='flex flex-col items-end gap-4 text-right'>
              <Button variant='contained' size='small'>
                Add Role
              </Button>
              <Typography>
                Add new role <br />
                if it doesn&#39;t exist.
              </Typography>
            </div>
          </CardContent>
        </Grid>
      </Grid>
    )
  }

  return (
    <>
      <Grid container spacing={6}>
        {roles.map((role, index) => (
          <Grid item xs={12} sm={6} lg={4} key={index}>
            <Card>
              <CardContent className='flex flex-col gap-4'>
                <div className='flex items-center justify-between'>
                  <Typography className='flex-grow'>{`Total ${role.users.length} users`}</Typography>
                  {
                    <AvatarGroup total={role.users.length} max={4}>
                      {role.users.map((user, index: number) => (
                        <Avatar key={index} src={`${user.image}`} />
                      ))}
                    </AvatarGroup>
                  }
                </div>
                <div className='flex justify-between items-center'>
                  <div className='items-start gap-1'>
                    <Typography variant='h5'>{role.name}</Typography>
                    <OpenDialogOnElementClick
                      element={Typography}
                      triggerBeforeClose={fetchRoles}
                      elementProps={typographyProps}
                      dialog={RoleDialog}
                      dialogProps={{ role }}
                    />
                    <Typography
                      variant='h6'
                      color='error'
                      component='span'
                      ml={3}
                      onClick={e => {
                        e.preventDefault()
                        handleDeleteRole(role.id)
                      }}
                      sx={{ cursor: 'pointer' }}
                    >
                      Delete
                    </Typography>
                  </div>
                  <IconButton>
                    <i className='tabler-copy text-secondary' />
                  </IconButton>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid item xs={12} sm={6} lg={4}>
          <OpenDialogOnElementClick
            element={Card}
            elementProps={CardProps}
            dialog={RoleDialog}
            triggerBeforeClose={fetchRoles}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default RoleCards
