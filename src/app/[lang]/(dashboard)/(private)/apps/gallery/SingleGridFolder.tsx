import { Grid, IconButton, Tooltip, Typography } from '@mui/material'

import type { Folder } from '@/types'
import { useSettings } from '@/@core/hooks/useSettings'

interface SingleGridFileProps {
  folder: Folder
  
  handleMenuClick: (e: React.MouseEvent<HTMLButtonElement>, folder: Folder) => void
  setActiveDir: (folder: Folder | undefined) => void
}

export default function SingleGridFolder({ folder, handleMenuClick, setActiveDir }: SingleGridFileProps) {
  const { settings } = useSettings()

  return (
    <Grid
      item
      xs={6}
      sm={4}
      md={3}
      lg={1}
      key={folder.id}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: 2,
        position: 'relative',
        transition: 'background-color 0.3s ease',
        '&:hover': {
          backgroundColor: '#434343',
          color: '#fff'
        },
        '&:hover .hover-visible': {
          opacity: 1,
          visibility: 'visible',
          color: '#fff'
        },
        '&:hover .folder-name': {
          color: '#fff'
        }
      }}
    >
      {/* Wrapping the folder content with a clickable div */}
      <div style={{ cursor: 'pointer' }} onClick={() => setActiveDir(folder)}>
        <i
          className={`tabler-folder`}
          style={{
            fontSize: '5rem',
            color: settings.primaryColor
          }}
        ></i>
      </div>

      <Typography variant='body2' className='folder-name'>
        {folder.name.length > 30 ? `${folder.name.substring(0, 30)}...` : folder.name}
      </Typography>

      <Tooltip title='Options' arrow>
        <IconButton
          onClick={e => handleMenuClick(e, folder)}
          className='hover-visible'
          sx={{
            position: 'absolute',
            top: -2,
            color: settings.primaryColor,
            right: -4,
            opacity: 0,
            visibility: 'hidden',
            transition: 'opacity 0.3s ease, visibility 0.3s ease'
          }}
        >
          <i className='tabler-dots-vertical' />
        </IconButton>
      </Tooltip>
    </Grid>
  )
}
