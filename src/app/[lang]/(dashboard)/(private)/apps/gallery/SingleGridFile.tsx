import { Grid, IconButton, Tooltip, Typography } from '@mui/material'

import type { File } from '@/types'
import { useSettings } from '@/@core/hooks/useSettings'

export default function SingleGridFolder({
  file,
  handleMenuClick
}: {
  file: File
  handleMenuClick: (event: React.MouseEvent<HTMLButtonElement>, folder: File) => void
}) {
  const { settings } = useSettings()

  const getFileIcon = (file: File) => {
    if (file.mimeType === 'pdf') {
      return 'tabler-file-type-pdf'
    }
  }

  return (
    <Grid
      item
      xs={6}
      sm={4}
      md={3}
      lg={1}
      key={file.id}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: 2,
        position: 'relative',
        transition: 'background-color 0.3s ease',
        '&:hover': {
          backgroundColor: '#434343'
        },
        '&:hover .hover-visible': {
          opacity: 1,
          visibility: 'visible'
        },
        '&:hover .file-name': {
          color: '#fff'
        },
        '&:hover i': {
          color: '#fff'
        }
      }}
      title={file.name}
    >
      <i
        className={getFileIcon(file)}
        style={{
          fontSize: '4.5rem',
          color: '#757575'
        }}
      ></i>

      <Typography variant='body2' className='file-name'>
        {file.name.length > 30 ? `${file.name.substring(0, 30)}...` : file.name}
      </Typography>

      <Tooltip title='Options' arrow>
        <IconButton
          onClick={e => handleMenuClick(e, file)}
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
          <i className='tabler-dots-vertical ' />
        </IconButton>
      </Tooltip>
    </Grid>
  )
}
