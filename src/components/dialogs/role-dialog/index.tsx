'use client'

// React Imports
import { useState, useEffect, useCallback, useContext } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

// Component Imports
import type { Permission, Roles, RolesOnPermissions } from '@prisma/client'

import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import { showLoading, hideLoading, showError, showSuccess } from '@/utils/frontend-helper'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { SettingsContext } from '@core/contexts/settingsContext'

interface PermissionsWithRole extends RolesOnPermissions {
  permission: Permission
}

interface RoleWithPermission extends Roles {
  permissions: PermissionsWithRole[]
}

type RoleDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  title?: string
  role: RoleWithPermission
}

type DataType =
  | string
  | {
      title: string
      read?: boolean
      write?: boolean
      select?: boolean
    }

const defaultData: DataType[] = [
  'User Management',
  'Content Management',
  'Disputes Management',
  'Database Management',
  'Financial Management',
  'Reporting',
  'API Control',
  'Repository Management',
  'Payroll'
]

const RoleDialog = ({ open, setOpen, role }: RoleDialogProps) => {
  const { permissions = [] } = useContext(SettingsContext)!.settings

  // States
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(role ? [...permissions] : [])
  const [defaultPermissions, setDefaultPermissions] = useState<Permission[]>([])
  const [isIndeterminateCheckbox, setIsIndeterminateCheckbox] = useState<boolean>(false)

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    if (role) {
      setSelectedPermissions(role.permissions.map(permission => permission.permission.name))
    }
  }, [role])

  const fetchPermissions = useCallback(async () => {
    showLoading()

    try {
      const req = await fetch('/api/permissions')
      const res = await req.json()

      if (req.ok) {
        setDefaultPermissions(res.data)
      }
    } catch (error) {
      console.error(error)
      showError('An unknown error occurred')
    } finally {
      hideLoading()
    }
  }, [])

  useEffect(() => {
    fetchPermissions()
  }, [fetchPermissions])

  const togglePermission = (id: string) => {
    const arr = selectedPermissions

    if (selectedPermissions.includes(id)) {
      arr.splice(arr.indexOf(id), 1)
      setSelectedPermissions([...arr])
    } else {
      arr.push(id)
      setSelectedPermissions([...arr])
    }
  }

  const handleSelectAllCheckbox = () => {
    if (isIndeterminateCheckbox) {
      setSelectedPermissions([])
    } else {
      defaultPermissions.forEach(row => {
        const id = (typeof row === 'string' ? row : row.name).toLowerCase().split(' ').join('-')

        togglePermission(id)
      })
    }
  }

  useEffect(() => {
    if (selectedPermissions.length > 0 && selectedPermissions.length < defaultData.length * 3) {
      setIsIndeterminateCheckbox(true)
    } else {
      setIsIndeterminateCheckbox(false)
    }
  }, [selectedPermissions])

  const renamePermission = (permission: string) => {
    return permission
      .split(':')
      .map((word, index) =>
        index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(' ')
  }

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()
    showLoading()

    try {
      const formData = new FormData(event.target as HTMLFormElement)
      const formValues = Object.fromEntries(formData.entries())

      const req = await fetch('/api/roles', {
        method: role ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          id: role ? role.id : '',
          name: formValues.roleName as string,
          isDefault: formValues.isDefault == undefined ? 'false' : ('true' as string),
          permissions: selectedPermissions.join(',')
        }).toString()
      })

      const res = await req.json()

      if (req.ok) {
        handleClose()
        showSuccess(res.message)
      } else {
        showError(res.message || 'Failed to save role')
      }
    } catch (error) {
      console.error(error)
      showError('An unknown error occurred')
    } finally {
      hideLoading()
    }
  }

  return (
    <Dialog
      fullWidth
      maxWidth='md'
      scroll='body'
      open={open}
      onClose={handleClose}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='flex flex-col gap-2 text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        {role ? 'Edit Role' : 'Add Role'}
        <Typography component='span' className='flex flex-col text-center'>
          Set Role Permissions
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSave}>
        <DialogContent className='overflow-visible flex flex-col gap-6 pbs-0 sm:pli-16'>
          <CustomTextField
            label='Role Name'
            variant='outlined'
            fullWidth
            name='roleName'
            placeholder='Enter Role Name'
            defaultValue={role?.name || ''}
          />
          <Typography variant='h5' className='min-is-[225px]'>
            Role Permissions
          </Typography>
          <div className='overflow-x-auto'>
            <FormControlLabel
              className='mie-0 capitalize'
              control={<Checkbox className='ml-1' defaultChecked={role?.isDefault} />}
              label='Set Default Role'
              value={true}
              name='isDefault'
            />
            <table className={tableStyles.table}>
              <tbody>
                <tr className='border-bs-0'>
                  <th className='pis-0'>
                    <Typography color='text.primary' className='font-medium whitespace-nowrap flex-grow min-is-[225px]'>
                      Administrator Access
                    </Typography>
                  </th>
                  <th className='!text-end pie-0'>
                    <FormControlLabel
                      className='mie-0 capitalize'
                      control={
                        <Checkbox
                          onChange={handleSelectAllCheckbox}
                          indeterminate={isIndeterminateCheckbox}
                          checked={selectedPermissions.length === defaultData.length * 3}
                        />
                      }
                      label='Select All'
                    />
                  </th>
                </tr>
                {defaultPermissions.map((permission, index) => {
                  return (
                    <tr key={index} className='border-be'>
                      <td className='!text-end pie-0'>
                        <FormGroup>
                          <FormControlLabel
                            label={renamePermission(permission.name)}
                            control={
                              <Checkbox
                                onChange={() => togglePermission(permission.name)}
                                checked={selectedPermissions.includes(permission.name)}
                              />
                            }
                          />
                        </FormGroup>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' type='submit'>
            Submit
          </Button>
          <Button variant='tonal' type='reset' color='secondary' onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default RoleDialog
