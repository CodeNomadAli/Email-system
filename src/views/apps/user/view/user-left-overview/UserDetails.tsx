// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'

import type { ExtendedUser } from '@/utils/types'

import CustomAvatar from '@core/components/mui/Avatar'

interface Props {
  user: ExtendedUser
}

const UserDetails = ({ user }: Props) => {
  return (
    <>
      <Card>
        <CardContent className='flex flex-col pbs-12 gap-6'>
          <div className='flex flex-col gap-6'>
            <div className='flex items-center justify-center flex-col gap-4'>
              <div className='flex flex-col items-center gap-4'>
                <CustomAvatar alt='user-profile' src='/images/avatars/9.png' variant='rounded' size={120} />
                <Typography variant='h5'>{`${user.first_name} ${user.last_name}`}</Typography>
              </div>
              <Chip label='Author' color='secondary' size='small' variant='tonal' />
            </div>
          </div>
          <div>
            <Typography variant='h5'>Details</Typography>
            <Divider className='mlb-4' />
            <div className='flex flex-col gap-2'>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Username:
                </Typography>
                <Typography>{`${user.first_name} ${user.last_name}`}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Billing Email:
                </Typography>
                <Typography>{user.email}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Role:
                </Typography>
                <Typography color='text.primary'>{user.roles?.map(({ role }) => role.name).join(', ') || ''}</Typography>
              </div>
            </div>
          </div>
          <div className='flex gap-4 justify-center'>
            {/* <OpenDialogOnElementClick
              element={Button}
              elementProps={buttonProps('Edit', 'primary', 'contained')}
              dialog={EditUserInfo}
              dialogProps={{ data: user }}
            /> */}
            {/*  <OpenDialogOnElementClick
              element={Button}
              elementProps={buttonProps('Suspend', 'error', 'tonal')}
              dialog={ConfirmationDialog}
              dialogProps={{ type: 'suspend-account' }}
            />*/}
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default UserDetails
